import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'authentification */}
        <Route path="/auth" element={<AuthPage />} />
        {/* Autres routes */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
