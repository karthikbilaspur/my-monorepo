# Regex Tester

React + TypeScript app to test and debug regular expressions live. Built with Vite.

Features

 Live testing: Enter regex + flags, see matches highlighted instantly
 Flags: Toggle `g i m s u y` with tooltips
 Presets: Email, URL, Phone US, IPv4, Hex Color, Date YYYYMMDD
 Match details: Shows index + capture groups for each match
 Actions: Copy regex with flags, clear all
 Error handling: Displays regex syntax errors
 UI: Dark theme, highlighted text output

-Stack
React 18,
TypeScript,
Vite,
lucidereact

->Run it

```bash
npm install
npm run dev     # → http://localhost:3009
npm run build   # production build
```

->Notes
 All regex execution is clientside via `new RegExp()`
 Uses `useMemo` for performance on large test strings
 `dangerouslySetInnerHTML` used for match highlighting
 Global flag autoadded for multimatch highlighting
