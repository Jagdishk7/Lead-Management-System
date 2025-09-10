import React, { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

const Login = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const WebsiteLeadsPage = Loadable(lazy(() => import('../views/websites/zippycash/leads/page')))
const WebsiteAchPage = Loadable(lazy(() => import('../views/websites/zippycash/ach/page')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

/* ✅ New: View & Edit pages */
const WebsiteLeadView = Loadable(lazy(() => import('../views/websites/zippycash/leads/lead-view/page')));
const WebsiteLeadEdit = Loadable(lazy(() => import('../views/websites/zippycash/leads/lead-edit/page')));
const WebsiteAchView = Loadable(lazy(() => import('../views/websites/zippycash/ach/ach-view/page')));
const WebsiteAchEdit = Loadable(lazy(() => import('../views/websites/zippycash/ach/ach-edit/page')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/sample-page" /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/zippycash/leads', exact: true, element: <WebsiteLeadsPage /> },
      { path: '/zippycash/ach', exact: true, element: <WebsiteAchPage /> },
      /* ✅ View / Edit pages */
      { path: '/zippycash/leads/:id', element: <WebsiteLeadView /> },
      { path: '/zippycash/leads/:id/edit', element: <WebsiteLeadEdit /> },
      { path: '/zippycash/ach/:id', element: <WebsiteAchView /> },
      { path: '/zippycash/ach/:id/edit', element: <WebsiteAchEdit /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];
const router = createBrowserRouter(Router);

export default router;
