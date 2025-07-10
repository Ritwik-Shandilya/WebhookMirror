import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import WebhookPage from './pages/WebhookPage';
import ApiTesterPage from './pages/ApiTesterPage';
import EndpointPage from './pages/EndpointPage';
import RequestPage from './pages/RequestPage';
import { ToastContainer } from 'react-toastify';
import './index.css';
import '../node_modules/@bigbinary/neetoui/dist/index.css';

const App = () => (
  <BrowserRouter>
    <ToastContainer />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/dashboard" component={DashboardPage} />
      <Route exact path="/webhook" component={WebhookPage} />
      <Route exact path="/api-test" component={ApiTesterPage} />
      <Route exact path="/endpoint/:uuid" component={EndpointPage} />
      <Route exact path="/endpoint/:uuid/request/:id" component={RequestPage} />
    </Switch>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
