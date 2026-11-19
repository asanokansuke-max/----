/* =========================================================
   頭数: fields of different sizes, as in real racing —
   big G1s fill to 18, small summer tracks and lower grades run smaller fields;
   and the race caller says the words the way people do
   ========================================================= */
function fieldSize(race){const k=race.key||race.name||'',small=['札幌','函館','福島','小倉'].includes(race.course);
  const seed=(hash(k+S.t)*1000)|0,pick=(lo,hi)=>lo+seed%(hi-lo+1);
  if(race.key==='有馬記念')return 16;
  if(/ダービー|東京優駿|オークス|菊花賞|天皇賞|ジャパンC|宝塚|安田|マイルCS|スプリンターズ|ヴィクトリア|NHKマイル|桜花賞|皐月賞|エリザベス|高松宮|秋華賞|朝日杯|阪神JF|ホープフル|チャンピオンズ|フェブラリー/.test(k))return small?16:pick(16,18);
  if(race.grade==='G1')return pick(16,18);
  if(race.grade==='G2'||race.grade==='G3')return Math.min(small?16:18,pick(11,18));
  if(race.grade==='新馬')return Math.min(small?14:18,pick(8,16));
  if(race.grade==='未勝利')return Math.min(small?16:18,pick(12,18));
  if(race.grade==='OP')return pick(8,16);
  return Math.min(small?16:18,pick(9,16));}
buildField=(o=>function(race,ents){if(!race.nSet){race.nSet=1;race.n=Math.max(fieldSize(race),(ents||[]).length+2);}return o.apply(this,arguments);})(buildField);

/* 読み: the device voice misreads racing words and riders' names; give it the reading */
const YOMI=[['鞍上','あんじょう'],['末脚','すえあし'],['好位','こうい'],['縦長','たてなが'],['稍重','ややおも'],['不良馬場','ふりょうばば'],['内から','うちから'],['内を','うちを'],['内で','うちで'],['内に','うちに'],['最内','さいうち'],['大外','おおそと'],['外から','そとから'],['外に','そとに'],['逃げ','にげ'],['行き場','いきば'],['手応え','てごたえ'],['持ったまま','もったまま'],['仕掛け','しかけ'],['馬群','ばぐん'],['先行争い','せんこうあらそい'],['中団','ちゅうだん'],['最後方','さいこうほう'],['番手','ばんて'],['馬身','ばしん'],['頭差','あたまさ'],['ハナ差','はなさ'],['単騎','たんき'],['淀','よど'],['小倉','こくら'],['府中','ふちゅう'],
  ['鷲尾','わしお'],['日向','ひなた'],['城戸','きど'],['真田','さなだ'],['桐生','きりゅう'],['大庭','おおば'],['小森','こもり'],['黒岩','くろいわ'],['新井','あらい'],['丸山','まるやま'],['佐伯','さえき'],['森田','もりた'],['菅原','すがわら'],['岡部','おかべ'],['西村','にしむら'],['荻野','おぎの'],['今井','いまい'],['永瀬','ながせ'],['津田','つだ'],['国分','こくぶ'],['古賀','こが'],['石動','いするぎ'],['白川','しらかわ'],['坂東','ばんどう'],['真壁','まかべ'],['高森','たかもり'],['早川','はやかわ'],['久住','くすみ'],['藤代','ふじしろ'],['柏木','かしわぎ'],['森永','もりなが'],['上原','うえはら'],['吉岡','よしおか'],['浅野','あさの'],['宮下','みやした'],['滝本','たきもと'],['水谷','みずたに'],['黒田','くろだ'],['三國','みくに'],['九条','くじょう'],['中原','なかはら'],['戸川','とがわ'],['早瀬','はやせ'],['柴原','しばはら'],['北見','きたみ'],['小柳','こやなぎ']];
function yomi(t){let s=String(t);YOMI.forEach(([a,b])=>{s=s.split(a).join(b);});return s.replace(/(\d+)番/g,'$1ばん').replace(/(\d+)頭/g,'$1とう');}
speak=(o=>function(t,f){return o.call(this,yomi(t),f);})(speak);
