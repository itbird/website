import {journey, samples, temperature, intervals, annualSaved} from './models.mjs';
const $ = s => document.querySelector(s);
const svg = 'http://www.w3.org/2000/svg';
const contextCards = [
 {lede:'In 2022, ',number:'1.05 billion tonnes',tail:' of food waste were generated worldwide.',source:'UNEP, 2024 ↗',note:'Retail, food service & households; includes inedible parts.',url:'https://www.unep.org/news-and-stories/press-release/world-squanders-over-1-billion-meals-day-un-report'},
 {lede:'Australia wastes around ',number:'7.6 million tonnes',tail:' of food each year.',source:'DCCEEW, 2025 ↗',note:'Estimate from the National Food Waste Strategy Feasibility Study.',url:'https://www.dcceew.gov.au/environment/protection/waste/food-waste'},
 {lede:'Globally, about ',number:'19% of food',tail:' available to consumers was wasted in 2022.',source:'UNEP Food Waste Index ↗',note:'Retail, food service & households; the estimate includes inedible parts.',url:'https://www.unep.org/resources/publication/food-waste-index-report-2024'}
];
if ($('#context-number')) {
 let contextIndex=0;
 let contextTimer;
 const showContext=()=>{const c=contextCards[contextIndex];$('#context-lede').textContent=c.lede;$('#context-number').textContent=c.number;$('#context-tail').textContent=c.tail;$('#context-source').href=c.url;$('#context-source').firstChild.textContent=c.source;$('#context-note').textContent=c.note;};
 const restartContextTimer=()=>{window.clearInterval(contextTimer);contextTimer=window.setInterval(()=>{contextIndex=(contextIndex+1)%contextCards.length;showContext();},8000);};
 const moveContext=step=>{contextIndex=(contextIndex+step+contextCards.length)%contextCards.length;showContext();restartContextTimer();};
 $('#context-prev').addEventListener('click',()=>moveContext(-1));
 $('#context-next').addEventListener('click',()=>moveContext(1));
 showContext();
 restartContextTimer();
}
function el(name, attrs, parent, text) { const n=document.createElementNS(svg,name); for(const [k,v] of Object.entries(attrs)) n.setAttribute(k,v); if(text!==undefined)n.textContent=text; parent.append(n); return n; }
function chart(root,maxX,unit) {
  root.replaceChildren(); const x=t=>48+t/maxX*530, y=t=>220-t/20*195;
  for(const temp of [4,8,12,16,20]) {el('line',{x1:48,y1:y(temp),x2:578,y2:y(temp),stroke:'#dce1d2','stroke-width':1},root);el('text',{x:35,y:y(temp)+4,'text-anchor':'end'},root,`${temp}°`);}
  for(const time of [0,maxX/4,maxX/2,maxX*3/4,maxX]) el('text',{x:x(time),y:246,'text-anchor':'middle'},root,`${time}${unit}`);
  return {x,y};
}
function line(root,points,scale,color,width=3,dash='') {el('polyline',{points:points.map(([a,b])=>`${scale.x(a)},${scale.y(b)}`).join(' '),fill:'none',stroke:color,'stroke-width':width,'stroke-linejoin':'round','stroke-dasharray':dash},root);}
function updateJourney(){const hours=Number($('#delay').value), data=journey(hours); $('#delay-value').textContent=`${hours} ${hours===1?'hour':'hours'}`;const root=$('#journey-chart'),scale=chart(root,12,'h');line(root,data.points,scale,'#bf7544',3);line(root,[[0,4],[12,4]],scale,'#4b7550',3,'6 4');$('#exposure').replaceChildren(document.createTextNode(data.exposure),Object.assign(document.createElement('span'),{textContent:'°C·h'}));$('#journey-takeaway').textContent=hours===0?'With no interruption, both histories match. Now move the slider to add what an arrival check would miss.':`Both arrive at 4°C, but one spent ${hours} ${hours===1?'hour':'hours'} at 16°C. The final 4°C reading hides that exposure — and its possible effects on quality and remaining shelf life.`;$('#batch-b').classList.toggle('has-interruption',hours>0);$('#batch-history').textContent=hours>0?`${hours} hours at 16°C, then back to 4°C`:'12 hours at 4°C — same as Batch A';$('#quality-a').textContent=hours>0?'Better preserved':'Same temperature history';$('#quality-b').textContent=hours>0?'More degradation possible':'Same temperature history';$('#life-a').textContent=hours>0?'Potentially longer':'No difference from this history';$('#life-b').textContent=hours>0?'Potentially shorter':'No difference from this history';$('#batch-summary').textContent=hours>0?'Same final temperature does not guarantee the same quality or remaining shelf life.':'Here, both batches have the same initial condition and temperature exposure.';$('#batch-conclusion').textContent=hours>0?'Cooling back down does not reverse degradation.':'Without an interruption, these histories are the same.';root.setAttribute('aria-label',`Both shipments arrive at 4 degrees Celsius. One spends ${hours} hours at 16 degrees; extra exposure ${data.exposure} degree hours.`);}
function updateSensor(){const interval=intervals[Number($('#interval').value)],data=samples(interval);$('#interval-value').textContent=`${interval} minutes`;const root=$('#sensor-chart'),scale=chart(root,120,'m');line(root,Array.from({length:121},(_,t)=>[t,temperature(t)]),scale,'#bf7544',3);for(const [t,v] of data.points)el('circle',{cx:scale.x(t),cy:scale.y(v),r:4,fill:'#4b7550',stroke:'#f3f4ec','stroke-width':1.5},root);$('#recorded').replaceChildren(document.createTextNode(data.peak),Object.assign(document.createElement('span'),{textContent:'°C'}));$('#sensor-takeaway').textContent=data.peak===4?'Every recorded sample says 4°C. The spike still happened. Sparse readings can hide an event entirely.':data.peak===12?'This sampling schedule captures the 12°C peak. Capturing an event still does not tell us its cause or the food’s condition.':`This schedule captures ${data.peak}°C, but misses the 12°C peak. More frequent sampling gives a fuller picture in this example.`;const missed=data.peak===4,full=data.peak===12;$('#sensor-verdict').textContent=missed?'No spike recorded':full?'Peak captured':'Only part of the spike captured';$('#sensor-evidence').textContent=missed?'All samples read 4°C. The temperature still reached 12°C.':`The highest sample is ${data.peak}°C. ${full?'The peak is visible.':'The true 12°C peak is still missing.'}`;$('#sensor-consequence').textContent=missed?'A chance to act is missed':'An opportunity to investigate';$('#sensor-risk').textContent=missed?'Quality loss or shorter shelf life could go unnoticed.':'The event can prompt a check of cooling, handling and product condition.';$('#sensor-ai-title').textContent=missed?'Flag an evidence gap':'Connect the event to context';$('#sensor-ai').textContent=missed?'AI could flag sparse coverage and ask for door events or another sensor.':'AI could detect patterns, link them to events and prioritise human review.';$('#finer-sampling').textContent=interval===5?'Record temperature every 30 minutes →':'Record temperature every 5 minutes →';root.setAttribute('aria-label',`A simulated peak of 12 degrees Celsius. Sampling every ${interval} minutes records a maximum of ${data.peak} degrees.`);}
function updateScale(){const percent=Number($('#reduction').value);$('#reduction-value').textContent=`${percent}%`;$('#saved').textContent=annualSaved(percent).toLocaleString('en-AU');$('#scale-rate').textContent=`${percent}%`;$('#crates').replaceChildren(...Array.from({length:100},(_,i)=>{const n=document.createElement('i');if(i<percent*10)n.className='filled';return n;}));}
if($('#lab')){
 const tabs=[...document.querySelectorAll('[data-lab]')];
 function activate(tab){for(const t of tabs){const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;$(`#panel-${t.dataset.lab}`).hidden=!active;}}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%3;else if(e.key==='ArrowLeft')next=(i+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();activate(tabs[next]);tabs[next].focus();});});
 $('#delay').addEventListener('input',updateJourney);$('#interval').addEventListener('input',updateSensor);$('#finer-sampling').addEventListener('click',()=>{$('#interval').value=Number($('#interval').value)===0?'3':'0';updateSensor();});$('#reduction').addEventListener('input',updateScale);updateJourney();updateSensor();updateScale();
}
if ($('#motion')) {
 let paused = false;
 function syncMotion() {
  // Autoplay is the site's chosen default; the visitor can pause at any time.
  document.body.classList.add('motion-enabled');
  document.body.classList.toggle('motion-paused', paused || document.hidden);
  $('#motion').setAttribute('aria-pressed', String(paused));
  $('#motion').textContent = paused ? 'Play animation' : 'Pause animation';
 }
 $('#motion').addEventListener('click', () => { paused = !paused; syncMotion(); });
 document.addEventListener('visibilitychange', syncMotion);
 syncMotion();
}
