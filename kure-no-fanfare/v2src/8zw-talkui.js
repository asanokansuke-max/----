/* =========================================================
   会話の選択肢: 白い四角のボタンを並べるのをやめる。
   ・話題は、相手の色を薄く敷いたカード（左に相手の色の帯、右に「›」）
   ・世間話は、相手の色の濃いボタン
   ・こちらの返事は、右寄せの吹き出し（自分のせりふとして）
   ・手土産は、品物のタグ
   ========================================================= */
drawTalk=(o=>function(){const r=o.apply(this,arguments);try{const sh=document.getElementById('sheet'),t=UI.talk,p=t&&P(t.id);if(sh&&p){sh.classList.add('talkui');sh.style.setProperty('--pc',p.col||'#4a7c59');
    sh.querySelectorAll('.choices [data-act="reply"]').forEach(b=>{if(!b.querySelector('.who'))b.insertAdjacentHTML('afterbegin','<span class="who">あなた</span>');});}}catch(e){}return r;})(drawTalk);
closeModal=(o=>function(){try{const sh=document.getElementById('sheet');if(sh)sh.classList.remove('talkui');}catch(e){}return o.apply(this,arguments);})(closeModal);
openModal=(o=>function(){try{const sh=document.getElementById('sheet');if(sh)sh.classList.remove('talkui');}catch(e){}return o.apply(this,arguments);})(openModal);
(function(){const st=document.createElement('style');st.textContent=`
#sheet.talkui .choices{display:grid;gap:8px}
#sheet.talkui .choices .btn{position:relative;border:1px solid color-mix(in srgb,var(--pc) 26%,transparent);background:color-mix(in srgb,var(--pc) 8%,#fffdf8);border-left:4px solid var(--pc);border-radius:12px;padding:12px 34px 12px 14px;font-weight:600;color:#23302a;box-shadow:0 1px 0 rgba(0,0,0,.04)}
#sheet.talkui .choices .btn::after{content:'›';position:absolute;right:14px;top:50%;transform:translateY(-52%);font-size:20px;line-height:1;color:color-mix(in srgb,var(--pc) 70%,#333)}
#sheet.talkui .choices .btn:active{transform:scale(.985);background:color-mix(in srgb,var(--pc) 16%,#fffdf8)}
#sheet.talkui .choices .btn.pri{background:var(--pc);border-color:var(--pc);color:#fff}
#sheet.talkui .choices .btn.pri::after{color:rgba(255,255,255,.85)}
#sheet.talkui .choices .btn:disabled{opacity:.45}
/* the reply: your own line, as a speech bubble on the right */
#sheet.talkui .choices [data-act="reply"]{display:block;justify-self:end;max-width:88%;border:0;border-left:0;background:#2f8f5b;color:#fff;border-radius:18px 18px 4px 18px;padding:9px 16px 10px;font-weight:500;text-align:left;box-shadow:0 2px 6px rgba(0,0,0,.12)}
#sheet.talkui .choices [data-act="reply"]::after{content:none}
#sheet.talkui .choices [data-act="reply"] .who{display:block;font-size:10px;opacity:.75;letter-spacing:.08em;margin-bottom:1px}
#sheet.talkui .choices [data-act="reply"]:active{background:#25764a}
/* what you already said, in the log: the same bubble, a little quieter */
#sheet.talkui .talklog .line.me{justify-self:end;max-width:84%;background:color-mix(in srgb,#2f8f5b 82%,#fff);color:#fff;border-radius:16px 16px 4px 16px;padding:7px 13px;font-size:13px;text-align:left}
#sheet.talkui .talklog .line.me::before{content:none!important;display:none}
/* gifts: tags */
#sheet.talkui .touchbtns{display:grid!important;grid-template-columns:repeat(3,1fr);gap:8px}
#sheet.talkui .touchbtns .btn{border:1px solid color-mix(in srgb,var(--pc) 30%,transparent)!important;background:color-mix(in srgb,var(--pc) 10%,#fffdf8)!important;border-radius:999px!important;padding:9px 6px!important;font-weight:600;text-align:center;min-height:0!important;color:#23302a}`;document.head.appendChild(st);})();
