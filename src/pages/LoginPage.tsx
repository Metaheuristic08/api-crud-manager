
import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonItem, 
  IonInput, 
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLoading
} from '@ionic/react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      alert("Por favor, complete todos los campos");
      return;
    }
    
    try {
      setShowLoading(true);
      await login(email, password);
      navigate('/tabs/dashboard');
    } catch (error) {
      console.error('Login error:', error);
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
              <IonCardTitle className="text-center text-2xl font-bold">Iniciar Sesión</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleLogin}>
                <IonItem>
                  <IonInput
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                    required
                  />
                </IonItem>
                <IonItem className="mb-6">
                  <IonInput
                    label="Contraseña"
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    required
                  />
                </IonItem>
                <IonButton expand="block" type="submit">Iniciar sesión</IonButton>
                <div className="text-center mt-4">
                  <IonButton fill="clear" routerLink="/register">
                    ¿No tienes cuenta? Regístrate
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
        <IonLoading isOpen={showLoading} message="Iniciando sesión..." />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
