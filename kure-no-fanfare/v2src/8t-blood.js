/* =========================================================
   生産・血統:
   ・系統 / インブリード / ニックス — the stallions belong to sire lines; mating the same line twice back makes an
     inbreeding (big upside, more variance, a hotter temper), some line pairs are known nicks
   ・繁殖牝馬セール (December) and 庭先取引 (a breeder sells a yearling privately, summer)
   ・種牡馬リーディング — the year's sire table, your own stallions included
   ========================================================= */
const LINES={empire:'ロード系',kujoemp:'ロード系',chariot:'シャリオ系',echo:'シャリオ系',sonic:'ソニック系',hayate:'ソニック系',iron:'クラウン系',midnight:'ミッドナイト系',valencia:'バレンシア系'};
const NICKS=['ロード系|クラウン系','シャリオ系|ソニック系','ロード系|バレンシア系','ミッドナイト系|クラウン系','シャリオ系|ミッドナイト系'];
function stLine(s,depth=0){if(!s||depth>4)return 'ロード系';if(s.line)return s.line;if(LINES[s.id])return LINES[s.id];if(/^h\d+$/.test(s.id||'')){const h=HZ(+s.id.slice(1));if(h&&h.sire)return stLine(ST(h.sire),depth+1);}return 'ロード系';}
function bloodNote(mare,s){const ml=mare.sire?stLine(ST(mare.sire)):null,sl=stLine(s);if(!ml)return null;
  if(mare.sire===s.id)return {k:'close',t:'父と同じ種牡馬で、近すぎる配合だ。やめたほうがいい'};
  if(ml===sl)return {k:'ib',t:`${sl}のインブリード（4×3）になる。当たれば大物、外れればもろい`};
  if(NICKS.includes(ml+'|'+sl)||NICKS.includes(sl+'|'+ml))return {k:'nick',t:`母の父の${ml}と${sl}は、よく走る「ニックス」の組み合わせだ`};return null;}
nick=(o=>function(mare,st){let c=o.apply(this,arguments);try{const b=bloodNote(mare,st);if(b)c+=b.k==='close'?-3:b.k==='ib'?1.5:2;}catch(e){}return c;})(nick);
reasonFor=(o=>function(mare,s){let t=o.apply(this,arguments);try{const b=bloodNote(mare,s);if(b)t+=b.t+'。';t+=`（${stLine(s)}）`;}catch(e){}return t;})(reasonFor);
breed=(o=>function(mare,sid){const r=o.apply(this,arguments);try{const b=bloodNote(mare,ST(sid));if(mare.preg&&b)mare.preg.bk=b.k;}catch(e){}return r;})(breed);
foal=(o=>function(mare){const bk=mare.preg&&mare.preg.bk;const h=o.apply(this,arguments);try{if(h&&bk==='ib'){h.pot=clamp(h.pot+randn()*4.5,40,99);h.ib=1;if(R()<.4)h.temper='気難しい';}if(h&&bk==='nick')h.nickF=1;if(h&&bk==='close'){h.pot=clamp(h.pot-4,40,99);}}catch(e){}return h;})(foal);
/* ---- buying mares and yearlings ---- */
function mkMareOffer(){const sire=pick(STALLIONS0),pot=Math.round(58+R()*26),age=4+Math.floor(R()*7),rec=pot>78?pick(['重賞2着あり','オープン勝ち','3勝']):pot>68?pick(['2勝','3勝']):pick(['未勝利','1勝']);
  return {sid:sire.id,pot,age,rec,price:Math.round((pot-50)*(pot-50)*1.1/10)*10+200,name:makeName(),dist:sire.dist,surf:sire.surf};}
EV.mareSale={r:d=>({p:'mikuni',from:'三國 透',title:'繁殖牝馬セール',body:`年末の繁殖牝馬セールのカタログです。気になる馬を三頭、選んでおきました。\n\n${d.list.map((m,i)=>`${['一','二','三'][i]}、${m.name}（${m.age}歳・父 ${ST(m.sid).n}・${m.rec}）\n　見立て ${m.pot>=78?'◎':m.pot>=68?'○':'△'}　予想価格 ${yen(m.price)}`).join('\n\n')}\n\n牝馬を買って繁殖に上げれば、来年から種付けができます。`,ch:[...d.list.map(m=>`${m.name}を買う（${yen(m.price)}）`),'今年は見送る']}),
  f:(d,i)=>{const m=d.list[i];if(!m)return '今年は見送った。';if(S.money<m.price)return '資金が足りなかった。';S.money-=m.price;if(S.rep)S.rep.cost+=m.price;
    const h=genHorse({by:Y(S.t)-m.age,sire:m.sid,pot:m.pot,dist:m.dist,surf:m.surf,status:'繁殖',owner:'me',coat:null});h.id=S.nid++;h.sex='牝';h.name=m.name;h.silks=S.silks;h.starts=0;S.horses.push(h);log(`繁殖牝馬セールで${m.name}を${yen(m.price)}で購入`);
    return `${m.name}を落札した。中原牧場で繁殖牝馬として迎える。\n\n中原「いい顔をしとる。来年の春、相手を考えよう」`;}};
EV.niwasaki={r:d=>({p:'nakahara',from:'中原 修造',title:'知り合いの牧場から',body:`日高の知り合いの牧場が、1歳馬を一頭、庭先で譲ってもいいと言っとる。セリに出す前の話だ。\n\n${d.sex}・父 ${ST(d.sid).n}・${d.coat}。\nわしの見立ては「${d.pot>=78?'走る':d.pot>=68?'悪くない':'並'}」。値段は${yen(d.price)}。\n\nセリより安いが、見られる時間は短い。どうする。`,ch:[`買う（${yen(d.price)}）`,'見送る']}),
  f:(d,i)=>{if(i!==0)return '「そうか。また何かあったら声をかける」';if(S.money<d.price)return '資金が足りなかった。';S.money-=d.price;if(S.rep)S.rep.cost+=d.price;
    const h=genHorse({by:Y(S.t)-1,sire:d.sid,pot:d.pot,dist:ST(d.sid).dist,surf:ST(d.sid).surf,status:'1歳',owner:'me',coat:d.coat});h.id=S.nid++;h.sex=d.sex==='牡馬'?'牡':'牝';h.name=`${d.coat}の1歳`;h.unnamed=true;h.silks=S.silks;S.horses.push(h);log(`庭先取引で1歳馬を${yen(d.price)}で購入`);
    return '話はまとまった。来年、育成に入る。\n\n中原「いい買い物だったと思うぞ」';}};
beginMonth=(o=>function(first){const r=o.apply(this,arguments);try{if(!S||first)return r;const m=M(S.t),yr=S.t-S.startT;
  if(m===12&&yr>=11&&!S.inbox.some(e=>e.type==='mareSale'))pushEv('mareSale',{list:[mkMareOffer(),mkMareOffer(),mkMareOffer()]});
  if([6,7,8,9].includes(m)&&yr>=6&&R()<.12&&!S.inbox.some(e=>e.type==='niwasaki')){const s=pick(STALLIONS0),pot=Math.round(55+R()*28);pushEv('niwasaki',{sid:s.id,pot,sex:R()<.5?'牡馬':'牝馬',coat:pick(['鹿毛','黒鹿毛','栗毛','芦毛','青鹿毛']),price:Math.round((pot-45)*(pot-45)*.9/10)*10+300});}
  }catch(e){}return r;})(beginMonth);
/* ---- the sire table ---- */
function sireLeading(){const y=Y(S.t);const L=(S.stallions||[]).map(s=>{const kids=S.horses.filter(h=>h.sire===s.id&&h.owner==='me');const own=kids.reduce((a,h)=>a+(h.earn||0),0)/6;
  const base=s.own?Math.max(0,(s.q-62))*(s.q-62)*90*(1+hash(y+s.id)*.4):Math.max(0,(s.q-60))*(s.q-60)*300*(1+hash(y+s.id)*.35);const age=s.bornY?y-s.bornY:9;const ramp=s.own?Math.min(1,Math.max(0,(age-2)/3)):1;
  const earn=Math.round(base*ramp+own),wins=Math.round(earn/1700+hash(y+s.id+"w")*6);return {s,earn,wins,line:stLine(s)};}).sort((a,b)=>b.earn-a.earn);return L;}
vBlood=(o=>function(){let h=o.apply(this,arguments);try{const L=sireLeading().slice(0,12);
  h+=`<section class="sec"><h2>種牡馬リーディング<small>${Y(S.t)}年・産駒の獲得賞金</small></h2><div class="panel"><table class="ldr">${L.map((x,i)=>`<tr class="${x.s.own||x.s.fromSold?'me':''}"><td class="num">${i+1}</td><td><b>${esc(x.s.n)}</b><small>${esc(x.line)}${x.s.own?'・あなたの育てた馬':''}</small></td><td class="r num">${x.wins}勝</td><td class="r num">${yen(x.earn)}</td></tr>`).join('')}</table></div></section>`;}catch(e){}return h;})(vBlood);
(function(){const st=document.createElement('style');st.textContent=`.ldr{width:100%;border-collapse:collapse;font-size:13px}.ldr td{padding:6px 4px;border-bottom:1px solid var(--line)}.ldr td small{display:block;font-size:11px;color:var(--muted)}.ldr tr.me b{color:#b8862b}.ldr .r{text-align:right;white-space:nowrap}`;document.head.appendChild(st);})();
