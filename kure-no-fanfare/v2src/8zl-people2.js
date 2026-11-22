/* =========================================================
   人との関係を「すんなり」させない:
   (1) 騎手は、知り合ってからでないと依頼できない（厩舎の主戦騎手と、すでに自分の馬の主戦の騎手は別）
   (2) 名のある騎手との出会いは、馬主としての格がついてから（ロッシ・デュボワ・大庭・真田は、格が上がるまで先送り）
   (3) 騎手の得意・不得意が依頼と走りに出る: ダートの職人は芝を嫌がり、逃げの名手は差し馬を、差しの名手は逃げ馬を苦手にする
   (4) 柴原・北見の両調教師にも、それぞれの物語
   ========================================================= */
/* (1) */
jockeysAvail=(o=>function(){const L=o.apply(this,arguments);try{if(!S)return L;const tj=new Set(S.horses.filter(h=>h.owner==='me'&&h.trainer).map(h=>TR(h.trainer)&&TR(h.trainer).jk).filter(Boolean));const mj=new Set(S.horses.filter(h=>h.owner==='me').map(h=>h.mainJ).filter(Boolean));
  return L.filter(id=>id==='stable'||(P(id)&&P(id).met)||tj.has(id)||mj.has(id));}catch(e){return L;}})(jockeysAvail);
/* (2) */
const JGATE={rossi:()=>S.fame>=15,dubois:()=>S.fame>=15,oba:()=>S.fame>=8,sanada:()=>S.fame>=22||S.horses.some(h=>h.owner==='me'&&(h.gw||[]).length>0)};
pushEv=(o=>function(type,data){try{if(type==='jIntro'&&data&&JGATE[data.id]&&!JGATE[data.id]()){S.flags.jDefer=S.flags.jDefer||[];if(!S.flags.jDefer.includes(data.id))S.flags.jDefer.push(data.id);return;}}catch(e){}return o.apply(this,arguments);})(pushEv);
storyTriggers=(o=>function(first){const r=o.apply(this,arguments);try{const L=S.flags.jDefer||[];const k=L.findIndex(id=>JGATE[id]()&&!(P(id)&&P(id).met));if(k>=0&&!S.inbox.some(e=>e.type==='jIntro')){const id=L.splice(k,1)[0];pushEv('jIntro',{id});}}catch(e){}return r;})(storyTriggers);
/* (3) */
function jFit(jid,h,race){const t=(JK(jid)&&JK(jid).tag)||'';let v=0,why='';
  if(/ダート/.test(t)){if(race&&race.surf==='芝'){v-=1.4;why='芝は本職じゃないんで…';}else if(race&&race.surf==='ダ')v+=.8;}
  if(/^逃げ|・逃げ|逃げ$/.test(t)&&!/差し|追込/.test(t)){if(h&&(h.style==='差し'||h.style==='追込')){v-=1;why='後ろから行く馬は、僕の乗り方とは合わないかもしれません';}else if(h&&(h.style==='逃げ'||h.style==='先行'))v+=.6;}
  if(/差し|追込/.test(t)&&!/逃げ/.test(t)){if(h&&h.style==='逃げ'){v-=1;why='ハナを切る馬は、自分の持ち味が出しにくくて…';}else if(h&&(h.style==='差し'||h.style==='追込'))v+=.6;}
  if(/重馬場/.test(t)&&race&&race.going&&race.going!=='良')v+=.8;
  if(/気難しい/.test(t)&&h&&h.temper==='気難しい')v+=.8;
  if(/夏のローカル/.test(t)&&race&&['札幌','函館','福島','新潟','小倉'].includes(race.course))v+=.6;
  return {v,why};}
askJockey=(o=>function(jid,h,race){const res=o.apply(this,arguments);try{if(!res[0]||jid==='stable'||h.mainJ===jid)return res;const tr=TR(h.trainer);if(tr&&tr.jk===jid)return res;
  const f=jFit(jid,h,race);if(f.v<0&&R()<(f.v<=-1.3?.75:.55))return [false,`「${f.why}」──${JNAME(jid)}騎手は乗り気ではなかった。（得意でない条件）`];}catch(e){}return res;})(askJockey);
mkRunner=(o=>function(x,race){const r=o.apply(this,arguments);try{if(x&&x.jid&&x.jid!=='stable'){const f=jFit(x.jid,x.h||{style:r.style},race);r.exp+=f.v;}}catch(e){}return r;})(mkRunner);
/* (4) the two later trainers' stories */
Object.assign(ARCS,{
 shibahara:{parts:[1,2],ch:[
  {need:30,title:'砂の千二',body:()=>`柴原の厩舎は、ダートの短いところを使う馬ばかりだ。調教師仲間からは「芝の夢を見ない男」と陰口を叩かれている。\n\n酒の席で、柴原がぽつりと言った。\n「若い頃、預かった馬を芝の長いところで壊した。…それから、芝の大舞台は狙わんことにしとる」`,
   ch:[['「砂の千二も、同じ一勝です」',()=>{trust('shibahara',7);return '柴原は少しだけ笑って、グラスを空けた。\n「…あんた、変わった馬主だな」';}],
       ['「いつか、芝でも見てみたい」',()=>{trust('shibahara',2);S.flags.shibaTurf=1;return '「…考えとく」\n柴原はそれ以上何も言わなかった。';}],
       ['黙って聞く',()=>{trust('shibahara',4);return '柴原は、その馬の名前だけを口にして、あとは何も話さなかった。';}]]},
  {need:45,title:'冬の大一番',body:()=>`「チャンピオンズカップを、一度でいい。獲ってみたいんだ」\n\n柴原が初めて、自分の夢を口にした。ダートの頂点。厩舎を開いて二十年、一度も手が届いていない。`,
   ch:[['「一緒に獲りましょう」',()=>{trust('shibahara',9);S.flags.shibaDream=1;return '柴原は黙ってうなずいた。\n翌週から、厩舎の朝が一時間早くなったと、厩務員がこぼしていた。';}],
       ['「まずは重賞からですね」',()=>{trust('shibahara',4);return '「…そうだな。地道にいく」';}]]},
  {need:60,title:'馬房が減る',body:()=>`「来年から、うちの馬房を二つ減らされることになった」\n\n成績の振るわない厩舎は、預かれる馬の数を減らされる。柴原は淡々と言ったが、厩務員を一人、手放さなければならないらしい。`,
   ch:[['「次の1歳は、柴原さんに預けます」',()=>{trust('shibahara',11);S.flags.shibaPromise=1;return '柴原は深く頭を下げた。\n「…恩に着る。必ず、走らせる」';}],
       ['「厩務員さんの次の職場、探してみます」',()=>{trust('shibahara',7);S.fame+=.5;return '知り合いの牧場が、その厩務員を引き受けてくれた。\n後日、柴原から短い礼状が届いた。';}],
       ['「つらいですね」',()=>{trust('shibahara',2);return '「勝負の世界だ。しかたない」';}]]}]},
 kitami:{parts:[1,2],ch:[
  {need:30,title:'名門の娘',body:()=>`北見の父は、栗東で一時代を築いた名伯楽だった。厩舎を継いで十年、北見はリーディング上位の常連になった。\n\nそれでも新聞には「父の遺産」と書かれる。\n「…勝っても、父の馬だと言われるんです」`,
   ch:[['「あなたの馬で、あなたの勝ち方です」',()=>{trust('kitami',8);return '北見は一瞬だけ目を伏せた。\n「…そう言ってくれる人は、少ないんです」';}],
       ['「お父さんを超えたいんですね」',()=>{trust('kitami',4);return '「超えたいんじゃないんです。…並びたいだけ」';}],
       ['「気にすることはない」',()=>{trust('kitami',1);return '「…ええ」北見は話題を変えた。';}]]},
  {need:45,title:'二人の調教師',body:()=>`調教師会の会合で、北見と早瀬が言い合いになったらしい。\n\n「数を使うのは、馬を消耗させるだけ」と北見。「使わなきゃ、馬は強くならない」と早瀬。\n\n後日、二人ともあなたに意見を求めてきた。`,
   ch:[['北見の考えに賛成する',()=>{trust('kitami',8);trust('hayase',-4);return '北見は静かにうなずいた。早瀬からは「…そうですか」と短い返事だけが来た。';}],
       ['早瀬の考えに賛成する',()=>{trust('hayase',7);trust('kitami',-4);return '早瀬は大喜びだった。北見からは、しばらく連絡がなかった。';}],
       ['「どちらも正しい。馬によります」',()=>{trust('kitami',3);trust('hayase',3);return '二人とも、少し不満そうで、少し納得した顔をした。\n翌月、二人が同じ席で飲んでいたと、三國が教えてくれた。';}]]},
  {need:60,title:'父の命日',body:()=>`北見の厩舎を訪ねると、事務所の壁に古い写真が掛かっていた。若い頃の北見と、大きな芦毛の馬と、笑っている父親。\n\n「今日は、父の命日なんです。…あの馬で、父はダービーを獲りました」\n北見が、初めて弱音を吐いた。「私には、あんな馬はまだ来ていない」`,
   ch:[['「来ますよ。うちの馬かもしれない」',()=>{trust('kitami',10);S.flags.kitamiPromise=1;return '北見は笑った。初めて見る、気の抜けた笑顔だった。\n「…楽しみにしています」';}],
       ['写真を一緒に眺める',()=>{trust('kitami',7);return '二人でしばらく、黙って写真を眺めた。\n帰り際、北見が「ありがとうございました」と頭を下げた。';}]]}]}});
