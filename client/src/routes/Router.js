import React, { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import RequireAuth from './RequireAuth';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));

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
    element: <RequireAuth roles={["admin", "super_admin"]} />,
    children: [
      {
        element: <FullLayout />,
        children: [
          { index: true, element: <Navigate to="/sample-page" /> },
          { path: 'sample-page', element: <SamplePage /> },
          { path: 'zippycash/leads', element: <WebsiteLeadsPage /> },
          { path: 'zippycash/leads/:id', element: <WebsiteLeadView /> },
          { path: 'zippycash/leads/:id/edit', element: <WebsiteLeadEdit /> },
          { path: 'zippycash/ach', element: <WebsiteAchPage /> },
          { path: 'zippycash/ach/:id', element: <WebsiteAchView /> },
          { path: 'zippycash/ach/:id/edit', element: <WebsiteAchEdit /> },
          { path: '*', element: <Navigate to="/auth/404" /> },
        ],
      },
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
