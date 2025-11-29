import {lazy} from 'react'
import type {Routes} from '@/@types/routes'

const authRoute: Routes = [
  {
    key: 'signIn',
    path: `/sign-in`,
    component: lazy(() => import('@/pages/auth/SignIn')),
    authority: []
  },

  {
  key: 'signup',
  path: '/signup',
  component: lazy(() => import('@/pages/auth/SignUp')),
  authority: []
},

 {
    key: 'forgot-password',
    path: `/forgot-password`,
    component: lazy(() => import('@/pages/auth/ForgotPassword')),
    authority: []
  },

   {
    key: 'phoneLogin',
    path: `/phone-login`,
    component: lazy(() => import('@/pages/auth/PhoneLogin')),
    authority: []
  },
  // {
  //   key: 'signUp',
  //   path: `/sign-up`,
  //   component: lazy(() => import('@/views/auth/SignUp')),
  //   authority: []
  // },
]

export default authRoute
