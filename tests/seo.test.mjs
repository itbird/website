import test from 'node:test';
import assert from 'node:assert/strict';
import {seoHead,sitemap,robots} from '../scripts/seo.mjs';
const site={url:'https://zhongchen.ai',name:'Zhong Chen',title:'Zhong Chen | AI for Food Waste Prevention',description:'AI and food waste',github:'https://github.com/itbird'};
test('home metadata links a truthful Person to the canonical website',()=>{
 const html=seoHead(site);assert.match(html,/rel="canonical" href="https:\/\/zhongchen.ai\/"/);
 const data=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 const person=data['@graph'].find(n=>n['@type']==='Person');assert.equal(person.name,'Zhong Chen');assert.deepEqual(person.sameAs,[site.github]);assert.equal(person.jobTitle,'PhD researcher');
});
test('article URLs are canonical; local previews are noindex',()=>{
 const post={slug:'example',title:'Example',summary:'An example'};assert.match(seoHead(site,post),/https:\/\/zhongchen.ai\/notes\/example\//);assert.equal(seoHead(site,post,true),'<meta name="robots" content="noindex, nofollow">');
});
test('sitemap lists only supplied public pages and JSON cannot break out of script',()=>{
 assert.equal((sitemap(site,[]).match(/<loc>/g)||[]).length,1);assert.doesNotMatch(sitemap(site,[]),/notes|studio|draft/);assert.match(robots(site),/Sitemap: https:\/\/zhongchen.ai\/sitemap.xml/);
 const html=seoHead({...site,name:'</script><script>bad</script>'});assert.equal((html.match(/<script/g)||[]).length,1);
});
