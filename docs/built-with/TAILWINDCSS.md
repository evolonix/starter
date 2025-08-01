## [Tailwind CSS 4](https://tailwindcss.com/)

```bash
npm uninstall -D tailwindcss postcss autoprefixer
npm install tailwindcss@latest
cd apps/web
npx @tailwindcss/upgrade -f
rm -rf postcss.config.js tailwind.config.js
cd ../../
npm install -D @tailwindcss/vite
npm install -D prettier@latest prettier-plugin-tailwindcss
```

Update [apps/web/vite.config.ts](../../apps/web/vite.config.ts) with the following:

```typescript
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  ...
  plugins: [
    ...
    tailwindcss(),
  ],
  ...
});
```

Update [apps/web/styles.css](../../apps/web/styles.css) with the following:

```css
@import 'tailwindcss';
```

Update [apps/web/app/root.tsx](../../apps/web/app/root.tsx) with the following:

```jsx
...
import '../styles.css';
...
```

Update [.prettierrc](../../.prettierrc) with the following:

```json
{
  ...
  "plugins": ["prettier-plugin-tailwindcss"]
}
```
