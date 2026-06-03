# Image Compressor

React + TypeScript app to compress images client-side. Built with Vite + `browser-image-compression`.

 Features

- Upload: Drag & drop or click, PNG/JPG/WEBP up to 10MB
- Settings: Adjust quality 10-100%, max width 480-3840px, output JPEG/WebP/PNG
- Compare: Side-by-side original vs compressed with size stats
- Stats: Shows file size + % saved
- Actions: Recompress, download, clear
- UI: Dark theme, responsive, live progress

 Stack
React 18, TypeScript, Vite, browser-image-compression, lucide-react

 Run it

```bash

npm install
npm run dev      → http://localhost:3010
npm run build    production build
```

 Notes

- All compression runs in browser via Web Workers, no upload
- Uses `browser-image-compression` for quality + resize
- Shows savings % after compression
- Max input 10MB, auto-converts to selected format
