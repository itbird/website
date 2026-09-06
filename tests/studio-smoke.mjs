// Run with the local studio already listening: node tests/studio-smoke.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {root,build} from '../scripts/build.mjs';
const origin='http://127.0.0.1:4174',slug='smoke-'+Date.now();let uploaded;
const first=await fetch(origin+'/studio');assert.equal(first.status,200);const cookie=first.headers.get('set-cookie').split(';')[0];
const settings=await (await fetch(origin+'/api/settings',{headers:{Cookie:cookie}})).json();
const publicArticleStatus=settings.site.notesEnabled===false?404:200;
const post=async(route,data,headers={})=>fetch(origin+'/api/'+route,{method:'POST',headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json',...headers},body:JSON.stringify(data)});
try{
 assert.equal((await fetch(origin+'/api/posts')).status,403);
 assert.equal((await post('render',{body:'text'},{Origin:'https://elsewhere.example'})).status,403);
 assert.equal((await post('upload',{data:Buffer.from('<svg onload="bad">').toString('base64')})).status,400);
 const image=await post('upload',{data:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZ9sAAAAASUVORK5CYII='});assert.equal(image.status,200);uploaded=(await image.json()).url;assert.equal((await fetch(origin+uploaded)).status,200);
 const draft={slug,title:'Smoke check',summary:'Temporary verification article',date:'2026-09-06',status:'draft',category:'Test',cover:uploaded,coverAlt:'Test pixel',body:'## Saved Markdown\n\n**Evidence** [Home](/)'};
 let response=await post('save',draft);assert.equal(response.status,200);let saved=(await response.json()).post;
 assert.equal((await fetch(origin+'/notes/'+slug+'/')).status,404);
 assert.equal((await fetch(origin+'/preview/'+slug)).status,403);
 const preview=await fetch(origin+'/preview/'+slug,{headers:{Cookie:cookie}});assert.equal(preview.status,200);assert.match(await preview.text(),/<strong>Evidence<\/strong>/);
 response=await post('save',{...saved,status:'published'});assert.equal(response.status,200);const published=(await response.json()).post;assert.equal((await fetch(origin+'/notes/'+slug+'/')).status,publicArticleStatus);
 assert.equal((await post('save',saved)).status,409);
 response=await post('save',{...published,status:'draft'});assert.equal(response.status,200);assert.equal((await fetch(origin+'/notes/'+slug+'/')).status,404);
 assert.equal((await fetch(origin+'/scripts/studio.mjs')).status,404);
 console.log('Studio smoke checks passed: session gate, origin gate, image validation/upload, draft save/preview, publish/unpublish, edit conflict, source exclusion.');
}finally{
 for(const ext of ['json','md']){const p=path.join(root,'content/posts',slug+'.'+ext);if(fs.existsSync(p))fs.unlinkSync(p);}
 if(uploaded){const p=path.resolve(root,'.'+uploaded);assert.ok(p.startsWith(path.join(root,'assets/uploads')+path.sep));if(fs.existsSync(p))fs.unlinkSync(p);}
 build();
}
