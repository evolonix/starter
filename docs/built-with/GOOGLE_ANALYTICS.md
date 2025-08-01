## [Google Analytics](https://analytics.google.com/)

```bash
npm install react-ga4
```

Create [apps/web/.env.example](../../apps/web/.env.example) with the following:

```env
VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID='G-XXXXXXXXXX'
```

If desired, copy `.env.example` to `.env.local` and replace `G-XXXXXXXXXX` with your Google Analytics Measurement ID.

```bash
cp apps/web/.env.example apps/web/.env.local
```

Update [apps/web/app/root.tsx](../../apps/web/app/root.tsx) with the following:

```jsx
import ReactGA from 'react-ga4';
...
export default function App() {
  const measurementId = import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID;
  if (measurementId) ReactGA.initialize(measurementId);
  ...
}
```

Update `VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID` environment secrets for each environment in GitHub with the measurement ID associated with each environment.
