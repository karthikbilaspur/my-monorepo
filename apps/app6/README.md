# Base64 Encoder/Decoder

React + TypeScript app to encode/decode text and images to/from Base64. Built with Vite.

## Features

- Text: Encode/decode UTF-8 text with Unicode support, swap, copy, clear
- Image: Drag & drop upload, convert to Base64 data URL, preview from Base64
- UI: Dark theme, responsive, tabbed interface

## Stack

React 18,
TypeScript,
Vite,
lucide-react

## Run it

npm install
npm run dev     # → http://localhost:3006

npm run build   # production build

## Notes

- All processing is client-side, no uploads
- Handles Unicode text correctly
- Private monorepo package `@my/app6`
