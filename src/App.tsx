
import { Suspense, lazy } from "react";
import { IonApp, setupIonicReact } from '@ionic/react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Inicializar Ionic React
setupIonicReact();

// Importar las páginas usando lazy loading
const Index = lazy(() => import('./pages/Index'));
const TabsPage = lazy(() => import('./pages/TabsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const ProvidersPage = lazy(() => import('./pages/ProvidersPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Inicializar QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <IonApp>
                <Suspense fallback={<div>Cargando...</div>}>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/tabs" element={<TabsPage />}>
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="products" element={<ProductsPage />} />
                      <Route path="categories" element={<CategoriesPage />} />
                      <Route path="providers" element={<ProvidersPage />} />
                      <Route index element={<Navigate to="dashboard" replace />} />
                    </Route>
                    <Route path="/" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
                <Sonner />
              </IonApp>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
