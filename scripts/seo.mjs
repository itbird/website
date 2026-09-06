const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function siteOrigin(site) {
  const url = new URL(site.url || 'https://zhongchen.ai');
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('Site URL must be an HTTPS origin');
  return url.origin;
}
export function seoHead(site, post = null, preview = false) {
  if (preview) return '<meta name="robots" content="noindex, nofollow">';
  const origin = siteOrigin(site);
  const url = origin + (post ? `/notes/${post.slug}/` : '/');
  const title = post ? `${post.title} — ${site.name}` : site.title;
  const description = post ? post.summary : site.description;
  const person = {'@type':'Person','@id':origin+'/#person',name:site.name,url:origin+'/',jobTitle:'PhD researcher',description:'PhD researcher in Australia exploring AI for food waste prevention.',sameAs:[site.linkedin,site.github,site.scholar,site.orcid].filter(v=>typeof v==='string' && /^https:\/\//.test(v)),knowsAbout:['Artificial intelligence','Food waste prevention','Cold-chain monitoring','Knowledge graphs','Ontologies']};
  const graph = [person, {'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:site.name,description:site.description,inLanguage:'en-AU',publisher:{'@id':origin+'/#person'}}, post ? {'@type':'BlogPosting','@id':url+'#article',url,headline:post.title,description:post.summary,inLanguage:'en-AU',author:{'@id':origin+'/#person'},mainEntityOfPage:url} : {'@type':'WebPage','@id':origin+'/#webpage',url,name:title,description,inLanguage:'en-AU',isPartOf:{'@id':origin+'/#website'},about:{'@id':origin+'/#person'}}];
  const json = JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
  return `<link rel="canonical" href="${escape(url)}">
<meta name="author" content="${escape(site.name)}">
<meta property="og:type" content="${post?'article':'website'}">
<meta property="og:site_name" content="${escape(site.name)}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${escape(url)}">
<meta property="og:locale" content="en_AU">
<script type="application/ld+json">${json}</script>`;
}
export function sitemap(site, posts) {
  const origin = siteOrigin(site);
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+['/',...posts.map(p=>`/notes/${p.slug}/`)].map(p=>`  <url><loc>${escape(origin+p)}</loc></url>`).join('\n')+'\n</urlset>\n';
}
export function robots(site) {
  return `User-agent: *\nAllow: /\nDisallow: /studio\nDisallow: /api/\nDisallow: /preview/\n\nSitemap: ${siteOrigin(site)}/sitemap.xml\n`;
}
