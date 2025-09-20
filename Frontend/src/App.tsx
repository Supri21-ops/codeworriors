import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { appRoutes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map(r => (
          <Route key={r.key} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
