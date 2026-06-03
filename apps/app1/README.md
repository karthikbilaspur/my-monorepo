# My Monorepo

Turbo + pnpm monorepo with 25 apps. Built for speed and shared configs.

## Stack

| Tool | Purpose |
| --- | --- |
| pnpm | Fast, disk-efficient package manager with workspaces |
| Turborepo | Monorepo build system, caching, parallel tasks |
| TypeScript | Shared types across all apps/packages |
| Vite | Default build tool for React apps |
| ESLint | Shared linting rules |

## Structure

my-monorepo/
├── apps/
│ ├── app1/ # Password Generator
│ ├── app2/ # TBD
│ └──... # app3-app25
├── packages/
│ ├── config/ # Shared configs: tsconfig, eslint, vite
│ ├── ui/ # Shared React components
│ ├── utils/ # Shared utility functions
│ └── types/ # Shared TypeScript types
├── package.json
├── turbo.json
└── pnpm-workspace.yaml

## Getting Started

1. Install dependencies

```bash
pnpm install
```

2.Run all apps in dev mode

```bash
pnpm dev
```

3.Run only app1

```bash
pnpm --filter @my/app1 dev
```

4.Build everything

```bash
pnpm build
```

Turborepo will cache builds. Second run is instant.

## Apps

### App1: Password Generator

Location: `apps/app1`
Port: `http://localhost:3001`
Stack: React + Vite + TypeScript

Features

- Crypto-safe generation using `crypto.getRandomValues`
- Length 4-64 characters
- Toggle uppercase, lowercase, numbers, symbols
- One-click copy to clipboard
- Password strength meter

Run it

```bash
pnpm --filter @my/app1 dev
```

## Shared Packages

All apps extend these configs so updates happen in 1 place:

`@my/tsconfig` - Base TypeScript config
`@my/eslint-config` - Base ESLint rules
`@my/ui` - Shared React components
`@my/utils` - Shared helpers

To use in any app:

```json

{
  "devDependencies": {
    "@my/tsconfig": "workspace:",
    "@my/eslint-config": "workspace:"
  }
}
```

## Common Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps + packages |
| `pnpm lint` | Lint all apps + packages |
| `pnpm clean` | Delete all build artifacts |
| `pnpm --filter @my/app1 add axios` | Add dep to app1 only |
| `pnpm add lodash -w` | Add dep to root |
| `pnpm create:app` | Scaffold new app - coming soon |

## Adding a New App

1. Create folder: `apps/app2/`
2. Copy `package.json` from app1 and rename
3. Extend shared configs:

```json
{
  "extends": "@my/tsconfig/base.json"
}

```

4.Run `pnpm install` from root

## Deploying

Each app is independent. Example for Vercel:

```bash
cd apps/app1
vercel
```

Turborepo remote caching: `npx turbo login` then `npx turbo link`

## Roadmap

- App1: Password Generator
- [ ] App2: TBD
- [ ] App3-App25: TBD
- [ ] Add `@my/ui` component library
- [ ] Add changesets for versioning
- [ ] Add Playwright for e2e tests[x]

## License

MIT
