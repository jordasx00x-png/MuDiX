/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import TemplateSelector from './pages/TemplateSelector';
import Editor from './pages/Editor';
import Invitation from './pages/Invitation';
import Auth from './pages/Auth';
import { AuthProvider } from './lib/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<AuthProvider><Landing /></AuthProvider>} />
          <Route path="/dashboard" element={<AuthProvider><Dashboard /></AuthProvider>} />
          <Route path="/select-template" element={<AuthProvider><TemplateSelector /></AuthProvider>} />
          <Route path="/editor" element={<AuthProvider><Editor /></AuthProvider>} />
          <Route path="/editor/:id" element={<AuthProvider><Editor /></AuthProvider>} />
          <Route path="/invitation/:id" element={<Invitation />} />
          <Route path="/auth" element={<AuthProvider><Auth /></AuthProvider>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
