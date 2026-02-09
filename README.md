# Comic Viewer
ブラウザで動作するコミック・漫画ビューア。ZIPファイルをドラッグ&ドロップするだけで読み始められます。
## 技術スタック

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- fflate (ZIP展開)
- Vitest + Testing Library

## セットアップ

```bash
npm install
npm run dev
```

## スクリプト

| コマンド                 | 内容                 |
|----------------------|--------------------|
| `npm run dev`        | 開発サーバー起動           |
| `npm run build`      | 型チェック + プロダクションビルド |
| `npm run preview`    | ビルド結果のプレビュー        |
| `npm test`           | テスト実行              |
| `npm run test:watch` | テスト (ウォッチモード)      |
| `npm run lint`       | ESLint             |
