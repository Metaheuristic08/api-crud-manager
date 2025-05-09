
import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLoading
} from '@ionic/react';
import { useAuth } from '@/context/AuthContext';
import { useHistory } from 'react-router';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const { register } = useAuth();
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setShowLoading(true);
      await register(email, password);
      history.push('/tabs/dashboard');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex justify-center items-center min-h-full">
          <IonCard className="w-full max-w-md">
            <IonCardHeader>
              <IonCardTitle className="text-center text-2xl font-bold">Crear Cuenta</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleRegister}>
                <IonItem className="mb-4">
                  <IonLabel position="floating">Correo electrónico</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    required
                  />
                </IonItem>
                <IonItem className="mb-6">
                  <IonLabel position="floating">Contraseña</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    required
                  />
                </IonItem>
                <IonButton expand="block" type="submit">Registrarse</IonButton>
                <div className="text-center mt-4">
                  <IonButton fill="clear" routerLink="/login">
                    ¿Ya tienes cuenta? Inicia sesión
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
        <IonLoading isOpen={showLoading} message="Registrando..." />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
