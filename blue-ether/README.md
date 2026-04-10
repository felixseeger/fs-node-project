# Blue Ether

Design tokens and React primitives. **Dev loop:** Storybook first.

## First edit loop

1. `cd blue-ether && npm install` (or `yarn` if you use [Corepack](https://nodejs.org/api/corepack.html) with Yarn 4)
2. `npm run storybook` — port **6007** (avoids clashing with other Storybooks)
3. Edit **`src/tokens.css`** → global colors, radii, spacing update live.
4. Edit **`src/components/*`** and `*.stories.tsx` → UI + docs update live.
5. `npm run typecheck` before commit.

## Build static Storybook

`npm run build-storybook` → output in `storybook-static/`.
