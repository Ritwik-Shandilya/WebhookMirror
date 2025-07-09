import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import WebhookPage from './pages/WebhookPage';
import ApiTesterPage from './pages/ApiTesterPage';
import EndpointPage from './pages/EndpointPage';
import RequestPage from './pages/RequestPage';
import '@bigbinary/neetoui/dist/index.css';
import './index.scss';
import { ToastContainer } from 'react-toastify';

const App = () => (
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/webhook" element={<WebhookPage />} />
      <Route path="/api-test" element={<ApiTesterPage />} />
      <Route path="/endpoint/:uuid" element={<EndpointPage />} />
      <Route path="/endpoint/:uuid/request/:id" element={<RequestPage />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
