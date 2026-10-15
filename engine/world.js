// Shared collision grid, flow field and 2D rendering for source-derived RO maps.
(function(root){
 function create(data){
  const {width:w,height:h,tileSize:t}=data,n=w*h,cells=new Uint8Array(n),distance=new Int32Array(n),queue=new Int32Array(n),component=new Uint8Array(n);
  let offset=0,enabled=false,lastTarget=-1,mini=null;
  for(const [count,type]of data.terrainRle){cells.fill(type,offset,offset+count);offset+=count;}
  if(offset!==n)throw Error('Invalid map navigation length');
  const index=(cx,cy)=>cy*w+cx,inside=(cx,cy)=>cx>=0&&cy>=0&&cx<w&&cy<h;
  const tile=(cx,cy)=>inside(cx,cy)?cells[index(cx,cy)]:0;
  const walk=(cx,cy)=>!!(tile(cx,cy)&1);
  // World origin remains a clear tile near the original western Payon entrance.
  const ox=60,oy=310;
  const point=(cx,cy)=>({x:(cx-ox+.5)*t,y:(cy-oy+.5)*t});
  const coord=(x,y)=>({x:Math.floor(x/t+ox),y:Math.floor(y/t+oy)});
  function free(x,y,r=7){
   if(!enabled)return true;
   const a=coord(x-r,y-r),b=coord(x+r,y+r);
   for(let cy=a.y;cy<=b.y;cy++)for(let cx=a.x;cx<=b.x;cx++){
    if(walk(cx,cy))continue;
    const px=Math.max((cx-ox)*t,Math.min(x,(cx-ox+1)*t)),py=Math.max((cy-oy)*t,Math.min(y,(cy-oy+1)*t));
    if((x-px)**2+(y-py)**2<r*r||r===0)return false;
   }
   return true;
  }
  function line(a,b,r=0,projectile=false){
   if(!enabled)return true;
   const count=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/5));
   for(let i=0;i<=count;i++){
    const x=a.x+(b.x-a.x)*i/count,y=a.y+(b.y-a.y)*i/count;
    if(projectile){const c=coord(x,y);if(!(tile(c.x,c.y)&3))return false;}
    else if(!free(x,y,r))return false;
   }return true;
  }
  function move(o,dx,dy,r=7){
   if(!Number.isFinite(dx)||!Number.isFinite(dy))return;
   if(!enabled){o.x+=dx;o.y+=dy;return;}
   const count=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));dx/=count;dy/=count;
   for(let i=0;i<count;i++){
    if(free(o.x+dx,o.y+dy,r)){o.x+=dx;o.y+=dy;continue;}
    if(free(o.x+dx,o.y,r))o.x+=dx;
    if(free(o.x,o.y+dy,r))o.y+=dy;
   }
  }
  function safe(o,r=7,connected=false){
   if(!enabled)return o;
   const raw=coord(o.x,o.y),c={x:Math.max(0,Math.min(w-1,raw.x)),y:Math.max(0,Math.min(h-1,raw.y))},valid=(cx,cy)=>inside(cx,cy)&&walk(cx,cy)&&(!connected||component[index(cx,cy)])&&free(point(cx,cy).x,point(cx,cy).y,r);
   if(free(o.x,o.y,r)&&(!connected||component[index(c.x,c.y)]))return o;
   for(let radius=0;radius<Math.max(w,h);radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
    if(Math.abs(dx)!==radius&&Math.abs(dy)!==radius)continue;
    if(valid(c.x+dx,c.y+dy)){Object.assign(o,point(c.x+dx,c.y+dy));return o;}
   }
   throw Error('No walkable map spawn');
  }
  const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
  function flood(start,output){
   output.fill(-1);let head=0,tail=0;queue[tail++]=start;output[start]=0;
   while(head<tail){const i=queue[head++],cx=i%w,cy=Math.floor(i/w);
    for(const [dx,dy]of dirs){const nx=cx+dx,ny=cy+dy,j=index(nx,ny);if(inside(nx,ny)&&walk(nx,ny)&&output[j]<0){output[j]=output[i]+1;queue[tail++]=j;}}
   }return tail;
  }
  enabled=true;const spawn=safe({x:0,y:0});const start=coord(spawn.x,spawn.y);flood(index(start.x,start.y),distance);for(let i=0;i<n;i++)component[i]=distance[i]>=0?1:0;enabled=false;
  function activate(value){enabled=!!value;lastTarget=-1;return {...spawn};}
  function flow(P){const c=coord(P.x,P.y),target=index(c.x,c.y);if(target!==lastTarget&&inside(c.x,c.y)&&walk(c.x,c.y)){flood(target,distance);lastTarget=target;}}
  function direction(e,P){
   const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||1;
   if(!enabled||line(e,P,7))return {x:dx/d,y:dy/d};
   flow(P);const c=coord(e.x,e.y);let best=null,rank=Infinity;
   // A shared reverse BFS lets all monsters route around the same obstacle.
   for(const [sx,sy]of [[0,0],...dirs]){const cx=c.x+sx,cy=c.y+sy;if(!inside(cx,cy))continue;const score=distance[index(cx,cy)],p=point(cx,cy);
    if(score<0||!line(e,p,7))continue;
    const value=score*t+Math.hypot(p.x-e.x,p.y-e.y);if(value<rank&&Math.hypot(p.x-e.x,p.y-e.y)>2){rank=value;best=p;}
   }
   if(!best)return {x:0,y:0};const length=Math.hypot(best.x-e.x,best.y-e.y)||1;return {x:(best.x-e.x)/length,y:(best.y-e.y)/length};
  }
  function spawnPoint(P,W,H,r=7,random=Math.random){
   if(!enabled)return null;
   for(let pass=0;pass<2;pass++)for(let i=0;i<160;i++){
    const angle=random()*Math.PI*2,range=pass?180+random()*420:Math.hypot(W,H)/2+60+random()*240;
    const p={x:P.x+Math.cos(angle)*range,y:P.y+Math.sin(angle)*range},c=coord(p.x,p.y);
    if(!inside(c.x,c.y)||!component[index(c.x,c.y)]||!free(p.x,p.y,r))continue;
    if(!pass&&Math.abs(p.x-P.x)<W/2+30&&Math.abs(p.y-P.y)<H/2+30)continue;
    return p;
   }return null;
  }
  const noise=(cx,cy)=>{let a=Math.imul(cx+19,374761393)^Math.imul(cy+41,668265263);a=Math.imul(a^(a>>>13),1274126177);return (a>>>0)/4294967295;};
  function draw(x,P,W,H){
   if(!enabled)return false;
   const a=coord(P.x-W/2-t*3,P.y-H/2-t*3),b=coord(P.x+W/2+t*3,P.y+H/2+t*3);
   x.fillStyle='#243d33';x.fillRect(0,0,W,H);
   for(let cy=Math.max(0,a.y);cy<=Math.min(h-1,b.y);cy++)for(let cx=Math.max(0,a.x);cx<=Math.min(w-1,b.x);cx++){
    const px=(cx-ox)*t-P.x+W/2,py=(cy-oy)*t-P.y+H/2,v=tile(cx,cy),q=noise(cx,cy);
    x.fillStyle=v&1?(q>.66?'#80945a':q>.25?'#788e53':'#71884e'):v&8?'#5b6353':'#304d38';x.fillRect(px,py,t+1,t+1);
    if(v&1){
     if(!walk(cx,cy+1)){x.fillStyle='#344c35';x.fillRect(px,py+t-3,t,3);}
     x.fillStyle=q>.5?'#a1ac72':'#617c47';x.fillRect(px+q*17+2,py+7,2,3);x.fillRect(px+12,py+18,4,1);
     if(q>.985){x.fillStyle='#ddc98b';x.fillRect(px+8,py+13,3,2);}
    }else if(v&8){
     x.fillStyle='#838777';x.fillRect(px+3,py+2,17,3);x.fillStyle='#3e493d';x.fillRect(px+4,py+11,15,8);
    }else if(cx%2===0&&cy%2===0){
     // Deterministic crowns sit entirely in blocked terrain; no fake solid trees on paths.
     const center=px+12,base=py+22;
     x.fillStyle='#203829';x.beginPath();x.ellipse(center+6,base+6,21,12,0,0,Math.PI*2);x.fill();
     x.fillStyle='#584b35';x.fillRect(center-3,base-18,6,25);
     for(const [dx,dy,r,color]of [[0,-24,22,'#2c5437'],[-13,-25,16,'#386640'],[12,-29,18,'#426f43'],[-2,-41,17,'#4b7948']]){x.fillStyle=color;x.beginPath();x.arc(center+dx,base+dy,r,0,Math.PI*2);x.fill();}
    }
   }return true;
  }
  function minimap(x,P,W,H){
   if(!enabled)return;
   if(!mini){mini=root.document.createElement('canvas');mini.width=w;mini.height=h;const m=mini.getContext('2d');for(let cy=0;cy<h;cy++)for(let cx=0;cx<w;cx++){const v=tile(cx,cy);m.fillStyle=v&1?'#a5bc79':v&8?'#72776a':'#284b36';m.fillRect(cx,cy,1,1);}}
   const scale=W<600?.27:.36,mw=w*scale,mh=h*scale,left=W-mw-12,top=110;
   x.save();x.fillStyle='#12231ce6';x.fillRect(left-5,top-21,mw+10,mh+26);x.globalAlpha=.9;x.drawImage(mini,left,top,mw,mh);x.globalAlpha=1;
   const c=coord(P.x,P.y);x.strokeStyle='#ffffff70';x.lineWidth=1;x.strokeRect(left+(c.x-W/t/2)*scale,top+(c.y-H/t/2)*scale,W/t*scale,H/t*scale);
   x.fillStyle='#ffe08b';x.beginPath();x.arc(left+c.x*scale,top+c.y*scale,3,0,Math.PI*2);x.fill();x.font='10px Arial';x.textAlign='left';x.fillStyle='#f6edcc';x.fillText('PAY_FILD08',left,top-8);x.restore();
  }
  return {activate,free,line,move,safe,direction,spawnPoint,draw,minimap,point,coord,walk,tile,spawn,enabled:()=>enabled,width:w,height:h,tileSize:t,component};
 }
 root.RSWorld={create};if(typeof module!=='undefined')module.exports=root.RSWorld;
})(typeof window!=='undefined'?window:globalThis);
