(function(){
window.ccOn=()=>!!LS('set').cc;
function setCC(on){const s=LS('set');s.cc=!!on;SV('set',s);syncB();applyAll(true)}
const st=document.createElement('style');st.textContent='.ccb{position:absolute;right:8px;top:8px;z-index:9;background:#000a;color:#fff;border:2px solid #fff8;border-radius:6px;font:bold 13px system-ui;padding:4px 8px}.ccb.on{background:#fbbf24;color:#000;border-color:#fbbf24}.pw{position:relative;flex:none}#cctoast{position:fixed;left:50%;bottom:12%;transform:translateX(-50%);background:#000d;color:#fff;padding:10px 16px;border-radius:8px;z-index:99;display:none}.srow{display:flex;align-items:center;justify-content:space-between;padding:16px 14px;border-bottom:1px solid #222;cursor:pointer}.sw{width:52px;height:28px;border-radius:14px;background:#444;position:relative}.sw:after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:.2s}.sw.on{background:#22c55e}.sw.on:after{left:27px}::cue{font-size:1.1em}';document.head.appendChild(st);
const T=document.createElement('div');T.id='cctoast';document.body.appendChild(T);
function toast(m){T.textContent=m;T.style.display='block';clearTimeout(T._t);T._t=setTimeout(()=>T.style.display='none',2500)}
// wrap players with CC button
function wrap(el){const w=document.createElement('div');w.className='pw';el.parentNode.insertBefore(w,el);w.appendChild(el);return w}
const lw=document.createElement('div');lw.className='pw';lyt.parentNode.insertBefore(lw,lyt);lw.appendChild(lyt);lw.appendChild(lvid);
const dw=wrap(vid);dw.style.position='sticky';dw.style.top='0';dw.style.zIndex='5';vid.style.position='static';
function syncB(){const s=document.getElementById('ccsw');if(s)s.classList.toggle('on',ccOn())}
// text tracks
function isEn(t){return !t.language||/^en/i.test(t.language)||/english|cc1|caption/i.test(t.label||'')}
function applyTracks(v,report){const on=ccOn();let any=false,shown=false;for(const t of v.textTracks){if(t.kind!='subtitles'&&t.kind!='captions')continue;any=true;const sh=on&&isEn(t)&&!shown;t.mode=sh?'showing':'hidden';if(sh)shown=true}
 if((typeof hls!="undefined"&&hls)&&v===lvid){try{if(on&&hls.subtitleTracks.length){const i=hls.subtitleTracks.findIndex(isEn);hls.subtitleTrack=i>=0?i:0;hls.subtitleDisplay=true;shown=true}else hls.subtitleDisplay=false}catch(e){}}
 if(report&&on&&!shown)toast('No captions available');return shown}
lvid.textTracks.addEventListener('addtrack',()=>applyTracks(lvid));[lvid,vid].forEach(v=>v.textTracks.addEventListener('change',()=>{clearTimeout(v._cc);v._cc=setTimeout(()=>applyTracks(v),50)}));vid.textTracks.addEventListener('addtrack',()=>applyTracks(vid));
let ytCur=null;
function applyAll(rep){const lv=stack.at(-1)=='livev',dt=stack.at(-1)=='det';
 if(lv&&lyt.style.display!='none'&&ytCur){lyt.src=lyt.src.replace(/([?&])cc=\d/,'$1cc='+(ccOn()?1:0)).replace(/&cc_load_policy=\d(&cc_lang_pref=en)?/,'')+(lyt.src.includes('youtube.com/embed')?(ccOn()?'&cc_load_policy=1&cc_lang_pref=en':'&cc_load_policy=0'):'');if(rep&&ccOn())toast('Captions requested from YouTube (shown if the channel provides them)');return}
 if(lv)applyTracks(lvid,rep);if(dt)applyTracks(vid,rep)}
// live hook
const ol=window.lplay;window.lplay=async function(i,k,b){ytCur=LIVE[i][k][1].startsWith('yt:');await ol(i,k,b);
 if(!ytCur&&typeof hls!="undefined"&&hls){hls.on(Hls.Events.MANIFEST_PARSED,()=>setTimeout(()=>applyAll(false),300));hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED,()=>applyAll(false));setTimeout(()=>{if(ccOn()&&!applyTracks(lvid))toast('No captions on this channel')},8000)}};
// IA subtitles
function srt2vtt(s){return 'WEBVTT\n\n'+s.replace(/\r/g,'').replace(/^\uFEFF/,'').replace(/(\d{1,2}):(\d\d):(\d\d)[,.](\d{1,3})/g,(m,h,mi,s,f)=>h.padStart(2,'0')+':'+mi+':'+s+'.'+f.padEnd(3,'0'))}
const od=window.det;window.det=function(id){[...vid.querySelectorAll('track')].forEach(t=>t.remove());od(id);if(String(vid.src).startsWith('file:'))return;
 fetch('https://archive.org/metadata/'+id+'/files').then(r=>r.json()).then(j=>{const fs=(j.result||[]).filter(f=>/\.(srt|vtt)$/i.test(f.name));
  const f=fs.find(f=>/(\.|_|-)(en|eng|english)\.(srt|vtt)$/i.test(f.name))||fs.find(f=>!/(\.|_|-)(es|spa|fr|fre|de|ger|it|pt|ru|nl|ja|zh)\.(srt|vtt)$/i.test(f.name));
  if(!f){if(ccOn())setTimeout(()=>toast('No captions available'),1500);return}
  fetch('https://archive.org/download/'+id+'/'+encodeURIComponent(f.name)).then(r=>r.text()).then(t=>{if(curId!=id)return;const v=/\.srt$/i.test(f.name)?srt2vtt(t):t;
   const tr=document.createElement('track');tr.kind='subtitles';tr.srclang='en';tr.label='English';tr.src=URL.createObjectURL(new Blob([v],{type:'text/vtt'}));vid.appendChild(tr);setTimeout(()=>applyTracks(vid),300)})}).catch(()=>{})};
// settings screen
window.openSet=function(){hd.textContent='DOOR 15 · SETTINGS';try{setdrv.textContent=(me()||{}).name||'Driver'}catch(e){}
 setlist.innerHTML='<div class="srow" tabindex="0" onclick="ccFlip()"><div><b>English closed captions</b><br><span style="color:#999;font-size:13px">Live channels, YouTube channels and movies (when captions exist)</span></div><div id="ccsw" class="sw"></div></div><p style="padding:14px;color:#666;font-size:13px">More settings coming soon.</p>';syncB();go('setv')};
window.ccFlip=()=>{setCC(!ccOn());toast('English captions '+(ccOn()?'ON':'OFF'))};
syncB();
// re-sync when driver changes
const orp=window.renderP;if(orp)window.renderP=function(){const r=orp.apply(this,arguments);syncB();return r};
})();
