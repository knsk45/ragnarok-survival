// Recover transient requests and APNG decode failures without replacing source art.
(function(root){
 function load({url,fallback,Image=root.Image,ready=()=>{},schedule=(fn,ms)=>root.setTimeout(fn,ms),cancel=id=>root.clearTimeout(id),version=''}){
  const primary=new Image();let backup=null,retries=0,retryTimer=null,slowTimer=null;
  const valid=image=>!!(image?.complete&&image.naturalWidth&&image.naturalHeight);
  function useBackup(){
   if(!fallback||backup)return;
   backup=new Image();backup.onload=ready;backup.src=fallback;
  }
  primary.onload=()=>{cancel(slowTimer);cancel(retryTimer);ready();};
  primary.onerror=()=>{
   useBackup();
   if(retries>=2)return;
   retries++;retryTimer=schedule(()=>{primary.src=url+(url.includes('?')?'&':'?')+'v='+encodeURIComponent(version)+'&retry='+retries;},retries*750);
  };
  slowTimer=schedule(()=>{if(!valid(primary))useBackup();},1200);
  // Handlers must be installed before src, including cached synchronous completion.
  primary.src=url;
  return {current:()=>valid(primary)?primary:valid(backup)?backup:null,primary};
 }
 root.RSSprites={load};if(typeof module!=='undefined')module.exports=root.RSSprites;
})(typeof window!=='undefined'?window:globalThis);
