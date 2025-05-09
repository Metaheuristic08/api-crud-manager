
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Outlet } from 'react-router-dom';
import { home, pricetag, people, cube } from 'ionicons/icons';

const TabsPage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Outlet />
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
