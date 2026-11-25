/* =========================================================
   セーブデータを保存容量に収める: 写真（3D）がたまりすぎないように
   ・返し馬の写真（月替わりの絵）は、新しい2枚だけ残す。走るのをやめた馬（引退・売却・移籍・繁殖・功労馬など）のレースの写真（引退記念カードに使う）は、
     重賞を勝った馬と最近の12頭だけ残す
   ・アルバムの口取り写真は、新しい24枚まで写真を残す（それより前は絵で表示）
   ・それでも保存できなかったら、もっと減らしてもう一度。だめなら画面で知らせる
   ========================================================= */
const ACTIVE_ST=['現役','放牧','休養','育成','1歳','当歳','地方'];
function savePrune(hard){try{const gone=S.horses.filter(h=>h.owner==='me'&&!ACTIVE_ST.includes(h.status));
    gone.forEach(h=>{if(h.scenePic)delete h.scenePic;});
    const keep=new Set(gone.filter(h=>h.pic).sort((a,b)=>(b.picT||0)-(a.picT||0)).filter((h,i)=>(h.gw&&h.gw.length&&!hard)||i<(hard?4:12)).map(h=>h.id));
    gone.forEach(h=>{if(h.pic&&!keep.has(h.id))delete h.pic;});
    /* other people's horses never need a photo */
    S.horses.forEach(h=>{if(h.owner!=='me'){if(h.pic)delete h.pic;if(h.scenePic)delete h.scenePic;}});
    const A=S.album||[],lim=hard?10:24;let n=0;for(let i=A.length-1;i>=0;i--){if(A[i]&&A[i].img){n++;if(n>lim)delete A[i].img;}}
    /* the warm-up photo is only for the month's picture: the newest two are enough */
    S.horses.filter(h=>h.scenePic).sort((a,b)=>(b.sceneT||0)-(a.sceneT||0)).forEach((h,i)=>{if(i>=(hard?1:2))delete h.scenePic;});}catch(e){}}
save=function(){if(!S)return;savePrune(false);let data;try{data=JSON.stringify(S);localStorage.setItem(SAVE_KEY,data);S.__saveFail=0;return;}catch(e){}
  savePrune(true);try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));S.__saveFail=0;return;}catch(e){}
  try{S.horses.forEach(h=>{delete h.scenePic;if(h.status!=='現役')delete h.pic;});(S.album||[]).forEach(a=>{delete a.img;});localStorage.setItem(SAVE_KEY,JSON.stringify(S));S.__saveFail=0;return;}catch(e){}
  /* last resort: the progress matters more than the pictures */
  try{S.horses.forEach(h=>{delete h.pic;delete h.scenePic;});localStorage.setItem(SAVE_KEY,JSON.stringify(S));S.__saveFail=0;return;}catch(e){}
  if(!S.__saveFail){S.__saveFail=1;try{toastLong('保存できませんでした（端末の保存容量がいっぱいです）。このまま続けると、次に開いたときに進行が戻ってしまうかもしれません',6000);}catch(x){}}};
