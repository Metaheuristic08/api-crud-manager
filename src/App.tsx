
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TabsPage from './pages/TabsPage';

setupIonicReact();
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/login" component={LoginPage} exact />
              <Route path="/register" component={RegisterPage} exact />
              <Route path="/tabs" component={TabsPage} />
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </AuthProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
