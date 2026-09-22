import {mkdir,writeFile,readFile} from 'node:fs/promises';
import topics from './activity-photo-topics.json' with {type:'json'};
import activities from '../src/data/activities.json' with {type:'json'};
const headers={'User-Agent':'RoamDemo/0.1 (local frontend prototype; asset preparation)'};
const plain=(html='')=>html.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
async function query(host,params,attempt=0){const url=new URL(`https://${host}/w/api.php`);url.search=new URLSearchParams({action:'query',format:'json',...params});const r=await fetch(url,{headers,signal:AbortSignal.timeout(25000)});if(r.status===429 && attempt<5){console.log('Rate limited; waiting before retry '+(attempt+1));await new Promise(resolve=>setTimeout(resolve,Math.max(5000,Number(r.headers.get('retry-after')||5)*1000)));return query(host,params,attempt+1);}if(!r.ok)throw new Error(`HTTP ${r.status}`);const d=await r.json();if(d.error)throw new Error(JSON.stringify(d.error));return d.query;}
const output=new URL('../public/images/activities/',import.meta.url);await mkdir(output,{recursive:true});
let metadata=[];try{metadata=JSON.parse(await readFile(new URL('../src/data/activity-images.json',import.meta.url),'utf8'));}catch{}

const articleCache = new Map();
const fileCache = new Map();
const allTopics = [...new Set(Object.values(topics).flat())];
for(let i=0;i<allTopics.length;i+=40){
 const batch=allTopics.slice(i,i+40);
 const result=await query('en.wikipedia.org',{titles:batch.join('|'),redirects:'1',prop:'pageimages',piprop:'name'});
 const redirects=new Map([...(result.normalized||[]),...(result.redirects||[])].map(r=>[r.from,r.to]));
 for(const topic of batch){let title=topic;for(let j=0;j<5&&redirects.has(title);j++)title=redirects.get(title);const page=Object.values(result.pages).find(p=>p.title===title);if(page)articleCache.set(topic,page);}
 await new Promise(resolve=>setTimeout(resolve,2000));
}
const filenames=[...new Set([...articleCache.values()].filter(p=>p.pageimage).map(p=>'File:'+p.pageimage))];
for(let i=0;i<filenames.length;i+=40){const result=await query('commons.wikimedia.org',{titles:filenames.slice(i,i+40).join('|'),prop:'imageinfo',iiprop:'url|extmetadata|mime',iiurlwidth:'800'});for(const file of Object.values(result.pages))fileCache.set(file.title.replaceAll('_',' '),file.imageinfo?.[0]);await new Promise(resolve=>setTimeout(resolve,2000));}
await writeFile(new URL('../test-results/activity-source-cache.json',import.meta.url),JSON.stringify({articles:[...articleCache],files:[...fileCache]}));
console.log('Batched article and license metadata ready');
for(const activity of activities){
 if(metadata.some(m=>m.activityId===activity.id))continue;
 await new Promise(resolve=>setTimeout(resolve,1200));
 const topic=topics[activity.cityId][Number(activity.id.slice(-2))-1];
 try{
 let page=articleCache.get(topic) || {};
 if(!page.pageimage || /\.svg$/i.test(page.pageimage))throw new Error('No photograph on article');
 let info=fileCache.get(('File:'+page.pageimage).replaceAll('_',' '));
 if(!info){const files=await query('commons.wikimedia.org',{titles:'File:'+page.pageimage,prop:'imageinfo',iiprop:'url|extmetadata|mime',iiurlwidth:'800'});info=Object.values(files.pages)[0]?.imageinfo?.[0];}
 const license=plain(info?.extmetadata?.LicenseShortName?.value);
 if(!info?.thumburl||!/CC BY|CC0|Public domain/i.test(license))throw new Error('Missing reusable photo/license');
 const response=await fetch(info.thumburl,{headers,signal:AbortSignal.timeout(25000)});if(!response.ok)throw new Error('Photo HTTP '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());const ext=bytes[0]===255&&bytes[1]===216?'jpg':bytes[0]===137?'png':null;if(!ext)throw new Error('Unsupported raster format');
 const src=`/images/activities/${activity.id}.${ext}`;await writeFile(new URL(`${activity.id}.${ext}`,output),bytes);
 metadata.push({activityId:activity.id,cityId:activity.cityId,src,alt:plain(page.title)+' - activity illustration',caption:plain(page.title)+' - activity illustration',source:info.descriptionurl,credit:plain(info.extmetadata.Artist?.value || info.extmetadata.Credit?.value),license,licenseUrl:info.extmetadata.LicenseUrl?.value||info.descriptionurl,topic:page.title});
 await writeFile(new URL('../src/data/activity-images.json',import.meta.url),JSON.stringify(metadata,null,2)+'\n');
 console.log(activity.id+': '+page.title);
 }catch(error){console.log('MISSING '+activity.id+' '+topic+': '+error.message);}
}
await writeFile(new URL('CREDITS.md',output),['# Activity photography credits','','Real photographs from Wikimedia Commons, resized for local use. Images illustrate the named place, food, or experience; they do not advertise a specific tour operator. Display crops are applied by CSS.','','| Activity | Subject | Creator | License | Source |','| --- | --- | --- | --- | --- |',...metadata.map(m=>`| ${m.activityId} | ${m.topic} | ${m.credit.replaceAll('|','/')} | [${m.license}](${m.licenseUrl}) | [Original file](${m.source}) |`),''].join('\n'));
console.log(`Prepared ${metadata.length}/${activities.length} photos`);
