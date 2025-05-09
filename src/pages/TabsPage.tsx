
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { home, pricetag, people, cube } from 'ionicons/icons';
import DashboardPage from './DashboardPage';
import ProductsPage from './ProductsPage';
import CategoriesPage from './CategoriesPage';
import ProvidersPage from './ProvidersPage';

const TabsPage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/dashboard" component={DashboardPage} />
        <Route exact path="/tabs/products" component={ProductsPage} />
        <Route exact path="/tabs/categories" component={CategoriesPage} />
        <Route exact path="/tabs/providers" component={ProvidersPage} />
        <Route exact path="/tabs">
          <Redirect to="/tabs/dashboard" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/tabs/dashboard">
          <IonIcon icon={home} />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="products" href="/tabs/products">
          <IonIcon icon={cube} />
          <IonLabel>Productos</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="categories" href="/tabs/categories">
          <IonIcon icon={pricetag} />
          <IonLabel>Categorías</IonLabel>
        </IonTabButton>
        
        <IonTabButton tab="providers" href="/tabs/providers">
          <IonIcon icon={people} />
          <IonLabel>Proveedores</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsPage;
