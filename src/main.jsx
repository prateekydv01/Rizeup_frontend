import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from "./store/store.js";
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AuthLayout from './component/Auth/AuthLayout.jsx';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import Planner from './pages/PlannerPage.jsx';
import CirclePage from './pages/CirclePage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <SignUpPage />
          </AuthLayout>
        ),
      },
      {
        path: '/planner',
        element: (
          <AuthLayout authentication={true}>
            <Planner />
          </AuthLayout>
        ),
      },
      {
        path: '/circles',
        element: (
          <AuthLayout authentication={true}>
            <CirclePage />
          </AuthLayout>
        ),
      },
      {
        path: '/analytics',
        element: (
          <AuthLayout authentication={true}>
            <AnalyticsPage />
          </AuthLayout>
        ),
      },
      {
        path: '/notifications',
        element: (
          <AuthLayout authentication={true}>
            <NotificationPage />
          </AuthLayout>
        ),
      },
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
