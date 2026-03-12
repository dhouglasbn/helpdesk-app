import 'antd/dist/reset.css';
import '@/styles/app.css';
import LandingPage from '@/app/pages/LandingPage';
import SignInPage from '@/app/pages/SignInPage';
import SignUpPage from '@/app/pages/SignUpPage';
import ClientDashboard from '@/app/pages/ClientDashboard';
import TechnicianDashboard from '@/app/pages/TechnicianDashboard';
import AdminDashboard from '@/app/pages/AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/UserContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<LandingPage />} index />
            <Route element={<SignInPage />} path="/signIn" />
            <Route element={<SignUpPage />} path="/signUp" />
            <Route element={<ClientDashboard />} path="/clientDashboard" />
            <Route element={<TechnicianDashboard />} path="/techDashboard" />
            <Route element={<AdminDashboard />} path="/adminDashboard" />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}