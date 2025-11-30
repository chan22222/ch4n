import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProtectedAdmin from './components/ProtectedAdmin';
import Currency from './components/Currency';
import Gemini from './components/Gemini';

const App: React.FC = () => {

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/gemini" element={<Gemini />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
