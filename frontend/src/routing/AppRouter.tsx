import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import HomePage from '../pages/HomePage';
import FoodsPage from '../pages/FoodsPage';
import CreateFoodPage from '../pages/CreateFoodPage';
import EditFoodPage from '../pages/EditFoodPage';
import MealsPage from '../pages/MealsPage';
import CreateMealPage from '../pages/CreateMealPage';
import EditMealPage from '../pages/EditMealPage';
import WeightsPage from '../pages/WeightsPage';
import CreateWeightPage from '../pages/CreateWeightPage';
import EditWeightPage from '../pages/EditWeightPage';
import DishesPage from '../pages/DishesPage';
import CreateDishPage from '../pages/CreateDishPage';
import EditDishPage from '../pages/EditDishPage';
import ComposeDishPage from '../pages/ComposeDishPage';
import ComposeMealPage from '../pages/ComposeMealPage';
import CalendarPage from '../pages/CalendarPage';
import ProposeFoodPage from '../pages/ProposeFoodPage';
import MyFoodProposalsPage from '../pages/MyFoodProposalsPage';
import AdminFoodModerationPage from '../pages/AdminFoodModerationPage';
import PrivateRoute from '../components/routing/PrivateRoute';
import AdminRoute from '../components/routing/AdminRoute';

const AppRouter: React.FC = () => (
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
    {/* Routes de modération des aliments */}
    <Route 
      path="/foods/propose" 
      element={
        <PrivateRoute>
          <ProposeFoodPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/foods/my-proposals" 
      element={
        <PrivateRoute>
          <MyFoodProposalsPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/admin/food-moderation" 
      element={
        <AdminRoute>
          <AdminFoodModerationPage />
        </AdminRoute>
      }
    />
    {/* Routes CRUD Repas */}
    <Route 
      path="/meals" 
      element={
        <PrivateRoute>
          <MealsPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/meals/new" 
      element={
        <PrivateRoute>
          <CreateMealPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/meals/:id/edit" 
      element={
        <PrivateRoute>
          <EditMealPage />
        </PrivateRoute>
      }
    />
    {/* Routes CRUD Poids */}
    <Route 
      path="/weights" 
      element={
        <PrivateRoute>
          <WeightsPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/weights/new" 
      element={
        <PrivateRoute>
          <CreateWeightPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/weights/:id/edit" 
      element={
        <PrivateRoute>
          <EditWeightPage />
        </PrivateRoute>
      }
    />
    {/* Routes CRUD Plats */}
    <Route 
      path="/dishes" 
      element={
        <PrivateRoute>
          <DishesPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/dishes/new" 
      element={
        <PrivateRoute>
          <CreateDishPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/dishes/:id/edit" 
      element={
        <PrivateRoute>
          <EditDishPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/dishes/:id/compose" 
      element={
        <PrivateRoute>
          <ComposeDishPage />
        </PrivateRoute>
      }
    />
    <Route 
      path="/meals/:id/compose" 
      element={
        <PrivateRoute>
          <ComposeMealPage />
        </PrivateRoute>
      }
    />
    {/* Calendrier */}
    <Route 
      path="/calendar"
      element={
        <PrivateRoute>
          <CalendarPage />
        </PrivateRoute>
      }
    />
    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRouter;
