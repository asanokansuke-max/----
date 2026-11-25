/* =========================================================
   ・月替わりの絵: 返し馬で自分の馬を映したときの一枚（3D）を、その月の絵にする（なければ季節の絵）
   ・出走登録: 重賞では、知り合っていない騎手でも、空いていれば調教師が声をかけられる
   ・季節だけ来日する騎手の初対面は、来日している月に
   ・調教師に任せた馬: 数を使う方針の調教師は、元気な馬に、条件戦でたまに中2週を使う
   ・新しい騎手たちとも、信頼が深まると一つずつ出来事がある
   ========================================================= */
/* ---------- 月替わりの絵 ---------- */
addEventListener('message',e=>{const d=e.data||{};if(d.type!=='race3d-scene'||typeof d.img!=='string'||d.img.length<8000)return;const RC=(typeof R3D!=='undefined'&&R3D&&R3D.RC)||UI.shotRC||UI.race;if(!RC)return;
  const f=(RC.field||[]).find(x=>x.mine&&x.no===d.no);const h=f&&f.h;if(!h)return;picShrink(d.img,560,.76).then(u=>{if(u){h.scenePic=u;h.sceneT=S.t;try{save();}catch(x){}}});});
const latestScene=()=>S.horses.filter(h=>h.owner==='me'&&h.scenePic).sort((a,b)=>(b.sceneT||0)-(a.sceneT||0))[0]||null;
drawSeason=(o=>function(cv,m){const r=o.apply(this,arguments);try{const h=latestScene();if(h)picLoad(h.scenePic).then(im=>{if(!im||!cv.isConnected)return;const c=cv.getContext('2d'),dpr=window.devicePixelRatio||1,W=cv.width/dpr,H=cv.height/dpr;c.save();c.setTransform(dpr,0,0,dpr,0,0);
  picCover(c,im,0,0,W,H,.5);const tint=m<=2||m===12?'rgba(200,215,235,.26)':m<=5?'rgba(255,220,230,.16)':m<=8?'rgba(255,240,190,.14)':'rgba(240,180,110,.2)';c.fillStyle=tint;c.fillRect(0,0,W,H);
  if(m<=2||m===12){c.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<46;i++){c.beginPath();c.arc(hash('s'+i)*W,hash('t'+i)*H,1+hash('u'+i)*1.6,0,7);c.fill();}}
  if(m>=3&&m<=4){c.fillStyle='rgba(255,200,215,.85)';for(let i=0;i<34;i++){c.beginPath();c.ellipse(hash('p'+i)*W,hash('q'+i)*H,2.2,1.4,hash('r'+i)*3,0,7);c.fill();}}
  const g=c.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.32)');c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();});}catch(e){}return r;})(drawSeason);
/* ---------- 出走登録で、空いている騎手 ---------- */
drawReg=(o=>function(){const r=o.apply(this,arguments);try{const rg=UI.reg,h=rg&&HZ(rg.hid),race=h&&racesFor(h).find(x=>x.key===rg.key);const jl=document.querySelector('#sheet .jlist');
  if(h&&race&&jl){const known=new Set(jockeysAvail());const L=Object.keys(S.jockeys).filter(j=>!known.has(j)&&JK(j)&&!(JK(j).ban>S.t)&&!JK(j).retired&&!(typeof jockeyAway==='function'&&jockeyAway(j))&&!(j==='washio'&&S.part===2)&&!(j==='hinata'&&S.br&&S.br.hinataLeft)&&!jBookedElsewhere(j,h,race)).sort((a,b)=>JK(b).sk-JK(a).sk).slice(0,5);
    if(L.length){const rows=L.map(jid=>{const key=h.id+'-'+jid+'-'+race.key,res=S.month.asked&&S.month.asked[key];
      return `<div class="jrow ${rg.j===jid?'on':''}">${avatar(jid,30)}<div class="jinfo"><b>${esc(JNAME(jid))}</b><span class="jmeta">${jTier(jid)}・${esc(JK(jid).tag||'')}　<span class="chip" style="font-size:10px">面識なし・調教師から声をかける</span></span></div>
        <div class="jact">${rg.j===jid?'<span class="chip good">騎乗決定</span>':res?'<span class="chip bad">断られた</span>':`<button class="btn sm" data-act="askJ" data-jid="${jid}">依頼する</button>`}</div></div>`;}).join('');
      jl.insertAdjacentHTML('beforeend',`<div class="muted" style="font-size:12px;margin:8px 2px 2px">ほかに、この日空いている騎手</div>${rows}`);}}}catch(e){console.error('reg free',e);}return r;})(drawReg);
/* ---------- 季節だけ来日する騎手の初対面は、来日している月に ---------- */
pushEv=(o=>function(type,data){try{if(type==='jIntro'&&data&&JK(data.id)&&JK(data.id).season&&!JK(data.id).season.includes(M(S.t))){S.flags.jSeasonWait=S.flags.jSeasonWait||[];if(!S.flags.jSeasonWait.includes(data.id))S.flags.jSeasonWait.push(data.id);return;}}catch(e){}return o.apply(this,arguments);})(pushEv);
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);try{const W=S.flags.jSeasonWait||[];const k=W.findIndex(id=>JK(id)&&JK(id).season&&JK(id).season.includes(M(S.t))&&!(P(id)&&P(id).met));
  if(k>=0&&!S.inbox.some(e=>e.type==='jIntro')){const id=W.splice(k,1)[0];pushEv('jIntro',{id});}}catch(e){}return r;})(storyTriggers);
/* ---------- 任せた馬の中2週 ---------- */
planOmakase=(o=>function(only){const r=o.apply(this,arguments);try{for(const h of (only||racing()).filter(h=>h.mode==='omakase'&&h.status==='現役'&&h.trainer)){const tr=TR(h.trainer),od=S.month.orders[h.id];
    if(!tr||tr.policy!=='many'||!od||od.type!=='race'||!od.race||od.race.g||(h.fat||0)>15||(h.cond||3)<3||R()>.12)continue;if(S.month.orders2&&S.month.orders2[h.id])continue;
    const tru=P(h.trainer).trust;const c=r2Races(h).filter(x=>!x.g&&!entryStatus(h,x).ex).map(x=>({x,s:ability(h,x.dist,x.surf)-x.mean+randn()*Math.max(.5,(100-tru)*.05)})).sort((a,b)=>b.s-a.s)[0];
    if(!c||c.s<1)continue;let j='stable';for(const jid of [od.j,h.mainJ,'stable'].filter(Boolean)){if(jid==='stable'||askJockey(jid,h,c.x)[0]){j=jid;break;}}
    S.month.orders2=S.month.orders2||{};S.month.orders2[h.id]={race:c.x,j,tac:'おまかせ',by:'trainer'};}}catch(e){console.error('omk r2',e);}return r;})(planOmakase);
orderBox=(o=>function(h,omk){let s=o.apply(this,arguments);try{const o2=omk&&S.month&&(S.month.orders2||{})[h.id];if(o2)s+=`<div class="r2line"><span class="chip warn">2戦目</span> ${esc(o2.race.name)}<small class="muted">（中2週・調教師の判断）</small></div>`;}catch(e){}return s;})(orderBox);
/* ---------- 新しい騎手たちとの出来事 ---------- */
const JX_EV={
  tsuji:{t:'辻からの相談',b:'辻から連絡があった。\n\n「ちょっと見てほしいものがあって。…先月のレース、全部のラップを表にしたんです。オーナーの馬、3コーナーで一瞬だけ緩むクセがあります」\n\n分厚いノートには、細かい数字がびっしり並んでいた。',
    ch:[['「その研究、うちの馬に生かしてくれ」','「はい。次は、あそこで緩めません」',8,'sk'],['「よく見てるな」','「…乗れない日は、こういうことしかできないので」辻は少し照れた。',5]]},
  mizusawa:{t:'水沢の初勝利',b:'水沢から、弾んだ声で電話がかかってきた。\n\n「オーナー！ わたし、重賞じゃないですけど、今日ので20勝目です！ あと少しで減量がなくなっちゃうんですけど…それでも乗せてもらえますか？」',
    ch:[['「腕で乗せてるんだ。関係ない」','「…！ はい！ もっとうまくなります！」',9,'sk'],['「おめでとう」','「ありがとうございます！ 次はオーナーの馬で勝ちます！」',5]]},
  ishigami:{t:'石神の頼み',b:'石神が、珍しく自分から声をかけてきた。\n\n「…菊花賞を、三回二着で負けている。もう一度、三千メートルの馬に乗りたい」\n\n「あんたのところに、長いところが合う馬がいたら…最後に、もう一度だけ」',
    ch:[['「長距離の馬が出たら、真っ先に頼む」','石神は何も言わず、深く頭を下げた。',9,'sk'],['「考えておく」','「…ああ」',3]]},
  hayami:{t:'速水とスニーカー',b:'速水が、紙袋を持ってやってきた。\n\n「オーナー、これ限定のやつっす。オーナーの勝負服の色に似てたんで、つい二足買っちゃって。…一足どうっすか」',
    ch:[['ありがたく受け取る','「やった！ おそろいっすね！」速水は満面の笑みだった。',8],['「大事にしまっておくよ」','「履いてくださいよ〜」',5]]},
  hamilton:{t:'ハミルトンの紅茶',b:'冬の中山。ハミルトンが、水筒から紅茶を注いでくれた。\n\n「イギリスの朝は、いつもこれです。…あなたの馬を見ていると、ニューマーケットの朝を思い出す。来年の冬も、ここに来ていいですか？」',
    ch:[['「毎年、待っている」','「Thank you. 約束します」',9],['「もちろん」','ハミルトンはカップを掲げて、笑った。',5]]},
  laval:{m:1,t:'ラヴァルの日本語',b:'ラヴァルから、手書きの年賀状が届いた。少し震えた、でもていねいなひらがなで書いてある。\n\n「ことしも、よろしく おねがいします。あなたの うまに のれて、ぼくは しあわせです。」',
    ch:[['返事を書く','数日後、ラヴァルから写真が届いた。返事の葉書を、検量室のロッカーに貼ってあった。',9],['大事にとっておく','年賀状は、手帳にはさんだ。',5]]}};
EV.jxBond={r:d=>{const x=JX_EV[d.id];if(!x||!P(d.id))return null;return{p:d.id,from:who(d.id),title:x.t,body:x.b,ch:x.ch.map(c=>c[0])};},
  f:(d,i)=>{const x=JX_EV[d.id];if(!x)return '';const c=x.ch[i];trust(d.id,c[2]);if(c[3]==='sk'){const j=JK(d.id);if(j)j.sk=Math.min((j.cap||95),j.sk+1);}return c[1];}};
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);try{if(first)return r;S.flags.jxb=S.flags.jxb||{};const id=Object.keys(JX_EV).find(id=>!S.flags.jxb[id]&&P(id)&&P(id).met&&P(id).trust>=50&&(!JK(id).season||JK(id).season.includes(M(S.t)))&&(!JX_EV[id].m||JX_EV[id].m===M(S.t)));
  if(id&&!S.inbox.some(e=>e.type==='jxBond')){S.flags.jxb[id]=1;pushEv('jxBond',{id});}}catch(e){}return r;})(storyTriggers);
