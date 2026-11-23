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
/* how often visitors come, close to recent years: [chances of 0,1,2,3… foreign runners] and where they come from */
const INTL={'ジャパンカップ':[[.2,.38,.25,.13,.04],['GB','IRE','FR','GER','USA']],'安田記念':[[.5,.32,.18],['HK','HK','AUS','GB']],'スプリンターズS':[[.72,.22,.06],['HK','AUS']],
  '高松宮記念':[[.8,.18,.02],['HK','AUS']],'マイルCS':[[.78,.18,.04],['GB','FR','IRE']],'チャンピオンズC':[[.88,.12],['USA','UAE']],
  '宝塚記念':[[.95,.05],['GB','FR','IRE']],'天皇賞（秋）':[[.96,.04],['GB','FR']],'有馬記念':[[.97,.03],['GB','IRE']]};
const ABROAD_CC={UAE:['UAE','GB','IRE','USA','FR'],FRA:['FR','FR','GB','IRE','GER'],HKG:['HK','HK','GB','AUS','IRE']};
function foreignName(cc,un){const L=FOREIGN_NAME[cc]||FOREIGN_NAME.GB;for(let i=0;i<40;i++){const n=pick(L[0])+pick(L[1]);if(!usedName(n)&&!(un&&un.has(n))){if(un)un.add(n);return n;}}return pick(L[1])+'ズ';}
function foreignize(f,cc,usedJ){f.ctry=cc;f.name=foreignName(cc,usedJ.names||(usedJ.names=new Set()));const all=Object.values(FOREIGN_JK).flat(),own=(FOREIGN_JK[cc]||[]).filter(j=>!usedJ.has(j)),rest=all.filter(j=>!usedJ.has(j));f.jname=own.length?pick(own):rest.length?pick(rest):pick(all);usedJ.add(f.jname);f.jid=null;}
buildField=(o=>function(race,ents){const fld=o.apply(this,arguments);const uj=new Set();
  try{
    if(race.abroad){const cc=ABROAD_CC[race.abroad]||['GB'];fld.forEach(f=>{if(f.npc)foreignize(f,pick(cc),uj);else f.ctry='JPN';});}
    else{const it=INTL[race.name];
      if(it&&race.grade==='G1'){const pr=it[0],ccs=it[1];let x=R(),k=0;for(;k<pr.length-1;k++){x-=pr[k];if(x<0)break;}const npc=fld.filter(f=>f.npc&&!f.jid);
        for(const f of npc){if(k<=0)break;foreignize(f,pick(ccs),uj);k--;}}
      /* with visitors in the field, the home runners carry the Japanese flag too */
      if(fld.some(f=>f.ctry))fld.forEach(f=>{if(!f.ctry)f.ctry='JPN';});}
    /* ○外 (foreign-bred, trained in Japan): a few of the home runners, as on any JRA card */
    {const nb=/新馬|デビュー/.test(race.name||'')||race.grade==='新馬',pm=(race.surf==='ダ'?.03:.015)*(nb?.5:1);let k=0;
     fld.forEach(f=>{if(k<1&&f.npc&&!f.ctry&&R()<pm){f.marugai=1;k++;}});}
    /* no foreign name may sit inside another runner's name (the flag must find the right one) */
    fld.filter(f=>f.ctry&&f.npc).forEach(f=>{for(let i=0;i<8&&fld.some(g=>g!==f&&(g.name.includes(f.name)||f.name.includes(g.name)));i++)f.name=foreignName(f.ctry,uj.names);});
  }catch(e){console.error('foreign',e);}
  return fld;})(buildField);
const flagOf=f=>f&&f.ctry&&FLAG[f.ctry]||'';
/* the flag goes in front of the name wherever a race's runner names are shown */
function flagPass(root){try{const RC=UI.race;if(!RC||!RC.field)return;const L=RC.field.filter(f=>f.ctry);if(!L.length)return;
  const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode;if(!p||/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(p.nodeName))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
  const nodes=[];while(tw.nextNode())nodes.push(tw.currentNode);
  nodes.forEach(n=>{let v=n.nodeValue,ch=false;L.forEach(f=>{const fl=FLAG[f.ctry];if(!fl||!f.name||v.indexOf(f.name)<0)return;v=v.split(f.name).map((seg,i,a)=>i<a.length-1&&!seg.endsWith(fl)?seg+fl:seg).join(f.name);ch=true;});if(ch&&v!==n.nodeValue)n.nodeValue=v;});}catch(e){}}
/* (the flag is shown on the saddle cloths only, not in the lists) */
/* the 3D broadcast gets the country too (the name strip shows the flag) */
r3dInput=(o=>function(RC){const inp=o.apply(this,arguments);try{inp.field.forEach(x=>{const f=RC.field.find(y=>y.no===x.no);if(f&&f.ctry)x.ctry=f.ctry;});}catch(e){}return inp;})(r3dInput);
/* in the lists (出馬表・結果・掲示板の脇など), as on the JRA card: ［外］ for a horse trained abroad (a visitor), ○外 for one bred abroad and trained in Japan (the flags stay on the saddle cloths) */
function gaiPass(root){try{const RC=UI.race;if(!RC||!RC.field)return;const L=RC.field.filter(f=>((f.ctry&&f.ctry!=='JPN')||f.marugai)&&f.name);if(!L.length)return;
  const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode;if(!p||/^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION)$/.test(p.nodeName)||(p.classList&&p.classList.contains('marugai')))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
  const nodes=[];while(tw.nextNode())nodes.push(tw.currentNode);
  const KT=/[\u30A0-\u30FF]/,whole=(v,nm)=>{const i=v.indexOf(nm);return i>=0&&!(i>0&&KT.test(v[i-1]))&&!KT.test(v[i+nm.length]||'')?i:-1;};
  nodes.forEach(n=>{const v=n.nodeValue;const f=L.find(x=>whole(v,x.name)>=0);if(!f)return;const prev=n.previousSibling;if(v.indexOf(f.name)===0&&prev&&prev.classList&&prev.classList.contains('marugai'))return;
    const i=whole(v,f.name),frag=document.createDocumentFragment();if(i>0)frag.appendChild(document.createTextNode(v.slice(0,i)));const m=document.createElement('span');m.className=f.ctry&&f.ctry!=='JPN'?'marugai kaku':'marugai';m.textContent='外';frag.appendChild(m);frag.appendChild(document.createTextNode(v.slice(i)));n.parentNode.replaceChild(frag,n);});}catch(e){}}
(function(){let q=false;const run=()=>{q=false;['sheet','r3d'].forEach(id=>{const el=document.getElementById(id);if(el)gaiPass(el);});};
  new MutationObserver(()=>{if(!q){q=true;requestAnimationFrame(run);}}).observe(document.body,{childList:true,subtree:true});
  const st=document.createElement('style');st.textContent=`.marugai{display:inline-grid;place-items:center;width:1.25em;height:1.25em;margin-right:.18em;border:1.5px solid currentColor;border-radius:50%;font-size:.72em;line-height:1;font-weight:800;vertical-align:.12em;opacity:.9}.marugai{white-space:nowrap;flex:none}.marugai.kaku{display:inline;border-radius:0;width:auto;height:auto;border:0;padding:0;font-size:.8em;vertical-align:.06em;letter-spacing:0}.marugai.kaku::before{content:'［'}.marugai.kaku::after{content:'］'}`;document.head.appendChild(st);})();
