/* Rendered Space Mono sweep across every page, both viewports, pseudo-elements included.
 *
 * Exists because brand-guard.mjs is STRUCTURALLY BLIND to the defect it was built for. Its regex
 * matches a CSS block containing both var(--mono) and font-size. On 17 Sep 2026 vsl/watch.html:47
 * set .book{font-size:16px} while the FACE was declared in assets/aiml-funnel.css: two rules, two
 * files, so the guard printed "clean" and exited 0 over three rendered 16px nodes. Commit 8992100
 * had fixed the identical split on vsl/booked.html hours earlier and named the cause in its own
 * message. The "zero Space Mono above 14px" claim was made and was false three times in one day.
 *
 * A static scan cannot answer this question. Only computed style can. [data-fallback] wordmarks
 * are the one declared exception, and ::before/::after are swept explicitly because
 * querySelectorAll cannot select pseudo-elements, which hid five 19px markers earlier the same day.
 *
 * Run: node mono-sweep.mjs   (exit 0 clean, 1 breach)
 */
import puppeteer from '/Users/sandy/HQ/System/tools/pdf-renderer/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { globSync } from 'node:fs';
const ROOT='/Users/sandy/HQ/Sandy/website/aimarketinglabs.in';
const pages=globSync(`${ROOT}/**/*.html`,{exclude:p=>/node_modules|candidate|rebuild/.test(p)})
  .filter(p=>!/node_modules|candidate|rebuild/.test(p));
const b=await puppeteer.launch({executablePath:process.env.CHROME_BIN,headless:'new',args:['--no-sandbox']});
let total=0;
for(const f of pages){
  for(const vw of [1440,390]){
    const p=await b.newPage(); await p.setCacheEnabled(false);
    await p.setViewport({width:vw,height:900});
    try{ await p.goto('file://'+f,{waitUntil:'domcontentloaded',timeout:30000}); }catch(e){ await p.close(); continue; }
    await new Promise(r=>setTimeout(r,250));
    const hits=await p.evaluate(()=>{
      const out=[]; const isMono=s=>/space mono|courier|monospace/i.test(s);
      const fb=e=>e.closest('[data-fallback]')!==null;
      for(const el of document.querySelectorAll('body *')){
        const cs=getComputedStyle(el);
        if(isMono(cs.fontFamily)&&parseFloat(cs.fontSize)>14.001&&!fb(el))
          out.push({sel:el.tagName+(el.id?'#'+el.id:'')+'.'+String(el.className||'').split(' ')[0],px:cs.fontSize,ps:''});
        for(const ps of ['::before','::after']){
          const s=getComputedStyle(el,ps);
          if(!s.content||['none','""','normal'].includes(s.content))continue;
          if(isMono(s.fontFamily)&&parseFloat(s.fontSize)>14.001&&!fb(el))
            out.push({sel:el.tagName+'.'+String(el.className||'').split(' ')[0],px:s.fontSize,ps});
        }}
      return out;});
    if(hits.length){ total+=hits.length;
      console.log(`  BREACH ${f.replace(ROOT+'/','')} @${vw}: `+hits.map(h=>`${h.sel}${h.ps} ${h.px}`).join(' | ')); }
    await p.close();
  }
}
console.log(`\npages swept: ${pages.length}  x2 viewports  |  Space Mono above 14px: ${total}`);
await b.close();
process.exit(total?1:0);
