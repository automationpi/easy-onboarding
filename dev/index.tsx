import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { easyOnboardPlugin, EasyOnboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(easyOnboardPlugin)
  .addPage({
    element: <EasyOnboardPage />,
    title: 'Root Page',
    path: '/easy-onboard',
  })
  .render();
