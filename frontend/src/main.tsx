import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import WebhookPage from './pages/WebhookPage';
import ApiTesterPage from './pages/ApiTesterPage';
import EndpointPage from './pages/EndpointPage';
import RequestPage from './pages/RequestPage';
import './index.css';

import { ToastContainer } from 'react-toastify';

const App = () => (
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/webhook" element={<WebhookPage />} />
      <Route path="/api-test" element={<ApiTesterPage />} />
      <Route path="/endpoint/:uuid" element={<EndpointPage />} />
      <Route path="/endpoint/:uuid/request/:id" element={<RequestPage />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
