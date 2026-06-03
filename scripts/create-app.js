const fs = require('fs');
const execSync = require('child_process').execSync;

for (let i = 1; i <= 25; i++) {
  const name = `app${i}`;
  const dir = `apps/${name}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(`${dir}/package.json`, JSON.stringify({
      "name": `@my/${name}`,
      "version": "0.0.0",
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "lint": "eslint src"
      },
      "dependencies": {
        "@my/ui": "workspace:*",
        "@my/utils": "workspace:*"
      },
      "devDependencies": {
        "@my/eslint-config": "workspace:*",
        "@my/tsconfig": "workspace:*"
      }
    }, null, 2));

    fs.writeFileSync(`${dir}/tsconfig.json`, JSON.stringify({
      "extends": "@my/tsconfig/nextjs.json"
    }, null, 2));

    fs.writeFileSync(`${dir}/.eslintrc.js`, `module.exports = { extends: ["@my/eslint-config"] }`);
  }
}