import { useAuthStore } from './stores/authStore';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToastProvider } from './components/Toast';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <LoginPage />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <DashboardPage />
    </ToastProvider>
  );
}

export default App;

