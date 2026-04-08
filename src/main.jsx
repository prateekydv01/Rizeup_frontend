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
import MyHabitsPage from './pages/MyHabitsPage.jsx';
import MyGoalsPage from './pages/MyGoalsPage.jsx';
import CircleRoom from './component/CircleRoom/CircleRoom.jsx';
import AuthSuccess from "./pages/AuthSuccess.jsx";

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
        path: '/circles/:circleId',
        element: (
          <AuthLayout authentication={true}>
            <CircleRoom />
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
      {
        path: '/goals',
        element: (
          <AuthLayout authentication={true}>
            <MyGoalsPage />
          </AuthLayout>
        ),
      },
      {
        path: '/habits',
        element: (
          <AuthLayout authentication={true}>
            <MyHabitsPage />
          </AuthLayout>
        ),
      },
      {
        path: '/auth-success',
        element: (
          <AuthLayout authentication={true}>
            <AuthSuccess />
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