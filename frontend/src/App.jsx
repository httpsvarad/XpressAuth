import React, { useEffect } from 'react';
import FloatingShape from './components/FloatingShape';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailVerification from './pages/EmailVerification';
import useauthStore from '../store/auth.store';
import WelcomePage from './pages/WelcomePage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useauthStore();


  if (!isAuthenticated) {
    return <Navigate to='/signin' replace />;
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useauthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, user, isCheckingAuth, checkAuth } = useauthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  // console.log(isAuthenticated);
  // console.log(user)



  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
      <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
      <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />



      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <WelcomePage user={user} />
          </ProtectedRoute>
        } />
        <Route path='/signup' element={
          <RedirectAuthenticatedUser>
            <SignUpPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/signin' element={
          <RedirectAuthenticatedUser>
            <SignInPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/verify-email' element={<RedirectAuthenticatedUser><EmailVerification /></RedirectAuthenticatedUser>} />

        <Route path='/forgot-password' element={

          <RedirectAuthenticatedUser>
            <ForgotPassword />
          </RedirectAuthenticatedUser>
        } />

        <Route
          path='/reset-password/:token'
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        {/* catch all routes */}
        <Route path='*' element={<Navigate to='/' replace />} />


      </Routes>

      <ToastContainer />
    </div>
  );
};

export default App;
