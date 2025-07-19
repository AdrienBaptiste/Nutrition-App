import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import FoodsPage from './pages/FoodsPage';
import CreateFoodPage from './pages/CreateFoodPage';
import EditFoodPage from './pages/EditFoodPage';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil publique */}
        <Route path="/" element={<HomePage />} />
        {/* Page d'authentification */}
        <Route path="/auth" element={<AuthPage />} />
        {/* Pages privées protégées */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        {/* Pages CRUD Aliments */}
        <Route 
          path="/foods" 
          element={
            <PrivateRoute>
              <FoodsPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/foods/new" 
          element={
            <PrivateRoute>
              <CreateFoodPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/foods/:id/edit" 
          element={
            <PrivateRoute>
              <EditFoodPage />
            </PrivateRoute>
          } 
        />
        {/* Futures pages privées */}
        {/* <Route path="/meals" element={<PrivateRoute><MealsPage /></PrivateRoute>} /> */}
        {/* <Route path="/calculator" element={<CalculatorPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
