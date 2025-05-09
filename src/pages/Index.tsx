
import React from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-8 text-center">Sistema de Gestión de Inventario</h1>
          <p className="text-xl mb-8 text-center text-gray-600">
            Administra productos, categorías y proveedores de forma eficiente
          </p>
          <div className="space-y-4">
            <IonButton expand="block" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </IonButton>
            <IonButton expand="block" fill="outline" onClick={() => navigate('/register')}>
              Registrarse
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Index;
