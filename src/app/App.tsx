import { useState } from 'react';
import 'antd/dist/reset.css';
import '@/styles/app.css';
import LandingPage from '@/app/components/LandingPage';
import SignInPage from '@/app/components/SignInPage';
import SignUpPage from '@/app/components/SignUpPage';
import ClientDashboard from '@/app/components/ClientDashboard';
import TechnicianDashboard from '@/app/components/TechnicianDashboard';
import AdminDashboard from '@/app/components/AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<LandingPage />} index />
          <Route element={<SignInPage />} path="/signIn" />
          <Route element={<SignUpPage />} path="/signUp" />
          <Route element={<ClientDashboard />} path="/clientDashboard" />
          <Route element={<TechnicianDashboard />} path="/techDashboard" />
          <Route element={<AdminDashboard />} path="/adminDashboard" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}