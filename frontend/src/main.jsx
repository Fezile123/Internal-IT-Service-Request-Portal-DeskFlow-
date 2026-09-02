import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { NotificationToastContainer } from './hooks/useNotificationToast.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

// Inner wrapper so NotificationProvider can access user from AuthContext
function AppWithNotifications() {
  const { user } = React.useContext(AuthContext);
  return (
    <NotificationProvider user={user}>
      <App />
      <NotificationToastContainer />
    </NotificationProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppWithNotifications />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#14171f',
                color: '#f3f4f6',
                border: '1px solid #252a35',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);