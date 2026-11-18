# 暮れのファンファーレ

スマホ向けの競馬・馬主シミュレーション（1ファイルのHTMLゲーム）。

- `v2src/` … ソース（`0-head.html` と番号順の JS ファイル）
- `build.sh` … `v2src/` を結合して `index.html` を作る
- `pack.sh` … Cloudflare Pages 用の zip を作る
- `index.html` … ビルド済みのゲーム本体
