/* =========================================================
   電話は「馬と仕事の話」を中心に:
   ・馬・レース・騎手・牧場にかかわる電話（疝痛、出産、放馬、追い切り、騎手の売り込み・依頼の取り合い、ケガ、買い手、夏の放牧先…）は出やすく
   ・付き合いの電話（会食、記者、テレビ、学校、早乙女・大鷹の雑談、出資の申し出）は、それぞれ1年に1回まで
   ・ネタや一度きりの話の電話（間違い電話、怪しい情報屋、占い、三國の夜の電話・結婚式、犬）は、断っても一度きり
   ========================================================= */
(function(){const JOB=['colic','foaling','tv','workout','loose','overseas','bargainHorse','jockeyHurt','jkAsk','trCamp','hinataNight','typhoon'],
  SOCIAL=['bargain','dinner','reporter','school','tvShow','saotomeCall','otakaCall','celeb','invest'],ONCE=['scam','wrong','fortune','mikuniLate','marry','dog'];
  const cnt=k=>((S.flags.callN||{})[k]||0),lastY=k=>(S.flags.callY||{})[k];
  Object.entries(CALLS).forEach(([k,v])=>{const w=v.w;
    if(JOB.includes(k))v.w=()=>{const x=w();return x?x*2.2:0;};
    else if(SOCIAL.includes(k))v.w=()=>{const x=w();return x&&lastY(k)!==Y(S.t)?x*.6:0;};
    else if(ONCE.includes(k))v.w=()=>{const x=w();return x&&!cnt(k)?x*.4:0;};});
  maybeCall=(o=>function(){const r=o.apply(this,arguments);try{if(CALL&&S&&!CALL.counted){CALL.counted=1;S.flags.callN=S.flags.callN||{};S.flags.callY=S.flags.callY||{};S.flags.callN[CALL.type]=cnt(CALL.type)+1;S.flags.callY[CALL.type]=Y(S.t);}}catch(e){}return r;})(maybeCall);})();
