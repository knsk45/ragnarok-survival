// One cancellable animation chain; simulation runs at a fixed 60 Hz.
(function(root){
 function create({request,cancel,step,render,active,onError}){
  let id=null,last=null,accumulator=0,running=false,generation=0;
  function stop(){running=false;generation++;if(id!==null)cancel(id);id=null;last=null;accumulator=0;}
  function start(){stop();running=true;const token=generation;
   function frame(now){
    if(!running||token!==generation)return;id=null;
    const delta=last===null?0:Math.max(0,Math.min(.25,(now-last)/1000));last=now;accumulator+=delta;
    try{while(accumulator>=1/60&&active()){step(1/60);accumulator-=1/60;}render();}
    catch(error){stop();onError(error);return;}
    if(running&&active())id=request(frame);else stop();
   }
   id=request(frame);
  }
  return {start,stop,isRunning:()=>running};
 }
 root.RSClock={create};if(typeof module!=='undefined')module.exports=root.RSClock;
})(typeof window!=='undefined'?window:globalThis);
