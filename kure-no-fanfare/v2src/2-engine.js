let RC_SUB=[];
/* =========================================================
   engine: state, horses, races, breeding, months
   ========================================================= */
let S=null;
const UI={tab:'stable',reg:null,bid:null,race:null,talk:null,touch:null};
const P=id=>S.people[id];
const HZ=id=>S.horses.find(h=>h.id===+id);
const ST=id=>S.stallions.find(s=>s.id===id);
const TR=id=>S.trainers[id];
const JK=id=>S.jockeys[id];
const ageOf=h=>Y(S.t)-h.by;
const yearNo=()=>Math.floor((S.t-(S.part===2?S.p2T:S.startT))/12)+1;
const ownerName=()=>S.part===1?S.parent.name:S.child.name;
const hAge=(h,t)=>Y(t)-h.by+(M(t)-1)/12;
function frac(g,a){a=clamp(a,0,8.99);const i=Math.floor(a),f=a-i;const c=GG[g];return c[i]+(c[i+1]-c[i])*f;}
function log(text){S.log.unshift({t:S.t,text,part:S.part});}
function news(s){S.news.unshift({t:S.t,s});if(S.news.length>40)S.news.length=40;}
function trust(id,d){const p=P(id);if(!p)return;if(S.part===2&&S.br.inherit==='mikuni'&&S.t-S.p2T<12&&d>0)d=d*.6;p.trust=clamp(p.trust+d,0,100);}
function usedName(n){return S.horses.some(h=>h.name===n)||S.rivals.some(h=>h.name===n);}
function makeName(pre){for(let i=0;i<30;i++){const n=pre?pre+pick(FR):(R()<.5?pick(FR)+pick(FR2):pick(FR2)+pick(FR));if(n.length<=9&&!usedName(n))return n;}return (pre||'')+pick(FR).slice(0,4);}
const damName=()=>pick(FR)+pick(DAMF);
function randSilks(){const c=Object.values(SILK_COLORS);return{a:pick(c),b:pick(c),p:pick(PATTERNS)};}
const mine=()=>S.horses.filter(h=>h.owner==='me');
const racing=()=>mine().filter(h=>['現役','放牧','休養'].includes(h.status));
const atFarm=()=>mine().filter(h=>['繁殖','当歳','1歳','育成'].includes(h.status));
function trainerPerson(id){return id;} // trainer ids double as people ids
function trainersAvail(){return S.part===1?['togawa','hayase']:['koyanagi','hayase',...(S.flags.washioTrainer?['washio']:[])];}
function jockeysAvail(){
  return ['stable',...Object.keys(S.jockeys).filter(id=>!(id==='washio'&&S.part===2)&&!(id==='hinata'&&S.br.hinataLeft)&&!(id==='komori'&&!S.flags.komori))];
}
const JNAME=id=>id==='stable'?'厩舎所属の若手':P(id).n;
const JSK=id=>id==='stable'?64:JK(id).sk;

/* ---------- horses ---------- */
function pickStallion(tier){const L=S.stallions.filter(s=>!s.dead);if(tier===1){const w=L.map(s=>Math.pow(Math.max(1,s.q-60),2.2));let x=R()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++){x-=w[i];if(x<=0)return L[i];}}return pick(L);}
function genHorse(o){
  const sire=(typeof o.sire==='string'?ST(o.sire):o.sire)||pickStallion(o.tier||0);
  const dp=o.damPot??(sire.q-12+randn()*5);
  const pot=o.pot??clamp(sire.q*.55+dp*.45-5+randn()*6+(o.nick||0)+(o.bias||0),40,99);
  const dd=o.damDist??sire.dist;
  const dist=o.dist??clamp(Math.round((sire.dist*.6+dd*.4+randn()*300)/100)*100,1000,3400);
  const surf=o.surf??(R()<.85?sire.surf:(sire.surf==='芝'?'ダ':'芝'));
  const L=clamp((dist-1200)/2000,0,1);
  const c=v=>clamp(Math.round(v),30,106);
  const cap={spd:c(pot+randn()*4+(1-L)*6-3),sta:c(pot+randn()*4+L*8-4),kick:c(pot+randn()*5),pow:c(pot+randn()*5),guts:c(pot+randn()*5),wis:c(pot-3+randn()*7)};
  const growth=o.growth??(R()<.5?sire.g:(o.damGrowth&&R()<.5?o.damGrowth:pick(['早熟','普通','晩成'])));
  let temper=o.temper;if(!temper){const x=R();temper=x<.5?sire.tp:x<.75?'普通':pick(['素直','気難しい']);}
  if(temper==='気難しい'){cap.kick=c(cap.kick+3);cap.wis=c(cap.wis-4);}
  if(temper==='素直')cap.wis=c(cap.wis+2);
  const style=o.style||(dist<=1400?pick(['逃げ','先行','先行','差し']):pick(['逃げ','先行','先行','差し','差し','追込']));
  const likes=pick(LIKES),dislikes=pick(LIKES.filter(x=>x!==likes));
  const h={id:0,name:o.name||'',sex:o.sex||(R()<.55?'牡':'牝'),by:o.by,sire:sire.id,dam:o.dam??null,damName:o.damName||damName(),breeder:o.breeder||'other',bredBy:o.bredBy||null,
    pot:Math.round(pot),cap,st:{},growth,temper,dist,surf,style,coat:o.coat||pick(Object.keys(COATS)),blaze:R()<.45,likes,dislikes,knownLikes:[],bond:o.bond||0,
    cond:3,fat:0,trainer:o.trainer||null,mode:'self',status:o.status||'現役',rest:0,cls:0,wins:0,starts:0,earn:0,fans:0,g1:0,gw:[],rec:[],mainJ:null,
    owner:o.owner||'me',known:{dist:false,style:false,temper:false,growth:false,going:false},pri:{},silks:o.silks||null,last:-9,risk:0,work:[],ev:null,
    heavy:clamp(Math.round(randn()*3),-4,4),preg:null};
  const f=frac(growth,hAge(h,S.t));
  for(const k of STATS)h.st[k]=cap[k]*f;
  return h;
}
function ability(h,dist,surf,opt={}){
  const s=h.st,L=clamp((dist-1200)/2000,0,1);
  const w={spd:.36-.14*L,sta:.06+.3*L,kick:.2-.04*L,pow:.12+(opt.heavy?.08:0)+(opt.slope?.04:0),guts:.12,wis:.08};
  let r=0,tot=0;for(const k in w){r+=s[k]*w[k];tot+=w[k];}
  r/=tot;
  r-=Math.pow(Math.abs(dist-h.dist)/1000,1.3)*10;
  if(surf!==h.surf)r-=7;
  if(opt.heavy)r+=h.heavy*.6;
  return r;
}
const bestAb=h=>ability(h,h.dist,h.surf);
function value(h){
  const a=ageOf(h);let p=bestAb(h);
  if(a<=3)p=Math.max(p,h.pot*(a<=2?.88:.94));
  let v=500*Math.exp((p-58)/8)+h.g1*15000+h.gw.length*2000;
  if(a>=6)v*=.5;if(h.status==='休養')v*=.6;
  return Math.round(v/10)*10;
}
function workout(h,int){
  const s=h.st,c=[.6,.3,0,-.2,-.4][h.cond-1];
  const t4=57.2-(s.spd*.045+s.pow*.025)+c+(int==='強め'?-.6:int==='軽め'?.9:0)+randn()*.3+(h.fat>50?.5:0);
  const t1=13.6-s.kick*.016+c*.3+(int==='強め'?-.15:int==='軽め'?.25:0)+randn()*.1;
  return{t:S.t,t4:t4.toFixed(1),t1:t1.toFixed(1),int};
}
function sym(v){return v>=82?'◎':v>=72?'○':v>=60?'▲':'△';}
function evalHorse(h){
  if(!h.trainer)return null;
  const tr=TR(h.trainer),tru=P(h.trainer).trust;
  const sd=2+(100-tru)*.11,bias=tru<40?2.5:0,out={};
  for(const k of STATS){const s=k===tr.eye?sd*.35:sd;out[k]=sym(h.st[k]+randn()*s+bias);}
  const room=STATS.reduce((a,k)=>a+h.cap[k]-h.st[k],0)/6;
  const rN=room+randn()*(sd*.6);
  const top=STATS.slice().sort((a,b)=>h.st[b]-h.st[a])[0];
  const lines=[];
  const tv=TV(h.trainer);
  lines.push(V(tv,'evRoom',{i:rN>14?0:rN>7?1:rN>2?2:3}));
  lines.push(V(tv,'evTop',{stat:SL[top]}));
  if(h.temper==='気難しい'&&tru>35)lines.push(V(tv,'evHot'));
  if(h.cond>=4)lines.push(V(tv,'evGood'));else if(h.cond<=2)lines.push(V(tv,'evBad'));
  return{sym:out,comment:lines.join('。').replace(/([！？])。/g,'$1')+'。',t:S.t};
}

/* ---------- races ---------- */
function fieldMean(grade,grp,m){
  if(grp==='2')return (M2[grade]??M2.OP)+(m-6);
  if(grp==='3')return (M3[grade]??M3.OP)+(m-1)*.55;
  return MO[grade]??MO.OP;
}
function courseSet(m){return m===7||m===8?['札幌','函館','新潟','小倉']:m<=3?['中山','京都','中京','小倉']:['東京','京都','阪神','中山'];}
function ageOk(c,a){return c==='2'?a===2:c==='3'?a===3:c==='3+'?a>=3:a>=4;}
function gradedRace(g){
  const grp=g.age==='2'?'2':g.age==='3'?'3':'3+';
  return{key:g.n,name:g.n,grade:g.gr,surf:g.surf,dist:g.dist,course:g.course,grp,mean:fieldMean(g.gr,grp,g.m),sd:g.gr==='G1'?3.5:4,n:g.gr==='G1'?16:14,prize:g.p,fan:g.fan||0,trial:g.trial||null,g:true,sex:g.sex};
}
function racesFor(h){
  const t=S.t,m=M(t),a=ageOf(h),out=[];
  if(h.status!=='現役'||a<2||(a===2&&m<6))return out;
  const grp=a===2?'2':(a===3&&m<=5)?'3':'3+';
  let grade=null;
  if(h.starts===0&&(a===2||(a===3&&m<=3)))grade='新馬';
  else if(h.wins===0){if((a===2&&m>=7)||(a===3&&m<=9))grade='未勝利';}
  else if(grp!=='3+')grade=h.cls>=3?'OP':'1勝';
  else grade=['','','1勝','2勝','3勝','OP'][h.cls];
  if(grade){
    const crs=courseSet(m);
    const combos=grade==='OP'?[['芝',1400],['芝',1800],['芝',2200],['ダ',1600]]:[['芝',1200],['芝',1600],['芝',2000],['芝',2400],['ダ',1400],['ダ',1800]];
    combos.forEach(([sf,d],i)=>{
      const gname=grade==='新馬'?'新馬戦':grade==='未勝利'?'未勝利戦':grade==='OP'?'オープン特別':grade+'クラス';
      const agel=grp==='2'?'2歳':grp==='3'?'3歳':(grade==='未勝利'?'3歳':'3歳以上');
      const crsI=crs[(t+i)%crs.length];out.push({key:`c-${grade}-${sf}${d}`,name:grade==='新馬'&&grp==='2'?`メイクデビュー${crsI}`:agel+gname,grade,surf:sf,dist:d,course:crs[(t+i)%crs.length],grp,mean:fieldMean(grade,grade==='未勝利'&&grp==='3+'?'o':grp,m),sd:4.5,n:grade==='OP'?12:14,prize:Math.round(PRIZE[grade]*(grp==='2'?.9:1)),g:false,debut:grade==='新馬'});
    });
  }
  if(h.cls>=5||(grp!=='3+'&&h.cls>=2)){
    GR.filter(g=>g.m===m).forEach(g=>{if(!ageOk(g.age,a))return;if(g.sex&&h.sex!=='牝')return;out.push(gradedRace(g));});
  }
  return out;
}
function entryStatus(h,r){
  if(r.grade!=='G1')return{st:'確定'};
  if(r.fan){
    if(h.fans>=r.fan)return{st:'確定',why:'ファン投票で選出'};
    if(h.earn>=20000||h.g1>0)return{st:'確定',why:'獲得賞金上位で選出'};
    return{st:'不可',why:`ファン投票圏外（ファン${r.fan/10000}万人、獲得賞金2億円、G1勝ちのどれかが必要）`};
  }
  if(h.pri[r.key])return{st:'確定',why:'トライアルで優先出走権'};
  const th=r.grp==='2'?1400:r.grp==='3'?3000:6000;
  if(h.earn>=th||h.g1>0)return{st:'確定',why:'収得賞金上位'};
  return{st:'抽選',why:'収得賞金が足りず抽選（当選率およそ35%）'};
}
function jockeyAway(id){const j=JK(id);return j&&j.season&&!j.season.includes(M(S.t));}
function riderOf(r){
  let j=r.j;
  if(j==='washio'&&S.part===2)j=S.br.hinataLeft?'hinata':'rossi';
  if(j==='hinata'&&!S.br.hinataLeft)j='kido';
  if(j&&JK(j)&&!jockeyAway(j))return j;
  return null;
}
function planRivals(){
  const m=M(S.t);const gs=GR.filter(g=>g.m===m);
  S.rivals.forEach(r=>{r.target=null;if(r.status!=='現役'||r.fat>45)return;const a=ageOf(r);
    const ok=gs.filter(g=>ageOk(g.age,a)&&(!g.sex||r.sex==='牝')&&g.surf===r.surf&&Math.abs(g.dist-r.dist)<=650);
    const g1=ok.filter(g=>g.gr==='G1').sort((x,y)=>Math.abs(x.dist-r.dist)-Math.abs(y.dist-r.dist))[0];
    if(g1){r.target=g1.n;return;}
    if(ok.length&&R()<.45)r.target=pick(ok).n;});
}
const rivalWants=(r,race)=>race.g&&r.target===race.key;
function rivalRiders(race){return S.rivals.filter(r=>rivalWants(r,race)).map(riderOf).filter(Boolean);}
function jockeyBusy(jid,hid){if(jid==='stable')return false;return Object.entries(S.month.orders).some(([k,o])=>o.type==='race'&&o.j===jid&&+k!==hid);}
function askJockey(jid,h,race){
  if(jid==='stable')return[true,'厩舎所属の若手が乗る。'];
  const p=P(jid),j=JK(jid);
  if(!jockeysAvail().includes(jid))return[false,'今はあなたの馬には乗れない。'];
  if(jockeyAway(jid))return[false,`${p.n}騎手は今の時期は日本にいない（${j.season[0]}〜${j.season[j.season.length-1]}月のみ）。`];
  if(jockeyBusy(jid,h.id))return[false,'同じ月に、別のあなたの馬に乗ることが決まっている。'];
  if(rivalRiders(race).includes(jid))return[false,`「そのレースは先約がある」──${jid==='washio'?'九条の馬に乗るらしい':'他陣営のお手馬に乗る予定だ'}。`];
  if(h.mainJ===jid)return[true,V(jid,'acceptMain',{h:h.name})];
  if(jid==='washio'&&S.flags.washioPromise&&S.flags.washioPromise.hid===h.id&&race.grade==='G1')return[true,'「約束だからな。乗ってやる」'];
  const tr=TR(h.trainer);if(tr&&tr.jk===jid)return[true,'厩舎の主戦騎手として、すんなり決まった。'];
  const need=j.need??20;
  const gb={G1:15,G2:8,G3:5,OP:2}[race.grade]||0;
  const score=p.trust*.6+S.fame*.3+Math.max(0,ability(h,race.dist,race.surf)-50)*.8+h.g1*10+gb+R()*12;
  if(score>=need)return[true,V(jid,'accept',{h:h.name})];
  return[false,V(jid,'decline')+'（もっと信頼を深めるか、馬の実績が必要だ）'];
}

/* ---------- race simulation ---------- */
function mkRunner(o,race,going){
  const r={...o};const heavy=going!=='良',slope=SLOPE.includes(race.course);
  if(o.h){r.name=o.h.name;r.style=o.h.style;r.base=ability(o.h,race.dist,race.surf,{heavy,slope});r.cond=o.h.cond;r.fat=o.h.fat;r.silks=o.h.silks||S.silks;r.wis=o.h.st.wis;r.temper=o.h.temper;}
  else{r.cond=3;r.fat=20;r.silks=randSilks();r.wis=60;r.temper='普通';}
  r.jname=o.jid?JNAME(o.jid):pick(NPCJ);r.jsk=o.jid?JSK(o.jid):60+R()*10;
  let ex=r.base+[-5,-2.5,0,1.5,3][r.cond-1]-Math.max(0,r.fat-35)*.18+(r.jsk-70)*.13;
  if(o.mine&&o.jid&&o.jid!=='stable')ex+=(P(o.jid).trust-50)*.03;
  if(o.mine)ex+=o.h.bond*.015;
  r.exp=ex;
  return r;
}
function buildField(race,ents){
  const going=race.going||(race.going=R()<.68?'良':R()<.6?'稍重':'重');
  const fld=[],used=new Set();
  const banned=j=>j&&j!=='stable'&&JK(j)&&JK(j).ban>S.t;
  ents.forEach(e=>{if(banned(e.j)){RC_SUB.push(`${JNAME(e.j)}騎手は騎乗停止中のため、${e.h.name}は厩舎所属の騎手に乗り替わり。`);e.j='stable';}used.add(e.j);fld.push(mkRunner({mine:true,h:e.h,jid:e.j,tac:e.tac||'おまかせ'},race,going));});
  if(race.g){S.rivals.filter(r=>rivalWants(r,race)).sort((a,b)=>bestAb(b)-bestAb(a)).slice(0,race.key==='有馬記念'?4:3).forEach(r=>{
    let jid=riderOf(r);if(jid&&(used.has(jid)||banned(jid)))jid=null;if(jid)used.add(jid);fld.push(mkRunner({rival:true,h:r,jid},race,going));});}
  const pool=Object.keys(S.jockeys).filter(j=>!used.has(j)&&!jockeyAway(j)&&!banned(j)&&!(j==='washio'&&S.part===2)&&!(j==='komori'&&!S.flags.komori));
  while(fld.length<race.n){
    let jid=null;if(pool.length&&R()<(race.grade==='G1'?.6:.2))jid=pool.splice(Math.floor(R()*pool.length),1)[0];
    fld.push(mkRunner({npc:true,name:makeName(),base:race.mean+randn()*race.sd,style:pick(['逃げ','先行','先行','先行','先行','差し','差し','差し','差し','追込','追込']),jid},race,going));
  }
  for(let i=fld.length-1;i>0;i--){const k=Math.floor(R()*(i+1));[fld[i],fld[k]]=[fld[k],fld[i]];}
  fld.forEach((f,i)=>f.no=i+1);
  // the betting public does not see true ability: it reads past form, the jockey and the stable talk, and guesses (more so about horses with few runs)
  const pub=f=>{const h=f.h,st=h?(h.starts||0):3+Math.floor(R()*8),w=st===0?.62:st<3?.7:st<8?.78:.84;
    const form=h&&st?clamp((h.wins||0)/st*7-1.2,-2,4):0;return f.exp*w+(race.mean+form)*(1-w)+jkPop(f)+randn()*(st===0?1.6:1.1);};
  // the rider: fans back a top jockey beyond the horse's merit ("騎手人気"), and shy away from an unknown name
  const jkPop=f=>{const j=f.jsk||65;return (j-70)*.09+(j>=86?2.2:j>=80?.8:0);};
  fld.forEach(f=>f.mexp=pub(f));
  const ex=fld.map(f=>Math.exp(f.mexp/3.4)),sum=ex.reduce((a,b)=>a+b,0);
  fld.forEach((f,i)=>f.odds=clamp(Math.round(.8/(ex[i]/sum)*10)/10,1.1,999.9));
  [...fld].sort((a,b)=>a.odds-b.odds).forEach((f,i)=>f.pop=i+1);
  return fld;
}
function runSim(RC){
  const fr=RC.field;
  fr.forEach(f=>{f.used=f.tac&&f.tac!=='おまかせ'?f.tac:f.style;});
  const fronts=fr.filter(f=>f.used==='逃げ'),nf=fronts.length;
  // who wants the lead decides the race: a lone front-runner gets an easy lead, two of them duel and burn each other out,
  // sometimes one bolts off for a huge lead (大逃げ), and with nobody keen a 先行 horse is pushed to the front at a crawl
  const pace=nf===0?'スロー':nf===1?(R()<.65?'スロー':'ミドル'):nf===2?(R()<.5?'ミドル':'ハイ'):'ハイ';
  let shape=nf===0?'押し出し':nf===1?'単騎':'競り合い',leader=nf?pick(fronts):(pick(fr.filter(f=>f.used==='先行'))||fr[0]);
  if(nf>=1&&R()<(nf===1?.14:.08)){shape='大逃げ';leader=fronts.find(f=>f.temper==='気難しい')||leader;}
  RC.shape=shape;RC.leadNo=leader.no;
  const PB={ハイ:{逃げ:-2,先行:-.8,差し:.8,追込:1.1},スロー:{逃げ:1.5,先行:.8,差し:-.5,追込:-1.5},ミドル:{逃げ:0,先行:.3,差し:.2,追込:-.3}};
  fr.forEach(f=>{
    const d=Math.abs(STY.indexOf(f.used)-STY.indexOf(f.style));
    let adj=(!f.tac||f.tac==='おまかせ')?.8:(d===0?.8:d===1?-.6:-2.5);
    if(f.tac&&f.tac!=='おまかせ'&&d>0)adj+=(f.wis-60)*.03;
    const W=f.why={tac:adj-.8,jk:0,pace:0,shape:0,course:0,hill:0,temper:0,luck:0};let a0=adj;
    const jk=f.jid&&f.jid!=='stable'?JK(f.jid):null;
    if(jk){if(jk.likes&&jk.likes.includes(f.used))adj+=1;if(jk.dirt&&RC.race.surf==='ダ')adj+=1.5;if(jk.local&&['札幌','函館','新潟','小倉','福島'].includes(RC.race.course))adj+=1.5;if(jk.heavy&&RC.race.going!=='良')adj+=1;}
    W.jk=adj-a0;a0=adj;
    adj+=PB[RC.pace=pace][f.used];W.pace=PB[pace][f.used];a0=adj;
    adj+={逃げ:2.3,先行:.3,差し:-.3,追込:-1}[f.used];   // being near the front is worth something in itself
    if(f===leader){if(shape==='単騎')adj+=pace==='スロー'?1.9:.9;if(shape==='押し出し')adj+=1.2;if(shape==='大逃げ')adj+=R()<.33?3.2:-3.6;}
    if(shape==='競り合い'&&f.used==='逃げ')adj-=1;
    W.shape=adj-a0-{逃げ:2.3,先行:.3,差し:-.3,追込:-1}[f.used];a0=adj;
    // the course decides: a long straight lets closers run, a short one favours the front; a hill at the line tests power and guts
    {const cc=courseChar(RC.race),sL=clamp((cc.st-360)/110,-1,2.4);adj+={逃げ:-.55,先行:-.2,差し:.3,追込:.55}[f.used]*sL;
     if(cc.hs){const pg=f.h?((f.h.st.pow||70)+(f.h.st.guts||70))/2:62+R()*16;adj+=(pg-72)*.035*cc.hs;}
     W.hill=cc.hs?((f.h?((f.h.st.pow||70)+(f.h.st.guts||70))/2:72)-72)*.035*cc.hs:0;
     if(cc.kyoto&&RC.race.dist>=1800)adj+={逃げ:-.2,先行:0,差し:.25,追込:.2}[f.used];W.course=adj-a0-W.hill;a0=adj;}
    let sd=3.4-f.wis*.012;
    if(f.temper==='気難しい'){sd+=1.2;const calm=(f.mine&&f.h.bond>=50)||f.jid==='washio'||(f.jid&&f.jid!=='stable'&&f.mine&&P(f.jid).trust>=60);adj+=calm?1.4:-1.2;}
    if(f.temper==='素直')adj+=.3;W.temper=adj-a0;
    f.perf=f.exp+adj+randn()*Math.max(2.1,sd*1.15);
    // racing luck: a longshot runs the race of its life, a favourite gets blocked / doesn't fire
    f.ev=null;const pop=f.pop||8;
    if(R()<.05+Math.max(0,pop-5)*.008){const x=2.5+R()*3;f.perf+=x;f.ev='激走';W.luck=x;}
    else if(R()<.06+(pop<=3?.04:0)){const x=2+R()*3;f.perf-=x;f.ev=R()<.5?'不利':'伸びず';W.luck=-x;}
  });
  const ord=[...fr].sort((a,b)=>b.perf-a.perf);
  ord.forEach((f,i)=>{f.pos=i+1;f.gapL=i?(ord[0].perf-f.perf)*.3:0;f.margin=i?marginStr((ord[i-1].perf-f.perf)*.3):'';});
  RC.order=ord;RC.pace=pace;
  const w=ord[0];const v=16.2+(RC.race.mean-60)*.035+(w.perf-RC.race.mean)*.02-(RC.race.surf==='ダ'?.6:0)-(RC.race.going==='重'?.25:0);
  RC.time=RC.race.dist/v;
}
function marginStr(L){if(L<.06)return'ハナ';if(L<.16)return'アタマ';if(L<.3)return'クビ';if(L>=10)return'大差';const n=Math.max(.5,Math.round(L*2)/2),w=Math.floor(n);return n-w?(w?`${w}･1/2`:'1/2'):String(w);}
function timeStr(s){const m=Math.floor(s/60);return `${m}:${(s-m*60).toFixed(1).padStart(4,'0')}`;}

function jockeyComment(f,race){
  const h=f.h,out=[],dd=race.dist-h.dist,id=f.jid||'stable';
  const v=(k,x={})=>V(id,k,{h:h.name,...x});
  if(f.pos===1)out.push(race.grade==='G1'?v('winBig'):v('win'));
  if(dd>450){out.push(v('long'));if(!h.known.dist){h.known.dist=true;out.push(`（得意距離が見えてきた：${h.dist}m前後）`);}}
  else if(dd<-450){out.push(v('short'));if(!h.known.dist){h.known.dist=true;out.push(`（得意距離が見えてきた：${h.dist}m前後）`);}}
  if(race.surf!==h.surf)out.push(v('surf',{sf:race.surf==='ダ'?'ダート':'芝'}));
  if(race.going!=='良'&&!h.known.going){h.known.going=true;out.push(v(h.heavy>=1?'heavyGood':h.heavy<=-1?'heavyBad':'heavyOk'));}
  const d=Math.abs(STY.indexOf(f.used)-STY.indexOf(h.style));
  if(d>=2){out.push(v('styleBad',{s:h.style}));h.known.style=true;}
  if(h.temper==='気難しい'&&!h.known.temper){h.known.temper=true;out.push(v('hot'));}
  if(h.temper==='素直'&&!h.known.temper&&h.starts>=2){h.known.temper=true;out.push(v('calm'));}
  if(f.fat>55)out.push(v('tired'));
  if(f.pos>1&&out.length<2)out.push(f.pos<=3?v('near'):f.pos<=6?v('mid'):v('bad'));
  if(h.starts>=3&&!h.known.style)h.known.style=true;
  return out.join(' ');
}
function injuryRoll(h,mult=1){
  const tr=TR(h.trainer);
  const p=(.012+Math.max(0,h.fat-40)*.0015+(100-(tr?tr.care:75))*.0003+(h.risk?.25:0))*mult;h.risk=0;
  if(R()<p){const x=R();if(x<.06){h.status='引退';return'競走能力喪失';}if(x<.32){h.status='休養';h.rest=8+Math.floor(R()*4);return'骨折';}h.status='休養';h.rest=2+Math.floor(R()*2);return'軽い屈腱炎';}
  return null;
}
/* apply a finished race. returns list of note strings */
function applyRace(RC){
  const race=RC.race,ord=RC.order,notes=[];
  S.month.ran.push(race.key);
  for(const f of ord.filter(x=>x.mine)){
    const h=f.h,pos=f.pos,jid=f.jid;
    const prize=pos<=5?Math.round(race.prize*[1,.4,.25,.15,.1][pos-1]):0;
    h.earn+=prize;S.money+=Math.round(prize*.8);S.rep.prize+=Math.round(prize*.8);h.starts++;h.last=S.t;
    h.rec.unshift({t:S.t,n:race.name,gr:race.grade,pos,of:ord.length,j:JNAME(jid),d:race.dist,s:race.surf,pop:f.pop,going:race.going});
    if(pos===1){h.wins++;
      if(race.g||race.grade==='OP')h.cls=5;else if(race.grade==='新馬'||race.grade==='未勝利')h.cls=2;else h.cls=Math.min(5,h.cls+1);
      if(race.g)h.gw.push(race.name);
      if(race.grade==='G1'){h.g1++;log(`${h.name}、${race.name}制覇（${JNAME(jid)}）`);if(S.part===1&&!S.br.kujoSale&&!S.flags.kujoOfferPending)S.flags.kujoOfferPending=h.id;}
      else if(race.g)log(`${h.name}、${race.name}で重賞初制覇`);
    }else if(h.cls===0)h.cls=1;
    if(race.trial&&pos<=(race.grade==='G2'?3:2)){h.pri[race.trial]=true;notes.push(`${h.name}、${race.trial}への優先出走権を獲得`);}
    h.fans+=(FANS[race.grade]||[800,300,150])[pos-1]||0;
    S.fame=clamp(S.fame+(({G1:[8,3,2],G2:[3,1,1],G3:[2,1],OP:[1]}[race.grade]||[.5])[pos-1]||0),0,100);
    h.fat+=18+race.dist/250+(race.grade==='G1'?6:0);
    if(jid&&jid!=='stable'){P(jid).met=true;trust(jid,2+(pos===1?6:pos<=3?2:0));const j=JK(jid);j.rides++;if(pos===1)j.wins++;
      if(j.grow)j.sk=Math.min((j.cap||88)+(S.part===2?6:0),j.sk+.5+(pos===1?1.2:0)+(race.g?.4:0));}
    if(race.grade==='G1'&&h.mainJ==='hinata'){if(jid==='hinata')S.br.hinataKept++;else{S.br.hinataSwitch++;trust('hinata',-12);if(S.br.hinataSwitch>=2&&!S.br.hinataLeft)S.flags.hinataLeavePending=1;}}
    f.comment=jockeyComment(f,race);f.prize=prize;
    const inj=injuryRoll(h);if(inj){notes.push(`${h.name}に${inj}`);pushEv('injury',{hid:h.id,kind:inj});}
    if(pos<=3&&jid&&jid!=='stable'&&h.mainJ!==jid&&R()<.5&&!S.inbox.some(e=>e.type==='mainAsk'&&e.data.hid===h.id))pushEv('mainAsk',{hid:h.id,jid});
    if(pos===1&&race.g&&R()<.35)pushEv('tv',{hid:h.id});
    if(race.g)news(`【${race.grade}】${race.name}　${h.name}は${pos}着（${f.pop}番人気・${JNAME(jid)}）`);
    else S.rep.lines.push(`${h.name}　${race.name}（${race.course}${race.surf}${race.dist}m・${race.going}）　${pos}着／${ord.length}頭　${JNAME(jid)}${prize?`　賞金${yen(prize)}`:''}`);
    if(pos===1&&!race.g)S.rep.lines[S.rep.lines.length-1]+=`　→ ${CLSN[h.cls]}へ`;
  }
  applyRivals(race,ord);
  if(race.grade==='G1'&&!ord[0].mine)news(`【G1】${race.name}は${ord[0].name}（${ord[0].jname}）`);
  if(race.key==='有馬記念'){const w=ord[0];S.arima.push({y:Y(S.t),w:w.name,o:w.mine?ownerName():w.rival?OWN[w.h.owner].n:'—',me:!!w.mine,part:S.part});
    if(w.mine)S.flags.arimaWinPending={hid:w.h.id,jid:w.jid,time:timeStr(RC.time)};}
  return notes;
}
function applyRivals(race,ord){
  ord.filter(f=>f.rival).forEach(f=>{const r=f.h;r.starts++;r.last=S.t;r.fat+=22;
    r.fans+=(FANS[race.grade]||FANS.OP)[f.pos-1]||0;
    if(f.pos===1){r.wins++;if(race.g)r.gw.push(race.name);if(race.grade==='G1')r.g1++;}
    if(f.pos<=5)r.earn+=race.prize*[1,.4,.25,.15,.1][f.pos-1];});
}
function simNpc(race){
  const fld=buildField(race,[]);
  fld.forEach(f=>{f.used=f.style;f.perf=f.exp+randn()*3.2;});
  const ord=[...fld].sort((a,b)=>b.perf-a.perf);ord.forEach((f,i)=>f.pos=i+1);
  applyRivals(race,ord);
  news(`【G1】${race.name}は${ord[0].name}（${ord[0].jname}）`);
  if(race.key==='有馬記念')S.arima.push({y:Y(S.t),w:ord[0].name,o:ord[0].rival?OWN[ord[0].h.owner].n:'—',me:false,part:S.part});
}

/* ---------- auctions ---------- */
function lotValue(h){return 700*Math.exp((h.pot-60)/8.5)*(1+(ST(h.sire).q-75)/40);}
function incOf(p){return p<3000?100:p<10000?500:1000;}
function roundInc(p){const i=incOf(p);return Math.floor(p/i)*i;}
function nakaharaEye(h){
  const who=S.part===2&&S.br.farm==='support'?'mio':'nakahara';
  const tr=P(who).trust;const sd=Math.max(2,9-tr*.07);
  const ev=clamp(h.pot+randn()*sd,40,99);
  const g=ev>=90?'S':ev>=83?'A':ev>=76?'B':ev>=68?'C':'D';
  const n=[];
  const gTrue=R()<.45+tr*.005?h.growth:pick(['早熟','普通','晩成']);
  n.push({早熟:'もう体ができている。仕上がりは早い',普通:'バランスがいい。順調に育つ',晩成:'まだ緩い。だが完成したら化けるかもしれん'}[gTrue]);
  const d=Math.round((h.dist+randn()*(400-tr*3))/200)*200;
  n.push(`${d<=1400?'短距離':d<=1800?'マイルから中距離':d<=2400?'中距離から2400':'長距離'}向きの体（${d}m前後）`);
  if(R()<.4+tr*.004)n.push(h.temper==='気難しい'?'目つきがきつい。気性は難しそうだ':h.temper==='素直'?'人懐っこい。素直な子だ':'気性は普通');
  if(h.pot>=88&&R()<.5)n.push('こいつは…いい馬だ');
  return{g,notes:n,who};
}
function makeSale(kind){
  const sel=kind==='セレクトセール',lots=[];
  for(let i=0;i<(sel?8:6);i++){
    const h=genHorse({by:Y(S.t)-(sel?1:2),tier:sel?1:0,bias:sel?2:-5,status:sel?'1歳':'現役',owner:'sale'});
    const v=lotValue(h)*(sel?1:.6);const est=v*Math.exp(randn()*.3);
    const rv=Object.keys(OWN).map(o=>R()<OWN[o].int?{o,max:Math.round(v*OWN[o].aggr*Math.exp(randn()*.3))}:null).filter(Boolean);
    lots.push({no:i+1,h,eye:nakaharaEye(h),start:Math.max(sel?1000:300,roundInc(v*.25)),lo:roundInc(est*.7),hi:roundInc(est*1.3),rv,res:null});
  }
  return{kind,t:S.t,lots,blocked:S.restPenalty>0};
}
function lotAward(l,w,price){
  l.res={w,price};const h=l.h;
  if(w==='me'){S.money-=price;h.owner='me';h.id=S.nid++;h.name=makeName(S.kanmei);h.silks=S.silks;S.horses.push(h);log(`${S.sale.kind}で${ST(h.sire).n}産駒を${yen(price)}で落札（${h.name}）`);}
  else if(w&&((w==='九条'&&h.pot>=80)||h.pot>=87)){const ro=OWN[w];h.owner=w;h.id=S.nid++;h.name=makeName(ro.pre);h.silks=ro.silks;h.cls=5;h.j=w==='九条'&&h.pot>=88?'washio':pick(['kido','rossi',null]);if(h.status==='1歳')h.status='育成';S.rivals.push(h);}
}
function resolveLot(l,floor){
  floor=floor||l.start;const rs=l.rv.filter(r=>r.max>=floor).sort((a,b)=>b.max-a.max);
  if(!rs.length){l.res={w:null,price:0};return;}
  const price=rs[1]?Math.max(floor,roundInc(Math.min(rs[0].max,rs[1].max+incOf(rs[1].max)))):floor;
  lotAward(l,rs[0].o,price);
}

/* ---------- breeding ---------- */
function nick(mare,st){
  let c=3-Math.abs(mare.dist-st.dist)/350;
  if(mare.temper==='気難しい'&&st.tp==='素直')c+=1.5;
  if(mare.temper==='気難しい'&&st.tp==='気難しい')c-=1;
  c+=(hash(mare.id+'|'+st.id)-.5)*4;
  return clamp(c,-3,6);
}
function proposals(mare){
  const who=S.part===2&&S.br.farm==='support'?'mio':'nakahara';
  const tru=P(who)?P(who).trust:30;
  const list=S.stallions.filter(s=>!s.dead).map(s=>{const real=s.q*.55+nick(mare,s);return{s,score:real+randn()*Math.max(1,8-tru*.07)};}).sort((a,b)=>b.score-a.score);
  // pick 3: best-scoring expensive, a mid one, a value one
  const out=[];for(const x of list){if(out.length>=3)break;if(out.some(o=>Math.abs(o.s.fee-x.s.fee)<60))continue;out.push(x);}
  return out.map(x=>({id:x.s.id,fee:stallionFee(x.s),why:reasonFor(mare,x.s,tru)}));
}
function stallionFee(s){return s.owner==='九条'&&S.br.rei==='ally'?Math.round(s.fee*.4):s.fee;}
function reasonFor(mare,s,tru){
  const r=[];const nk=nick(mare,s)+randn()*Math.max(.5,3-tru*.03);
  if(Math.abs(mare.dist-s.dist)<=300)r.push('距離の適性が母と揃う');
  else if(s.dist>mare.dist)r.push('距離の幅を伸ばせる');else r.push('スピードを足せる');
  if(mare.temper==='気難しい'&&s.tp==='素直')r.push('気性を落ち着かせてくれる');
  if(s.g==='晩成')r.push('遅咲きだが、古馬になって強くなる');
  if(SLOPE.includes('中山')&&s.id==='iron')r.push('中山の坂に強い血');
  if(nk>3)r.push('この組み合わせは、わしの勘が「いける」と言っとる');
  else if(nk<0&&tru>50)r.push('ただ、相性は正直わからん');
  if(s.fromSold)r.push('あの馬の血だ。思うところはあるだろうが');
  if(s.own)r.push('あんたが育てた血だ');
  return r.join('。')+'。';
}
function breed(mare,sid){
  const s=ST(sid),fee=stallionFee(s);
  S.money-=fee;S.rep.cost+=fee;
  mare.preg={sire:sid,due:S.t+12+(M(S.t)<=3?1:0),nick:nick(mare,s),by:S.part===1?'parent':'child'};
  log(`${mare.name}に${s.n}を種付け（${yen(fee)}）`);
}
function foal(mare){
  const s=ST(mare.preg.sire);
  const h=genHorse({by:Y(S.t),sire:s,damPot:mare.pot,damDist:mare.dist,damGrowth:mare.growth,nick:mare.preg.nick,dam:mare.id,damName:mare.name,breeder:S.br.farm==='abandon'?'大手':'中原',bredBy:mare.preg.by,status:'当歳',owner:'me',coat:R()<.5?mare.coat:null});
  h.id=S.nid++;h.name=`${mare.name}の${Y(S.t)}`;h.silks=S.silks;h.unnamed=true;
  S.horses.push(h);mare.preg=null;
  log(`${mare.name}が${h.sex==='牡'?'牡馬':'牝馬'}を出産（父 ${s.n}）`);
  return h;
}

/* ---------- monthly flow ---------- */
function newGame(f){
  S={v:2,part:1,t:0,startT:0,parent:{name:f.name,collapsed:false,fate:null},child:null,kanmei:f.kanmei,silks:f.silks,
    money:20000,fame:3,nid:1,horses:[],rivals:[],stallions:STALLIONS0.map(s=>({...s})),
    people:Object.fromEntries(Object.entries(PEOPLE0).map(([k,v])=>[k,{...v,met:false,t1:null}])),
    jockeys:Object.fromEntries(Object.entries(JOCKEYS0).map(([k,v])=>[k,{...v,rides:0,wins:0}])),
    trainers:JSON.parse(JSON.stringify(TRAINERS0)),
    br:{farm:null,kujoSale:null,soldId:null,health:[],inherit:null,hinataKept:0,hinataSwitch:0,hinataLeft:false,rei:null},
    flags:{},inbox:[],news:[],log:[],arima:[],sale:null,restPenalty:0,topicT:{},month:null,rep:null,won:{parent:null,child:null},ended:false,over:false};
  S.people.mikuni.met=true;S.people.nakahara.met=true;
  S.parent.collapseT=12*(8+Math.floor(R()*4))+1+Math.floor(R()*9);
  const mk=(own,o)=>{const ro=OWN[own];const h=genHorse({...o,owner:own,silks:ro.silks});h.id=S.nid++;h.name=o.name;h.cls=5;Object.assign(h.known,{dist:true,style:true});h.j=o.j;h.fans=o.fans||0;h.g1=o.g1||0;h.gw=o.gw||[];h.wins=o.wins||0;h.starts=o.starts||0;S.rivals.push(h);return h;};
  mk('九条',{name:'クジョウレガリア',sex:'牡',by:2023,sire:'kujoemp',pot:91,dist:2200,surf:'芝',growth:'普通',style:'先行',j:'washio',fans:90000,g1:2,gw:['皐月賞','天皇賞（秋）'],wins:7,starts:11});
  mk('九条',{name:'クジョウアトラス',sex:'牡',by:2024,sire:'iron',pot:87,dist:2600,surf:'芝',growth:'晩成',style:'差し',j:'rossi',fans:25000,gw:['青葉賞'],wins:3,starts:6});
  mk('アルカディア',{name:'アークレグナム',sex:'牡',by:2022,sire:'chariot',pot:87,dist:2000,surf:'芝',growth:'普通',style:'差し',j:'kido',fans:55000,g1:1,gw:['大阪杯'],wins:6,starts:16});
  mk('北辰',{name:'ホクシンライデン',sex:'牡',by:2023,sire:'midnight',pot:86,dist:1700,surf:'ダ',growth:'普通',style:'逃げ',j:null,fans:20000,g1:1,gw:['チャンピオンズC'],wins:6,starts:10});
  mk('アルカディア',{name:'ルミナスベル',sex:'牝',by:2023,sire:'valencia',pot:85,dist:1600,surf:'芝',growth:'普通',style:'先行',j:null,fans:35000,g1:1,gw:['桜花賞'],wins:4,starts:9});
  mk('九条',{name:'クジョウセレネ',sex:'牝',by:2025,sire:'empire',pot:86,dist:2000,surf:'芝',growth:'早熟',style:'先行',j:'rossi'});
  log(`${S.parent.name}、馬主になる`);
  beginMonth(true);
  save();
}
function startMonthReport(){S.rep={t:S.t,lines:[],prize:0,income:0,cost:0,grow:[],inj:[],births:[],notes:[]};}
function beginMonth(first){
  S.month={met:false,talked:0,orders:{},touched:{},ran:[]};
  const m=M(S.t);
  if(m===1&&!first)newYear();
  S.sale=null;
  if(m===4)S.sale=makeSale('2歳トレーニングセール');
  if(m===7)S.sale=makeSale('セレクトセール');
  storyTriggers(first);
  // births
  mine().filter(h=>h.status==='繁殖'&&h.preg&&h.preg.due<=S.t).forEach(mr=>{const f=foal(mr);pushEv('birth',{hid:f.id,mare:mr.id});});
  // breeding season proposals
  if(m>=2&&m<=5)mine().filter(h=>h.status==='繁殖'&&!h.preg&&h.propY!==Y(S.t)).forEach(mr=>{mr.propY=Y(S.t);pushEv('breeding',{hid:mr.id,list:proposals(mr)});});
  if(m===4)mine().filter(h=>h.status==='育成').forEach(h=>pushEv('nyukyu',{hid:h.id}));
  if(m===12)fanVoteEvent();
  planRivals();
  planOmakase();
  for(const h of racing())if(h.status==='現役'&&!S.month.orders[h.id])S.month.orders[h.id]={type:'train',int:h.lastInt||'普通'};
}
function newYear(){
  const y=Y(S.t);
  S.rivals.forEach(r=>{if(r.status==='現役'&&ageOf(r)>=(r.growth==='晩成'?7:6)){r.status='引退';news(`${r.name}（${OWN[r.owner].n}）が引退。通算${r.starts}戦${r.wins}勝`);
    if(r.sex==='牡'&&r.g1>0)addStallion(r);}});
  S.rivals=S.rivals.filter(r=>r.status!=='引退');
  for(let i=0;i<3;i++){
    const o=i===0?'九条':pick(Object.keys(OWN));let sire=null,fromSold=false;
    const sold=S.stallions.find(s=>s.fromSold);
    if(o==='九条'&&sold&&R()<.6){sire=sold;fromSold=true;}
    const h=genHorse({by:y-2,tier:1,pot:83+R()*8,sire,owner:o,silks:OWN[o].silks});
    h.id=S.nid++;h.name=makeName(OWN[o].pre);h.cls=5;h.j=o==='九条'?pick(['washio','rossi','sanada']):pick(['kido','oba','dubois','sanada','arai',null]);h.fromSold=fromSold;S.rivals.push(h);
  }
  S.rivals.forEach(r=>{if(r.status==='育成'&&ageOf(r)>=2)r.status='現役';});
  mine().forEach(h=>{
    if(h.status==='当歳')h.status='1歳';else if(h.status==='1歳')h.status='育成';
    if(['現役','放牧','休養'].includes(h.status)&&ageOf(h)>=8)pushEv('retireTalk',{hid:h.id,forced:true});
  });
  log(`${y}年。${S.part===1?`${S.parent.name}`:`${S.child.name}`}にとって${yearNo()}年目の年が明けた`);
}
function addStallion(h,own){
  if(S.stallions.some(s=>s.id==='h'+h.id))return;
  const q=clamp(Math.round(h.pot+2+h.g1),70,95);
  const s={id:'h'+h.id,n:h.name,q,dist:h.dist,surf:h.surf,g:h.growth,tp:h.temper==='気難しい'?'気難しい':h.temper,fee:Math.min(3500,Math.round(80*Math.exp((q-70)/6)/10)*10),desc:`${h.gw.slice(-2).join('・')||'活躍馬'}の血`,owner:h.owner==='me'?'':OWN[h.owner]?.n.slice(0,2)||'',fromSold:h.id===S.br.soldId,own:!!own,bornY:Y(S.t)};
  S.stallions.push(s);
  news(`${h.name}が種牡馬入り（種付け料 ${yen(s.fee)}）`);
}
function planOmakase(only){
  for(const h of (only||racing()).filter(h=>h.mode==='omakase'&&h.status==='現役'&&h.trainer)){
    const tr=TR(h.trainer),tru=P(h.trainer).trust;
    const spaced=tr.policy==='spaced';
    if(h.fat>(spaced?55:65)){S.month.orders[h.id]={type:'rest',by:'trainer'};continue;}
    if(h.fat>(spaced?30:45)||(spaced&&S.t-h.last<2)){S.month.orders[h.id]={type:'train',int:'普通',by:'trainer'};continue;}
    const cand=racesFor(h).filter(r=>entryStatus(h,r).st==='確定').map(r=>{
      const est=ability(h,r.dist,r.surf)+randn()*Math.max(.5,(100-tru)*.06);
      return{r,sc:est-r.mean+(r.g?(spaced?2.5:.5):0)+(r.grade==='G1'?(spaced?2:0):0)};}).sort((a,b)=>b.sc-a.sc);
    const best=cand[0];
    if(!best||best.sc<(spaced?-2:-6)){S.month.orders[h.id]={type:'train',int:spaced?'普通':'強め',by:'trainer'};continue;}
    if(best.r.grade==='G1'){if(!S.inbox.some(e=>e.type==='g1consult'&&e.data.hid===h.id))pushEv('g1consult',{hid:h.id,key:best.r.key});S.month.orders[h.id]={type:'train',int:'普通',by:'trainer'};continue;}
    let j=null;for(const jid of [h.mainJ,tr.jk,'kido','stable'].filter(Boolean)){if(askJockey(jid,h,best.r)[0]){j=jid;break;}}
    S.month.orders[h.id]={type:'race',race:best.r,j,tac:'おまかせ',by:'trainer'};
  }
}
function monthlyCost(){
  let c=0;const farmFee=S.br.farm==='abandon'?55:30;
  for(const h of mine()){
    if(h.status==='現役'||h.status==='休養'){const tr=TR(h.trainer);c+=70+(tr?tr.fee:0);}
    else if(h.status==='放牧')c+=45;
    else if(['繁殖','当歳','1歳','育成'].includes(h.status))c+=farmFee;
  }return c;
}
function tickHorse(h,isMine){
  if(!['現役','放牧','休養','育成','1歳','当歳'].includes(h.status))return;
  const tr=isMine?TR(h.trainer):null;const sk=tr?tr.sk+(P(h.trainer).trust-50)*.05:84;
  const int=h.curInt||'普通';
  const tm={軽め:-.01,普通:0,強め:.015}[int]||0;
  const f=frac(h.growth,hAge(h,S.t))*(.95+sk*.0006+tm);
  for(const k of STATS){const tg=h.cap[k]*f;h.st[k]+=(tg-h.st[k])*(tg>h.st[k]?.35:.18);}
  const rec=(h.status==='放牧'||h.status==='休養')?55:{軽め:32,普通:24,強め:15}[int];
  h.fat=Math.max(0,h.fat-rec);
  if(h.status==='放牧'){if(R()<.6)h.cond=clamp(h.cond+1,1,4);}
  else{const p=R(),dr=(h.fat>45?-.2:0)+(tr?(tr.care-75)*.004:0)+(int==='強め'?-.05:int==='軽め'?.05:0)+(isMine?(h.bond-30)*.003:0);
    if(p<.25+dr)h.cond++;else if(p>.78+dr)h.cond--;h.cond=clamp(h.cond,1,5);}
  if(h.rest>0){h.rest--;if(h.rest===0&&(h.status==='放牧'||h.status==='休養')){h.status='現役';if(isMine)S.rep.lines.push(`${h.name}が厩舎に戻ってきた`);}}
  h.curInt=null;
}
/* called after races. finishes the month and starts the next */
function endMonth(){
  const rep=S.rep;
  // training / rest orders
  for(const h of racing()){
    const o=S.month.orders[h.id];
    if(h.status!=='現役')continue;
    if(!o||o.type==='train'){const int=o?o.int:'普通';h.curInt=int;h.lastInt=int;h.work.unshift(workout(h,int));h.work.length=Math.min(h.work.length,6);
      if(int==='強め'){const inj=injuryRoll(h,.35);if(inj){rep.inj.push(`${h.name}：${inj}（調教中）`);pushEv('injury',{hid:h.id,kind:inj});}}}
    else if(o.type==='rest'){h.status='放牧';h.rest=1;}
  }
  // NPC G1s
  GR.filter(g=>g.m===M(S.t)&&g.gr==='G1'&&!S.month.ran.includes(g.n)).forEach(g=>simNpc(gradedRace(g)));
  if(S.sale){S.sale.lots.forEach(l=>{if(!l.res)resolveLot(l);});}
  // money
  const inc=S.part===1&&!S.parent.collapsed?(S.restPenalty>0?150:300):0;
  const cost=monthlyCost();
  S.money+=inc-cost;rep.income+=inc;rep.cost+=cost;
  if(S.restPenalty>0)S.restPenalty--;
  // growth
  const before=Object.fromEntries(mine().map(h=>[h.id,STATS.reduce((a,k)=>a+h.st[k],0)]));
  S.t++;
  [...mine()].forEach(h=>tickHorse(h,true));S.rivals.forEach(h=>tickHorse(h,false));
  for(const h of mine()){const d=STATS.reduce((a,k)=>a+h.st[k],0)-before[h.id];
    if(['現役','放牧'].includes(h.status)&&d>2.4)rep.grow.push(`${h.name}の体つきが、ひと回りたくましくなってきた`);
    if(h.status==='1歳'&&d>3)rep.grow.push(`${h.name}（1歳）が牧場ですくすく育っている`);
    if(h.status==='現役'||h.status==='放牧')h.ev=evalHorse(h);}
  if(S.money<-5000)S.over=true;
  const done=rep;
  startMonthReport();
  beginMonth();
  save();
  return done;
}
/* ---------- part 2 ---------- */
function startPart2(childName,choice){
  S.part=2;S.p2T=S.t;S.child={name:childName};S.parent.collapsed=true;
  const rests=S.br.health.filter(x=>x==='rest').length;
  S.parent.fate=rests>=2?'rest':'dead';
  S.br.inherit=choice;
  for(const [id,p] of Object.entries(S.people)){p.t1=p.trust;if(id==='mikuni')p.trust=Math.max(60,p.trust);else p.trust=Math.round(p.trust*(choice==='mikuni'?.3:.45)+8);}
  S.people.koyanagi.met=true;S.people.koyanagi.trust=Math.round((S.people.togawa.t1||20)*.4+12);
  if(S.br.farm==='support'){S.people.mio.met=true;S.people.mio.trust=Math.round((S.people.nakahara.t1||30)*.5+15);}
  for(const h of mine())if(h.trainer==='togawa')h.trainer='koyanagi';
  if(!S.br.hinataLeft)JK('hinata').sk=Math.max(JK('hinata').sk,86);
  S.fame=S.fame*.6;
  S.money=Math.round(S.money*.45);
  if(choice==='sell'){
    const act=racing().filter(h=>h.status!=='引退').sort((a,b)=>value(b)-value(a));
    act.slice(2).forEach(h=>{S.money+=value(h);h.status='移籍';const o=pick(['アルカディア','北辰']);
      const c={...h,id:S.nid++,owner:o,silks:OWN[o].silks,j:null,cls:Math.max(h.cls,5),fromMine:true,status:'現役',rec:[]};S.rivals.push(c);});
  }
  if(choice==='mikuni')for(const h of racing())h.mode='omakase';
  log(`${S.child.name}が、${S.parent.name}の馬を引き継いだ`);
}
function pushEv(type,data={}){S.inbox.push({id:S.nid++,type,data});}
function fanVoteEvent(){
  const list=[...S.rivals.filter(r=>r.status==='現役'&&ageOf(r)>=3).map(r=>({n:r.name,f:r.fans,me:false})),...racing().filter(h=>ageOf(h)>=3).map(h=>({n:h.name,f:h.fans,me:true}))].sort((a,b)=>b.f-a.f).slice(0,10);
  const ok=racing().filter(h=>ageOf(h)>=3&&(h.fans>=40000||h.earn>=20000||h.g1>0));
  pushEv('fanVote',{list,ok:ok.map(h=>h.name)});
}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
function load(){try{const s=localStorage.getItem(SAVE_KEY);if(s)S=JSON.parse(s);}catch(e){S=null;}}
