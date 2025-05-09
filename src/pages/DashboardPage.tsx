
import React from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRow,
  IonCol
} from '@ionic/react';
import { useAuth } from '@/context/AuthContext';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Bienvenido</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Usuario: {currentUser?.email}</p>
            <p>Sistema de gestión de inventario</p>
          </IonCardContent>
        </IonCard>

        <IonRow>
          <IonCol size="12" sizeMd="4">
            <IonCard routerLink="/tabs/products" className="ion-activatable ripple-parent">
              <IonCardHeader>
                <IonCardTitle>Productos</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Gestiona el catálogo de productos
              </IonCardContent>
            </IonCard>
          </IonCol>
          
          <IonCol size="12" sizeMd="4">
            <IonCard routerLink="/tabs/categories" className="ion-activatable ripple-parent">
              <IonCardHeader>
                <IonCardTitle>Categorías</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Organiza los productos por categorías
              </IonCardContent>
            </IonCard>
          </IonCol>
          
          <IonCol size="12" sizeMd="4">
            <IonCard routerLink="/tabs/providers" className="ion-activatable ripple-parent">
              <IonCardHeader>
                <IonCardTitle>Proveedores</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Administra la información de proveedores
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
