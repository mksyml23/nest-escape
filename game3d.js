import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
const parts=await Promise.all(['game3d-part1.js','game3d-part2.js'].map(p=>fetch(p).then(r=>{if(!r.ok)throw Error('Level load failed');return r.text()})));new Function('THREE',parts.join('\n'))(THREE);
