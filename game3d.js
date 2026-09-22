import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const canvas=document.querySelector('#scene');
const message=document.querySelector('#message'),timeEl=document.querySelector('#time'),bestEl=document.querySelector('#best'),clawedEl=document.querySelector('#clawed'),won=document.querySelector('#won'),result=document.querySelector('#result'),badge=document.querySelector('#badge');
const restart=document.querySelector('#restart'),again=document.querySelector('#again');
const BEST='nestEscape3DBest';
const state={x:-8,y:0,vx:0,vy:0,grounded:true,active:true,keys:new Set(),elapsed:0,clawed:0,best:readBest(),last:performance.now()};
function readBest(){try{return Number(localStorage.getItem(BEST))||0}catch{return 0}}
function saveBest(v){try{localStorage.setItem(BEST,v)}catch{}}
function note(text,type=''){message.textContent=text;message.className=type}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}

const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x070a1b);scene.fog=new THREE.Fog(0x080a1d,23,52);
const camera=new THREE.PerspectiveCamera(47,innerWidth/innerHeight,.1,100);camera.position.set(0,8.1,21.8);camera.lookAt(0,3.1,0);
scene.add(new THREE.HemisphereLight(0x9da9ff,0x151225,1.8));
const key=new THREE.DirectionalLight(0xffe5bf,2.4);key.position.set(-8,14,10);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
const cyanLight=new THREE.PointLight(0x45ddec,18,14,2);cyanLight.position.set(-9,4,2);scene.add(cyanLight);
const pinkLight=new THREE.PointLight(0xff4f9c,23,16,2);pinkLight.position.set(9,5,2);scene.add(pinkLight);

function canvasTexture(draw,repeatX=1,repeatY=1){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');draw(g,c);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeatX,repeatY);return t}
const floorTex=canvasTexture((g,c)=>{g.fillStyle='#242541';g.fillRect(0,0,256,256);for(let y=0;y<256;y+=64)for(let x=0;x<256;x+=64){g.fillStyle=(x/64+y/64)%2?'#292b4e':'#20213c';g.fillRect(x+2,y+2,60,60);g.strokeStyle='#575b87';g.globalAlpha=.45;g.lineWidth=3;g.strokeRect(x+2,y+2,60,60);g.globalAlpha=1}for(let i=0;i<110;i++){g.fillStyle='rgba(255,255,255,.06)';g.fillRect(Math.random()*256,Math.random()*256,2,2)}},6,3);
const wallTex=canvasTexture((g,c)=>{g.fillStyle='#34345a';g.fillRect(0,0,256,256);for(let y=0;y<256;y+=52){g.fillStyle='#272847';g.fillRect(0,y,256,5);g.fillStyle='#53547d';g.fillRect(0,y+5,256,2)}for(let i=0;i<120;i++){g.fillStyle='rgba(0,0,0,.10)';g.fillRect(Math.random()*256,Math.random()*256,Math.random()*5+1,Math.random()*3+1)}},7,3);
const concreteTex=canvasTexture((g,c)=>{g.fillStyle='#5a5b6c';g.fillRect(0,0,256,256);for(let i=0;i<500;i++){const a=Math.random()*.12;g.fillStyle=`rgba(20,21,35,${a})`;g.fillRect(Math.random()*256,Math.random()*256,Math.random()*4+1,Math.random()*4+1)}g.strokeStyle='rgba(215,225,255,.15)';g.lineWidth=3;g.strokeRect(6,6,244,244)},3,1);
const windowTex=canvasTexture((g,c)=>{g.fillStyle='#09142e';g.fillRect(0,0,256,256);const grad=g.createLinearGradient(0,0,0,256);grad.addColorStop(0,'#1b3562');grad.addColorStop(1,'#071024');g.fillStyle=grad;g.fillRect(8,8,240,240);for(let i=0;i<45;i++){g.fillStyle=['#5cf1df','#ffd452','#ff619f','#dbeaff'][i%4];g.globalAlpha=.4+Math.random()*.6;g.fillRect(18+Math.random()*215,28+Math.random()*185,3+Math.random()*5,3+Math.random()*12)}g.globalAlpha=1;g.strokeStyle='#a7eaff';g.globalAlpha=.4;g.lineWidth=7;g.strokeRect(8,8,240,240);g.beginPath();g.moveTo(128,8);g.lineTo(128,248);g.moveTo(8,120);g.lineTo(248,120);g.stroke();g.globalAlpha=1},1,1);
function standard(color,rough=.7){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:.08,flatShading:true})}
function textured(texture,rough=.7){return new THREE.MeshStandardMaterial({map:texture,roughness:rough,metalness:.06})}
function box(w,h,d,material,x,y,z,group=scene){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);return mesh}
function glow(color,intensity,distance,x,y,z){const light=new THREE.PointLight(color,intensity,distance,2);light.position.set(x,y,z);scene.add(light);return light}
function label(text,color,width=3){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle='#161733';g.fillRect(0,0,512,128);g.strokeStyle='#ffffff';g.globalAlpha=.35;g.lineWidth=8;g.strokeRect(8,8,496,112);g.globalAlpha=1;g.fillStyle=color;g.font='900 70px Trebuchet MS';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,69);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map:t,transparent:true});return new THREE.Mesh(new THREE.PlaneGeometry(width,width/4),m)}

// Building shell: tiled floor, concrete ceiling, panelled walls and large night windows.
box(25,.55,9,textured(floorTex),0,-.28,0);
box(25,.45,9,textured(concreteTex),0,10.1,0);
box(25,11,.38,textured(wallTex),0,5.25,-4.05);
box(.48,11,9,textured(concreteTex),-12.25,5.25,0);box(.48,11,9,textured(concreteTex),12.25,5.25,0);
for(let x=-11;x<12;x+=2){box(.06,.05,8.4,standard(0x5e608a),x,.04,0)}
for(let z=-3;z<5;z+=2){box(24,.05,.06,standard(0x53557d),0,.04,z)}
for(const x of [-8.5,-3.8,3.8,8.5]){const frame=box(3.4,4.5,.10,standard(0x1a1c35),x,5.75,-3.77);const pane=box(3.05,4.1,.025,textured(windowTex),x,5.75,-3.70);pane.material.emissive=new THREE.Color(0x071020);box(.14,4.3,.10,standard(0x70759b),x,5.75,-3.59);box(3.25,.14,.10,standard(0x70759b),x,5.75,-3.59);glow(0x536cc6,1.4,6,x,5.5,-2.8)}
// Pillars, ceiling rails and exposed service pipes make this an actual building interior.
for(const x of [-11.25,-5.9,0,5.9,11.25]){box(.46,10,.62,standard(0x76788b),x,5,.1);box(.66,.32,.8,standard(0x2b2d47),x,9.7,.1)}
for(const z of [-2.6,2.6]){box(23.6,.24,.22,standard(0x8388a4),0,9.45,z)}
for(const x of [-9,-7,6,8]){const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,8,10),standard(0x6b7391));pipe.position.set(x,5.7,3.35);pipe.rotation.x=Math.PI/2;pipe.castShadow=true;scene.add(pipe)}
for(const x of [-8,-2,4,9]){const lamp=box(1.6,.12,.42,standard(0xd9ecff),x,9.15,1.4);lamp.material.emissive=new THREE.Color(0x86baff);lamp.material.emissiveIntensity=1.7;glow(0xb3d7ff,2.4,7,x,8.7,1.4)}
// Posters, directional signs, bins, benches and warning stripes.
const posterA=label('ARCADE FLOOR',0x5cf1df,2.6);posterA.position.set(-4.1,7.55,-3.56);scene.add(posterA);const posterB=label('EXIT →',0xffd452,2.4);posterB.position.set(4.2,7.55,-3.56);scene.add(posterB);
for(const x of [-10.7,10.7]){const bin=box(.65,.85,.65,standard(0x384467),x,.43,2.9);box(.76,.13,.76,standard(0x1f263e),x,.9,2.9)}
for(const x of [-3.2,1.8]){box(2.1,.17,.55,standard(0x8a5a4b),x,1.05,2.7);for(const dx of [-.75,.75])box(.14,.85,.14,standard(0x34354b),x+dx,.48,2.7)}
for(let x=-10.7;x<-5.2;x+=.7){box(.36,.035,.8,standard(0xffd452),x,.045,3.18)}

// Detailed low-poly claw machine.
const machine=new THREE.Group();scene.add(machine);machine.position.set(-7.9,0,-.25);
box(3.35,5.2,2.15,standard(0x5a55ba),0,2.6,0,machine);box(3.68,.32,2.35,standard(0xff8cbe),0,5.34,0,machine);box(3.68,.32,2.35,standard(0xff8cbe),0,.22,0,machine);box(.3,5.25,2.35,standard(0xff8cbe),-1.8,2.7,0,machine);box(.3,5.25,2.35,standard(0xff8cbe),1.8,2.7,0,machine);
const glass=box(2.82,2.58,.07,standard(0x246ec4),0,2.72,1.11,machine);glass.material.transparent=true;glass.material.opacity=.42;glass.material.emissive=new THREE.Color(0x1d78d4);box(2.76,.56,.18,standard(0x1d2867),0,4.58,1.17,machine);const machineText=label('CLAW CHAOS',0xff8cbe,2.55);machineText.position.set(0,4.58,1.28);machine.add(machineText);
for(const [x,c] of [[-.9,0xffd452],[0,0xff619f],[.9,0x5cf1df]]){const prize=new THREE.Mesh(new THREE.IcosahedronGeometry(.34,1),standard(c));prize.position.set(x,1.3,1.15);prize.castShadow=true;machine.add(prize)}
box(1.1,.16,.32,standard(0x263055),.8,.72,1.16,machine);const joystick=new THREE.Mesh(new THREE.SphereGeometry(.16,8,8),standard(0xffd452));joystick.position.set(.8,.93,1.16);machine.add(joystick);glow(0x5cf1df,8,7,-7.9,3,2);

// Building-style EXIT door with industrial frame and light spill.
const exit=new THREE.Group();scene.add(exit);exit.position.set(8.55,0,-.18);box(3.38,5.7,.55,standard(0x803b99),0,2.85,0,exit);box(3.74,.32,.7,standard(0xffd452),0,5.72,0,exit);box(3.74,.32,.7,standard(0xffd452),0,.18,0,exit);box(.31,5.8,.7,standard(0xffd452),-1.86,2.9,0,exit);box(.31,5.8,.7,standard(0xffd452),1.86,2.9,0,exit);const exitText=label('EXIT',0xfff0b0,2.2);exitText.position.set(0,4.62,.31);exit.add(exitText);box(.13,3.9,.12,standard(0xff8fbc),0,2.35,.33,exit);const exitLight=glow(0xff4ea0,19,11,8.55,3,2);

// Player
const player=new THREE.Group();scene.add(player);const bodyMat=standard(0x5cf1df),skin=standard(0xffc89f),dark=standard(0x10122d);const torso=new THREE.Mesh(new THREE.CylinderGeometry(.44,.55,.8,5),bodyMat);torso.position.y=1;torso.castShadow=true;player.add(torso);const face=new THREE.Mesh(new THREE.IcosahedronGeometry(.52,2),skin);face.position.y=1.88;face.castShadow=true;player.add(face);const eye=new THREE.Mesh(new THREE.SphereGeometry(.065,8,8),dark);eye.position.set(.27,1.96,.43);player.add(eye);for(const x of [-.22,.22]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.22,.55,.25),standard(0x373274));leg.position.set(x,.35,0);leg.castShadow=true;player.add(leg)}const playerLight=glow(0x5cf1df,2.8,5,-8,2,2);

// Overhead crane; only the yellow claw head is dangerous.
box(8,.18,.38,standard(0xc4fff9),0,8,-.25);const clawRig=new THREE.Group();scene.add(clawRig);clawRig.position.set(0,8,-.1);box(.11,5.2,.11,standard(0xffe968),0,-2.6,0,clawRig);const clawHead=new THREE.Mesh(new THREE.CylinderGeometry(.42,.58,.45,6),standard(0xe8b63a));clawHead.position.y=-5.22;clawHead.castShadow=true;clawRig.add(clawHead);for(const x of [-.4,.4]){const arm=new THREE.Mesh(new THREE.BoxGeometry(.12,.55,.12),standard(0xffe968));arm.position.set(x,-5.55,0);arm.rotation.z=x>0?-.45:.45;clawRig.add(arm)}
const warning=new THREE.Mesh(new THREE.RingGeometry(.65,1.15,24),new THREE.MeshBasicMaterial({color:0xffd452,transparent:true,opacity:.58,side:THREE.DoubleSide}));warning.rotation.x=-Math.PI/2;warning.position.y=.035;scene.add(warning);

function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
function reset(text='Fresh run. Time your dash past the claw.'){Object.assign(state,{x:-8,y:0,vx:0,vy:0,grounded:true,active:true,elapsed:0,last:performance.now()});state.keys.clear();won.classList.remove('show');note(text);restart.focus({preventScroll:true})}
function lose(){if(!state.active)return;state.active=false;state.clawed++;note('CLAWED. Wait until the claw swings away, then dash.','danger');canvas.animate([{filter:'brightness(1)'},{filter:'brightness(1.7) saturate(.3)'},{filter:'brightness(1)'}],{duration:260})}
function win(){if(!state.active)return;state.active=false;const newBest=!state.best||state.elapsed<state.best;if(newBest){state.best=state.elapsed;saveBest(state.best)}badge.textContent=(state.elapsed<4?'SPEEDY 3D ESCAPE':'LOW-POLY LEGEND')+(newBest?' · NEW BEST':'');result.textContent=`Time: ${state.elapsed.toFixed(1)}s · Clawed: ${state.clawed}`;won.classList.add('show');again.focus({preventScroll:true});note('You escaped the 3D claw machine!','good')}
function jump(){if(state.active&&state.grounded){state.grounded=false;state.vy=9.7;note('Nice jump. Keep the exit in sight.')}}
function updateHud(){timeEl.textContent=state.elapsed.toFixed(1);bestEl.textContent=state.best?state.best.toFixed(1)+'s':'--';clawedEl.textContent=state.clawed}
function loop(now){const dt=Math.min((now-state.last)/1000,.035);state.last=now;const swing=Math.sin(now*.0019)*3.1;clawRig.position.x=swing;clawRig.rotation.z=Math.sin(now*.0019)*.20;warning.position.x=swing;warning.material.opacity=.32+Math.sin(now*.004)*.18;exitLight.intensity=15+Math.sin(now*.005)*5;if(state.active&&!document.hidden){state.elapsed+=dt;const dir=(state.keys.has('left')?-1:0)+(state.keys.has('right')?1:0);state.vx+=dir*26*dt;state.vx*=Math.pow(.00005,dt);state.x=clamp(state.x+state.vx*dt,-10.6,10.3);if(!state.grounded){state.vy-=24*dt;state.y+=state.vy*dt;if(state.y<=0){state.y=0;state.vy=0;state.grounded=true}}player.position.set(state.x,state.y,0);player.rotation.y=state.vx<-.2?Math.PI:0;player.rotation.z=state.grounded?0:Math.sin(now*.02)*.13;playerLight.position.set(state.x,state.y+2,2);if(Math.abs(state.x-swing)<.78&&state.y<1.25)lose();if(state.x>7.2&&state.y<1.35)win();updateHud()}renderer.render(scene,camera);requestAnimationFrame(loop)}
function moveKey(k){return k==='ArrowLeft'||k==='a'||k==='A'?'left':k==='ArrowRight'||k==='d'||k==='D'?'right':null}
addEventListener('keydown',e=>{const k=moveKey(e.key);if(k){e.preventDefault();state.keys.add(k)}if(['ArrowUp','w','W',' '].includes(e.key)){e.preventDefault();jump()}if(e.key==='r'||e.key==='R')reset();if(e.key==='Escape'&&won.classList.contains('show'))reset()});addEventListener('keyup',e=>{const k=moveKey(e.key);if(k)state.keys.delete(k)});addEventListener('blur',()=>state.keys.clear());document.addEventListener('visibilitychange',()=>{state.keys.clear();state.last=performance.now()});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);state.keys.add(k)});for(const type of ['pointerup','pointerleave','pointercancel','lostpointercapture'])b.addEventListener(type,()=>state.keys.delete(k))});document.querySelector('#jump').addEventListener('pointerdown',e=>{e.preventDefault();jump()});restart.onclick=()=>reset();again.onclick=()=>reset();reset('Welcome to 3D Claw Chaos. Wait for the claw, then run right.');requestAnimationFrame(loop);
