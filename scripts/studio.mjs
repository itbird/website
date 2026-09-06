import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {root,out,build,listPosts,readPost,validatePost,postPage,renderMarkdown} from './build.mjs';
const port=Number(process.env.STUDIO_PORT||4174),host=`127.0.0.1:${port}`,origin=`http://${host}`,token=crypto.randomBytes(32).toString('hex');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.json':'application/json; charset=utf-8','.pdf':'application/pdf','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const revision=p=>crypto.createHash('sha256').update(JSON.stringify(p)).digest('hex');
function atomic(file,text){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.tmp';fs.writeFileSync(temp,text);fs.renameSync(temp,file);}
async function body(req){if(!req.headers['content-type']?.startsWith('application/json'))throw Error('Expected JSON');let bytes=0;const chunks=[];for await(const c of req){bytes+=c.length;if(bytes>9*1024*1024)throw Error('File is too large (maximum 6 MB image)');chunks.push(c);}return JSON.parse(Buffer.concat(chunks).toString());}
function imageType(data){if(data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'png';if(data[0]===255&&data[1]===216&&data[2]===255)return 'jpg';if(/^GIF8[79]a$/.test(data.subarray(0,6).toString()))return 'gif';if(data.subarray(0,4).toString()==='RIFF'&&data.subarray(8,12).toString()==='WEBP')return 'webp';throw Error('Use a PNG, JPEG, GIF or WebP image');}
build();
http.createServer(async(req,res)=>{
 const send=(status,data,type='application/json; charset=utf-8')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'same-origin'});res.end(typeof data==='object'&&!Buffer.isBuffer(data)?JSON.stringify(data):data);};
 try{
  if(req.headers.host!==host)return send(403,{error:'Open the local address printed by the studio'});
  const url=new URL(req.url,origin),pathname=decodeURIComponent(url.pathname);
  if(req.method==='GET'&&pathname==='/studio'){res.setHeader('Set-Cookie',`studio=${token}; HttpOnly; SameSite=Strict; Path=/`);return send(200,fs.readFileSync(path.join(root,'studio/index.html')),'text/html; charset=utf-8');}
  const authorised=(req.headers.cookie||'').split(';').some(c=>c.trim()===`studio=${token}`);
  if(pathname.startsWith('/api/')||pathname.startsWith('/preview/')){
   if(!authorised)return send(403,{error:'Open /studio first'});
   if(req.method==='GET'&&pathname==='/api/posts')return send(200,listPosts().map(p=>({...p,revision:revision(p)})));
   if(req.method==='GET'&&pathname==='/api/settings')return send(200,{site:JSON.parse(fs.readFileSync(path.join(root,'content/site.json'))),academic:JSON.parse(fs.readFileSync(path.join(root,'content/academic.json')))});
   if(req.method==='GET'&&pathname.startsWith('/preview/'))return send(200,postPage(readPost(pathname.slice(9)),undefined,true),'text/html; charset=utf-8');
   if(req.method!=='POST')return send(405,{error:'Method not allowed'});
   if(req.headers.origin!==origin)return send(403,{error:'Only the local editor may make changes'});
   const input=await body(req);
   if(pathname==='/api/render')return send(200,{html:renderMarkdown(String(input.body||''))});
   if(pathname==='/api/save'){
    validatePost(input);const metaFile=path.join(root,'content/posts',input.slug+'.json');
    if(fs.existsSync(metaFile)&&revision(readPost(input.slug))!==input.revision)return send(409,{error:'This article changed since you opened it. Reload before saving to avoid overwriting another edit.'});
    const meta={};for(const key of ['title','summary','date','category','status','cover','coverAlt','aiNote'])meta[key]=String(input[key]||'');
    atomic(path.join(root,'content/posts',input.slug+'.md'),input.body);atomic(metaFile,JSON.stringify(meta,null,2)+'\n');const result=build();return send(200,{...result,post:{...readPost(input.slug),revision:revision(readPost(input.slug))}});
   }
   if(pathname==='/api/upload'){
    const data=Buffer.from(String(input.data||''),'base64');if(!data.length||data.length>6*1024*1024)throw Error('Images must be under 6 MB');const ext=imageType(data);const name=crypto.randomBytes(10).toString('hex')+'.'+ext;const folder=path.join(root,'assets/uploads');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,name),data);build();return send(200,{url:'/assets/uploads/'+name});
   }
   if(pathname==='/api/settings'){
    const allowed=['publications','talks','teaching','activities','cv'];if(!input.academic||typeof input.academic!=='object')throw Error('Academic content must be a JSON object');
    const site=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));
    if(typeof input.site.notesEnabled==='boolean')site.notesEnabled=input.site.notesEnabled;
    for(const key of ['github','linkedin','scholar','orcid']){const value=String(input.site[key]||'');if(value&&!/^https:\/\//.test(value))throw Error(`${key} must use an https URL`);site[key]=value;}
    const academic={};for(const key of allowed){site.academic[key]=Boolean(input.site.academic[key]);if(!Array.isArray(input.academic[key]))throw Error(`${key} must be an array`);academic[key]=input.academic[key].map(item=>{if(!item||typeof item.title!=='string'||!item.title.trim())throw Error('Each academic entry needs a title');const entry={};for(const field of ['title','date','venue','description','url'])entry[field]=String(item[field]||'');if(entry.url&&!/^(https:\/\/|\/(?!\/))/.test(entry.url))throw Error('Entry links must use https or a local path');return entry;});}
    atomic(path.join(root,'content/site.json'),JSON.stringify(site,null,2)+'\n');atomic(path.join(root,'content/academic.json'),JSON.stringify(academic,null,2)+'\n');return send(200,build());
   }
   return send(404,{error:'Unknown action'});
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return send(405,{error:'Method not allowed'});
  const resolved=path.resolve(out,'.'+pathname);if(resolved!==out&&!resolved.startsWith(out+path.sep))return send(403,{error:'Invalid path'});
  if(pathname.split('/').some(p=>p.startsWith('.')))return send(404,'Not found','text/plain');
  let file=resolved;if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile())return send(404,fs.readFileSync(path.join(out,'404.html')),'text/html; charset=utf-8');
  send(200,req.method==='HEAD'?'':fs.readFileSync(file),types[path.extname(file)]||'application/octet-stream');
 }catch(e){send(400,{error:e.message});}
}).listen(port,'127.0.0.1',()=>console.log(`Website: ${origin}\nEditor: ${origin}/studio\nLocal editor only. Saving changes rebuilds dist; it does not publish online.`));
