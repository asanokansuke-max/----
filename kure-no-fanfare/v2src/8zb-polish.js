/* =========================================================
   文字が勝手に拡大されないように（iPhone）:
   ・長押しで文字が選択されて拡大鏡が出る → 文字の選択と長押しメニューを止める（入力欄は除く）
   ・入力欄を触ると画面が寄る（16px未満の文字） → 入力欄の文字は16px
   ・ダブルタップの拡大 → どの要素でも止める
   ・横向きにしたとき文字だけ大きくなる → text-size-adjust を固定
   ========================================================= */
(function(){const st=document.createElement('style');st.textContent=`html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
*{touch-action:manipulation}
body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
input,textarea,select{font-size:16px!important;-webkit-user-select:text;user-select:text}`;document.head.appendChild(st);
  let last=0;document.addEventListener('touchend',e=>{const t=e.target;if(t&&t.closest&&t.closest('input,textarea,select'))return;const now=Date.now();if(now-last<320&&e.cancelable&&!(t&&t.closest&&t.closest('button,a,[data-act],label')))e.preventDefault();last=now;},{passive:false});})();
