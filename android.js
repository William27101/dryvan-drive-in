(function(){
// D-pad / TV focus
function mk(){document.querySelectorAll('[onclick],button,input,.item,a').forEach(e=>{if(!e.hasAttribute('tabindex')&&e.tagName!='INPUT'&&e.tagName!='BUTTON'&&e.tagName!='A')e.setAttribute('tabindex','0')})}
new MutationObserver(mk).observe(document.documentElement,{subtree:true,childList:true});mk();
var st=document.createElement('style');st.textContent=':focus{outline:4px solid #fbbf24!important;outline-offset:2px}';document.head.appendChild(st);
function vis(e){var r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!='hidden'&&e.offsetParent!==null}
document.addEventListener('keydown',function(ev){var k=ev.key,a=document.activeElement;
 if(k=='Enter'&&a&&a.tagName!='INPUT'&&a.tagName!='BUTTON'&&a.tagName!='A'&&a.tagName!='VIDEO'){a.click();ev.preventDefault();return}
 var d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[k];if(!d)return;
 if(a&&a.tagName=='VIDEO')return;if(a&&a.tagName=='INPUT'&&d[1]==0)return;
 var c=Array.from(document.querySelectorAll('[tabindex],button,input,a[href],video')).filter(vis);
 if(!a||a==document.body||!vis(a)){if(c[0])c[0].focus();ev.preventDefault();return}
 var r=a.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,best=null,bs=1e9;
 c.forEach(function(e){if(e==a)return;var q=e.getBoundingClientRect(),x=q.left+q.width/2-cx,y=q.top+q.height/2-cy,p=x*d[0]+y*d[1];if(p<=4)return;var s=p+Math.abs(x*d[1]+y*d[0])*2.5;if(s<bs){bs=s;best=e}});
 if(best){best.focus();best.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});ev.preventDefault()}
},true);
// Offline downloads
if(window.AndroidDL){
 window.dl=function(){if(!vid.src||vid.src.startsWith('file:'))return;var o=LS('ml');o[curId]={title:curT,url:vid.src,at:Date.now()};SV('ml',o);AndroidDL.download(curId,vid.src,curT||curId);dlb.textContent='⬇ Downloading… (see notification)'};
 var od=window.det;window.det=function(id){var f=AndroidDL.local(id);if(f){go('det');curId=id;var m=LS('ml')[id]||{};curT=m.title||id;dt.textContent=curT;dm.textContent='Offline copy on this device';dd.textContent='';dlb.textContent='✓ In My Loads (offline)';vid.src=f;var c=LS('cw')[id];if(c)vid.addEventListener('loadedmetadata',function(){vid.currentTime=c.t},{once:true});return}return od(id)};
}
})();
