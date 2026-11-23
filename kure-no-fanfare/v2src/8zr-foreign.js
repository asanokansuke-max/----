/* =========================================================
   外国馬: 国際競走（ジャパンカップ、安田記念、スプリンターズS、高松宮記念、宝塚記念、天皇賞（秋）、マイルCS、
   チャンピオンズC、有馬記念）には、海外から遠征してくる馬が出る（ジャパンカップは2〜4頭、ほかは出ない年もある）。
   海外のレース（ドバイ・凱旋門賞・香港）では、ほとんどが現地や欧米の馬。
   外国馬は、出馬表・結果・掲示板の脇など馬名が出るところで、名前の左に国旗が付く（海外のレースでは日本の馬に日の丸）。
   名前・騎手はどれも架空。
   ========================================================= */
const FLAG={GB:'🇬🇧',IRE:'🇮🇪',FR:'🇫🇷',USA:'🇺🇸',GER:'🇩🇪',AUS:'🇦🇺',HK:'🇭🇰',UAE:'🇦🇪',JPN:'🇯🇵'};
const FOREIGN_NAME={
  GB:[['サー','ロード','キング','レディ','ミスター',''],['ウィンザーパーク','グレンコー','ハイランドソング','ノーフォーク','ブライトンロック','ヨークシャー','ケンブリッジブルー','チェルシーガーデン','オックスフォード','ストーンヘンジ']],
  IRE:[['',''],['ダブリンベイ','キルケニー','ゴールウェイ','シャムロック','リフィー','コネマラ','ケリーグリーン','ミース']],
  FR:[['ル','ラ',''],['プランタン','ソワレ','モンマルトル','ベルエポック','シャンティイ','ドーヴィル','ロワール','ピカルディ','フォンテーヌ','クレール']],
  USA:[['ビッグ','ワイルド','サザン','ゴールデン','ラッキー',''],['サンダー','オーシャン','フロンティア','リバティ','マーベリック','ケンタッキー','テキサスロード','ミシシッピ']],
  GER:[['',''],['シュヴァルツヴァルト','ラインゴルト','アドラー','ナハトムジーク','シュトゥルム','ケーニヒスベルク','ヴァルトシュタイン']],
  AUS:[['',''],['サザンクロス','アウトバック','シドニーハーバー','ゴールドコースト','ブルーマウンテン','カンガルーポー']],
  HK:[['ハッピー','ゴールデン','ラッキー','ビューティー','ドラゴン'],['フォーチュン','スター','ジェイド','パール','ウィナー','ゲイン']],
  UAE:[['',''],['アルワスル','デザートローズ','ファルコンクレスト','オアシスドリーム','サンドストーム','ミラージュ']]};
const FOREIGN_JK={GB:['J.ハリントン','T.ブレナン','S.クロフォード'],IRE:['C.オドネル','P.ギャラガー'],FR:['A.デュラン','L.ボネ','M.ガルニエ'],USA:['J.ロドリゲス','K.ミラー'],GER:['F.シュルツ','D.ヴェーバー'],AUS:['B.ケリー','N.マクグラス'],HK:['Z.ウォン','K.リョン'],UAE:['A.アルマンスーリ','R.ハッサン']};
const INTL={'ジャパンカップ':[2,4,['GB','IRE','FR','GER','USA']],'安田記念':[0,2,['HK','AUS','GB']],'スプリンターズS':[0,2,['HK','AUS']],'高松宮記念':[0,1,['HK','AUS']],'宝塚記念':[0,1,['GB','FR','IRE']],
  '天皇賞（秋）':[0,1,['GB','FR']],'マイルCS':[0,2,['GB','FR','IRE']],'チャンピオンズC':[0,2,['USA','UAE']],'有馬記念':[0,1,['GB','IRE']]};
const ABROAD_CC={UAE:['UAE','GB','IRE','USA','FR'],FRA:['FR','FR','GB','IRE','GER'],HKG:['HK','HK','GB','AUS','IRE']};
function foreignName(cc,un){const L=FOREIGN_NAME[cc]||FOREIGN_NAME.GB;for(let i=0;i<40;i++){const n=pick(L[0])+pick(L[1]);if(!usedName(n)&&!(un&&un.has(n))){if(un)un.add(n);return n;}}return pick(L[1])+'ズ';}
function foreignize(f,cc,usedJ){f.cc=cc;f.name=foreignName(cc,usedJ.names||(usedJ.names=new Set()));const all=Object.values(FOREIGN_JK).flat(),own=(FOREIGN_JK[cc]||[]).filter(j=>!usedJ.has(j)),rest=all.filter(j=>!usedJ.has(j));f.jname=own.length?pick(own):rest.length?pick(rest):pick(all);usedJ.add(f.jname);f.jid=null;}
buildField=(o=>function(race,ents){const fld=o.apply(this,arguments);const uj=new Set();
  try{
    if(race.abroad){const cc=ABROAD_CC[race.abroad]||['GB'];fld.forEach(f=>{if(f.npc)foreignize(f,pick(cc),uj);else f.cc='JPN';});}
    else{const it=INTL[race.name];
      if(it&&race.grade==='G1'){const lo=it[0],hi=it[1],ccs=it[2];let k=lo+Math.floor(R()*(hi-lo+1));const npc=fld.filter(f=>f.npc&&!f.jid);
        for(const f of npc){if(k<=0)break;foreignize(f,pick(ccs),uj);k--;}}
      /* with visitors in the field, the home runners carry the Japanese flag too */
      if(fld.some(f=>f.cc))fld.forEach(f=>{if(!f.cc)f.cc='JPN';});}
    /* no foreign name may sit inside another runner's name (the flag must find the right one) */
    fld.filter(f=>f.cc&&f.npc).forEach(f=>{for(let i=0;i<8&&fld.some(g=>g!==f&&(g.name.includes(f.name)||f.name.includes(g.name)));i++)f.name=foreignName(f.cc,uj.names);});
  }catch(e){console.error('foreign',e);}
  return fld;})(buildField);
const flagOf=f=>f&&f.cc&&FLAG[f.cc]||'';
/* the flag goes in front of the name wherever a race's runner names are shown */
function flagPass(root){try{const RC=UI.race;if(!RC||!RC.field)return;const L=RC.field.filter(f=>f.cc);if(!L.length)return;
  const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode;if(!p||/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(p.nodeName))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
  const nodes=[];while(tw.nextNode())nodes.push(tw.currentNode);
  nodes.forEach(n=>{let v=n.nodeValue,ch=false;L.forEach(f=>{const fl=FLAG[f.cc];if(!fl||!f.name||v.indexOf(f.name)<0)return;v=v.split(f.name).map((seg,i,a)=>i<a.length-1&&!seg.endsWith(fl)?seg+fl:seg).join(f.name);ch=true;});if(ch&&v!==n.nodeValue)n.nodeValue=v;});}catch(e){}}
(function(){let q=false;const run=()=>{q=false;const sh=document.getElementById('sheet');if(sh)flagPass(sh);const ov=document.getElementById('r3d');if(ov)flagPass(ov);};
  new MutationObserver(()=>{if(!q){q=true;requestAnimationFrame(run);}}).observe(document.body,{childList:true,subtree:true});})();
/* the 3D broadcast gets the country too (the name strip shows the flag) */
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{inp.field.forEach(x=>{const f=RC.field.find(y=>y.no===x.no);if(f&&f.cc)x.cc=f.cc;});}catch(e){}return inp;})(r3dInput);
