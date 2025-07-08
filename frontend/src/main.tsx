import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EndpointPage from './pages/EndpointPage';
import RequestPage from './pages/RequestPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/endpoint/:uuid" element={<EndpointPage />} />
      <Route path="/endpoint/:uuid/request/:id" element={<RequestPage />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
