import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExternalPage from './components/ExternalPage';

const App: React.FC = () => {

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/currency"
            element={<ExternalPage src="https://ch4n.co.kr/currency" title="환율 계산기" />}
          />
          <Route
            path="/gemini"
            element={<ExternalPage src="https://ch4n.co.kr/gemini" title="Gemini API" />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
