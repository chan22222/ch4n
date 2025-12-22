import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProtectedAdmin from './components/ProtectedAdmin';
import Currency from './components/Currency';
import Gemini from './components/Gemini';
import Portfolio from './components/Portfolio';
import ReelStash from './components/ReelStash';
import IpTracker from './components/IpTracker';
import Shipdago from './components/Shipdago';
import Photo from './components/Photo';

const App: React.FC = () => {

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/gemini" element={<Gemini />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/reelstash" element={<ReelStash />} />
          <Route path="/iptracker" element={<IpTracker />} />
          <Route path="/shipdago" element={<Shipdago />} />
          <Route path="/photo" element={<Photo />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
