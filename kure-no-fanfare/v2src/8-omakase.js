/* =========================================================
   omakase: trainers message their monthly plan to the owner's phone
   ========================================================= */
Object.assign(VOICE.togawa,{planHead:'{o}さん。今月の予定だ。',planRace:'・{h}は{r}に使う。乗り役は{j}。',planTrain:'・{h}は調教だけだ。{int}で乗る。',planRest:'・{h}は疲れが出とる。放牧に出す。',planTail:'異論があれば言え。なければこのまま行く。',planOk:'「おう、任せとけ」',planStop:'「…わかった。今月は様子を見る」',planSelf:'「そうか。あんたが決めるなら、それに従う」'});
Object.assign(VOICE.hayase,{planHead:'{o}さん、今月の予定です！',planRace:'・{h}は{r}に使いたいです。騎手は{j}さんにお願いしてます！',planTrain:'・{h}は調教でじっくり。{int}で乗ります。',planRest:'・{h}は少し疲れているので、放牧に出しますね。',planTail:'何かあれば返信ください。なければこのまま進めます！',planOk:'「了解です！ 頑張ります！」',planStop:'「わかりました。今月は見送りますね」',planSelf:'「はい！ じゃあ、ご指示をお待ちしてます」'});
Object.assign(VOICE.koyanagi,{planHead:'{o}さん、今月の予定をお送りします。',planRace:'・{h}は{r}を考えています。騎手は{j}さんです。',planTrain:'・{h}は調教です。{int}で乗ります。',planRest:'・{h}は疲れが見えるので、放牧に出します。',planTail:'ご意見があれば返信ください。なければこの予定で進めます。',planOk:'「ありがとうございます。精一杯やります」',planStop:'「承知しました。今月は見送ります」',planSelf:'「わかりました。ご指示をお待ちします」'});
Object.assign(VOICE.washio_t,{planHead:'今月の予定だ。',planRace:'・{h}は{r}。乗るのは{j}。',planTrain:'・{h}は調教。{int}。',planRest:'・{h}は放牧に出す。',planTail:'文句があれば今のうちに言え。',planOk:'「おう」',planStop:'「…わかった」',planSelf:'「好きにしろ」'});
MAILS.plan={w:()=>0,mk:d=>{
  const tv=TV(d.tr);
  const lines=d.items.map(it=>{const h=HZ(it.hid);if(!h)return '';const n=h.name;
    if(it.type==='race')return V(tv,'planRace',{h:n,r:`${it.rn}（${it.rc}）`,j:it.jn}).replace('うちの若手さん','うちの若手');
    if(it.type==='rest')return V(tv,'planRest',{h:n});
    return V(tv,'planTrain',{h:n,int:it.int==='強め'?'強め':it.int==='軽め'?'軽め':'いつも通り'});}).filter(Boolean);
  return{from:d.tr,subj:`${M(S.t)}月の予定（${d.items.length}頭）`,body:`${V(tv,'planHead')}\n\n${lines.join('\n')}\n\n${V(tv,'planTail')}`,
    r:[['「それで頼む」',()=>{trust(d.tr,1);return V(tv,'planOk');}],
       ...(d.items.some(it=>it.type==='race')?[['「今月のレースは見送ろう」',()=>{d.items.filter(it=>it.type==='race').forEach(it=>{const h=HZ(it.hid);if(h&&h.mode==='omakase'&&S.t===d.t)S.month.orders[h.id]={type:'train',int:'普通',by:'trainer'};});trust(d.tr,-1);render();return V(tv,'planStop')+'\n（今月はレースに出さず、調教だけになった）';}]]:[]),
       ['「自分で決める」',()=>{d.items.forEach(it=>{const h=HZ(it.hid);if(h&&S.t===d.t)h.mode='self';});render();return V(tv,'planSelf')+'\n（厩舎画面で指示を出せるようになった）';}]]};}};
const jShort=j=>!j?'':j==='stable'?'うちの若手':JNAME(j).split(' ')[0];
function planMails(){
  const by={};
  for(const h of racing().filter(h=>h.mode==='omakase'&&h.status==='現役'&&h.trainer)){
    const o=S.month.orders[h.id];if(!o)continue;
    (by[h.trainer]=by[h.trainer]||[]).push({hid:h.id,type:o.type,int:o.int,rn:o.race&&o.race.name,rc:o.race&&`${o.race.course}${o.race.surf}${o.race.dist}m`,jn:jShort(o.j)});
  }
  const ph=PH();ph.pend=ph.pend||[];
  for(const [tr,items] of Object.entries(by))ph.pend.push({type:'plan',d:{tr,items,t:S.t}});
}
beginMonth=(o=>function(){const r=o.apply(this,arguments);if(S&&S.month)planMails();return r;})(beginMonth);
/* switching a horse to omakase mid-month also sends a short plan */
ACT.mode=(o=>function(d){const r=o.apply(this,arguments);const h=HZ(d.hid);if(h&&d.m==='omakase'&&h.trainer){const ord=S.month.orders[h.id];if(ord){sendMail('plan',{tr:h.trainer,t:S.t,items:[{hid:h.id,type:ord.type,int:ord.int,rn:ord.race&&ord.race.name,rc:ord.race&&`${ord.race.course}${ord.race.surf}${ord.race.dist}m`,jn:jShort(ord.j)}]});}}return r;})(ACT.mode);
/* card hint */
orderText=(o=>function(h){const t=o.apply(this,arguments);if(h.mode==='omakase'&&PH().mails.some(m=>m.type==='plan'&&m.t===S.t&&m.d&&m.d.items.some(x=>x.hid===h.id)&&!m.read))return t+'　<span class="chip warn">スマホに連絡あり</span>';return t;})(orderText);
