/* =========================================================
   牧場を増やす: 日高を中心に、名前と個性のある生産牧場（すべて架空）。
   ・セリの上場馬に「生産牧場」が付く（その馬の血統・適性に合った牧場から。セレクトセールは大きな牧場が多い）
   ・庭先取引の話が、いろいろな牧場から来る（牧場主の一言つき）。話の来る頻度も少し上げる
   ・自分の馬のくわしい情報に「生産」が出る
   ・その牧場の生産馬で重賞を勝つと、牧場からお礼の手紙。付き合いが深まると、いい馬の話が回ってきやすくなる
   ========================================================= */
const FARMS={
  seiun:{n:'青雲ファーム',r:'新ひだか',type:'中規模',who:'青山 誠',fit:h=>h.surf==='芝'&&h.dist>=1600&&h.dist<=2400,sp:'芝の中距離',big:2,
    say:'「うちは芝の二千前後で走る馬を、ずっと作ってきました。この仔も、その血です」'},
  hokuto:{n:'北斗牧場',r:'浦河',type:'家族経営',who:'北斗 勝',fit:h=>h.surf==='ダ',sp:'ダート',big:1,
    say:'「うちの馬は、砂をかぶっても嫌がらねえ。脚元も丈夫だ。見てやってくれ」'},
  asagiri:{n:'朝霧牧場',r:'新冠',type:'老舗',who:'朝霧 キヨ',fit:h=>h.dist>=2200||h.growth==='晩成',sp:'長距離・晩成',big:2,
    say:'「この仔は、たぶん遅咲き。でも、そういう馬ほど長く走ってくれるのよ」'},
  shirakaba:{n:'白樺スタッド',r:'千歳',type:'大手',who:'白樺 亮',fit:h=>h.dist<=1400||h.growth==='早熟',sp:'早熟の短距離',big:4,
    say:'「早い時期から使えます。仕上がりの早さは、うちの売りです」'},
  wakaba:{n:'若葉牧場',r:'様似',type:'家族経営',who:'若林 千夏',fit:h=>h.sex==='牝',sp:'丈夫な牝馬',big:1,
    say:'「うちの牝馬は、繁殖に上がってからもいい仔を出すんです。この仔もきっと」'},
  misaki:{n:'岬ファーム',r:'えりも',type:'小さな牧場',who:'岬 太一',fit:h=>h.temper==='気難しい'||(h.cap&&h.cap.guts>=h.cap.spd),sp:'根性',big:1,
    say:'「海風の中で育ったから、根性だけは誰にも負けねえ。気は強えけどな」'},
  matsukaze:{n:'松風牧場',r:'平取',type:'名門',who:'松風 宗介',fit:h=>h.surf==='芝'&&h.dist>=1800,sp:'芝のクラシック',big:3,
    say:'「クラシックを狙える血です。先代の頃から、ダービーだけを見てきました」'},
  hokushin:{n:'北辰ファーム',r:'安平',type:'大手',who:'北辰ファーム',fit:()=>true,sp:'何でも',big:5,say:'「当ファームの自信の一頭です」',noNiwa:true}};
const farmName=id=>FARMS[id]?FARMS[id].n:id==='nakahara'?'中原牧場':'';
function pickFarm(h,sel,niwa){const ids=Object.keys(FARMS).filter(id=>!(niwa&&FARMS[id].noNiwa));const rel=(S.farmRel||{});
  const w=ids.map(id=>{const f=FARMS[id];let v=f.fit(h)?3:.4;v*=sel?f.big:(5-f.big*.6);if(niwa)v*=1+(rel[id]||0)*.6;return Math.max(.05,v);});let x=R()*w.reduce((a,b)=>a+b,0);for(let i=0;i<ids.length;i++){x-=w[i];if(x<0)return ids[i];}return ids[0];}
/* セリ */
makeSale=(o=>function(kind){const s=o.apply(this,arguments);try{s.lots.forEach(l=>{if(l.h&&!l.h.farm)l.h.farm=pickFarm(l.h,kind==='セレクトセール');});}catch(e){}return s;})(makeSale);
render=(o=>function(){const r=o.apply(this,arguments);try{if(S&&S.sale&&UI.tab==='sale'){const arts=document.querySelectorAll('article.panel.lot');S.sale.lots.forEach((l,i)=>{const a=arts[i];const f=l.h&&FARMS[l.h.farm];if(!a||!f||a.querySelector('.farmline'))return;
    const meta=a.querySelector('.meta');if(meta)meta.insertAdjacentHTML('afterend',`<div class="meta farmline">生産 <b>${esc(f.n)}</b>（${esc(f.r)}・${esc(f.type)}）<span class="chip" style="font-size:10px">${esc(f.sp)}</span></div>`);});}}catch(e){}return r;})(render);
/* 庭先取引: 牧場の名前と牧場主の一言、買った馬に生産牧場 */
if(EV.niwasaki){const r0=EV.niwasaki.r,f0=EV.niwasaki.f;
  EV.niwasaki.r=d=>{const v=r0(d);try{if(!d.farm){const st=ST(d.sid);d.farm=pickFarm({surf:st.surf,dist:st.dist,growth:st.g,sex:d.sex==='牝馬'?'牝':'牡',temper:st.tp},false,true);}const f=FARMS[d.farm];if(f&&v){
    v.title=`${f.n}から（庭先取引）`;v.body=v.body.replace(/^[^。\n]*?牧場主?が/,`${f.r}の${f.n}（${f.type}・${f.who}さん）が`).replace(/跡継ぎがいなくて、馬を減らしとるそうだ。/,'')+`\n\n${f.who}${f.say}`;}}catch(e){}return v;};
  EV.niwasaki.f=(d,i)=>{const n=S.horses.length;const r=f0(d,i);try{if(S.horses.length>n){const h=S.horses[S.horses.length-1];if(h&&h.owner==='me'&&!h.farm)h.farm=d.farm||'';if(d.farm){S.farmRel=S.farmRel||{};S.farmRel[d.farm]=(S.farmRel[d.farm]||0)+1;}}}catch(e){}return r;};}
beginMonth=(o=>function(first){const r=o.apply(this,arguments);try{if(!S||first)return r;const m=M(S.t),yr=S.t-S.startT;
  if(m>=5&&m<=10&&yr>=4&&R()<.12&&!S.inbox.some(e=>e.type==='niwasaki')){const s=pick(STALLIONS0),pot=Math.round(55+R()*28+Math.min(6,Object.values(S.farmRel||{}).reduce((a,b)=>a+b,0)));
    pushEv('niwasaki',{sid:s.id,pot,sex:R()<.5?'牡馬':'牝馬',coat:pick(['鹿毛','黒鹿毛','栗毛','芦毛','青鹿毛']),price:Math.round((pot-45)*(pot-45)*.9/10)*10+300});}}catch(e){}return r;})(beginMonth);
/* 自分の馬の「生産」 */
hCard=(o=>function(h){let s=o.apply(this,arguments);try{const fn=farmName(h.farm)||(h.breeder==='中原'?'中原牧場':h.breeder==='大手'?'大手の牧場（預託）':'');if(fn)s=s.replace('<dt>追い切り</dt>',`<dt>生産</dt><dd>${esc(fn)}${FARMS[h.farm]?`（${esc(FARMS[h.farm].r)}）`:''}</dd><dt>追い切り</dt>`);}catch(e){}return s;})(hCard);
/* 生産馬が重賞を勝ったら、牧場からお礼 */
applyRace=(o=>function(RC){const r=o.apply(this,arguments);try{const w=RC&&RC.order&&RC.order[0];const h=w&&w.mine&&w.h;if(h&&RC.race.g&&FARMS[h.farm]&&!FARMS[h.farm].noNiwa){S.farmRel=S.farmRel||{};S.farmRel[h.farm]=(S.farmRel[h.farm]||0)+1;pushEv('farmThanks',{f:h.farm,name:h.name,race:RC.race.name,g:RC.race.grade});}}catch(e){}return r;})(applyRace);
EV.farmThanks={r:d=>{const f=FARMS[d.f];if(!f)return null;return{p:'nakahara',from:`${f.n}　${f.who}`,title:`${f.n}から、お礼の手紙`,
  body:`${d.name}の${d.race}${d.g==='G1'?'制覇':'勝利'}、おめでとうございます。\n\n牧場のみんなでテレビの前で叫びました。${d.g==='G1'?'うちの生産馬がG1を勝つなんて、夢のようです。':'生まれた日のことを、昨日のように思い出します。'}\n\n${f.type==='家族経営'||f.type==='小さな牧場'?'小さな牧場ですが、これからもいい馬を作ります。またいい仔が生まれたら、真っ先にお知らせします。':'これからも、いい馬をお届けできるよう励みます。'}\n\n${f.r}　${f.n}　${f.who}`,ch:['返事を出す']};},
  f:d=>{S.farmRel=S.farmRel||{};S.farmRel[d.f]=(S.farmRel[d.f]||0)+1;return `${FARMS[d.f]?FARMS[d.f].n:'牧場'}との付き合いが、少し深まった。いい馬の話が回ってきやすくなる。`;}};
