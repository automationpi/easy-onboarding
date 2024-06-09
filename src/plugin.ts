import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { EasyOnboardingPage } from './components/EasyOnboarding/EasyOnboarding';

export const easyOnboardPlugin = createPlugin({
  id: 'easy-onboard',
  routes: {
    root: rootRouteRef,
  },
});

export const EasyOnboardPage = easyOnboardPlugin.provide(
  createRoutableExtension({
    name: 'EasyOnboardPage',
    component: () => Promise.resolve(EasyOnboardingPage),
    mountPoint: rootRouteRef,
  }),
);
