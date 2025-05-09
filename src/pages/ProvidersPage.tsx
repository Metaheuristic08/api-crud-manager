
import React, { useEffect, useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButton, 
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLoading,
  IonAlert,
  IonItem,
  IonLabel,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { Provider } from '@/types';
import { providersApi } from '@/services/api';

const ProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('Activo');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider && showEditModal) {
      setName(selectedProvider.provider_name);
      setLastName(selectedProvider.provider_last_name);
      setEmail(selectedProvider.provider_mail);
      setState(selectedProvider.provider_state);
    } else {
      resetForm();
    }
  }, [selectedProvider, showEditModal]);

  const resetForm = () => {
    setName('');
    setLastName('');
    setEmail('');
    setState('Activo');
    setFormError('');
  };

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await providersApi.getAll();
      setProviders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadProviders();
    event.detail.complete();
  };

  const handleDelete = async (providerId: number) => {
    try {
      await providersApi.delete(providerId);
      setProviders(providers.filter((p) => p.provider_id !== providerId));
      setShowAlert(false);
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSaveProvider = async (isEdit: boolean) => {
    if (!name.trim() || !lastName.trim() || !email.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    if (!validateEmail(email)) {
      setFormError('El correo electrónico no es válido');
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit && selectedProvider) {
        const updatedData = {
          provider_id: selectedProvider.provider_id,
          provider_name: name,
          provider_last_name: lastName,
          provider_mail: email,
          provider_state: state
        };
        
        await providersApi.update(updatedData);
        
        setProviders(
          providers.map((p) =>
            p.provider_id === selectedProvider.provider_id ? updatedData : p
          )
        );
        
        setShowEditModal(false);
      } else {
        const newData = {
          provider_name: name,
          provider_last_name: lastName,
          provider_mail: email,
          provider_state: 'Activo'
        };
        
        const response = await providersApi.add(newData);
        
        if (response && response.provider_id) {
          const newProvider = {
            ...newData,
            provider_id: response.provider_id
          };
          
          setProviders([...providers, newProvider]);
        }
        
        setShowAddModal(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving provider:', error);
      setFormError('Error al guardar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Proveedores</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        
        {loading && !showAddModal && !showEditModal ? (
          <div className="flex justify-center items-center h-full">
            <IonLoading isOpen={loading} message="Cargando proveedores..." />
          </div>
        ) : (
          <div className="ion-padding">
            {providers.length === 0 ? (
              <IonCard>
                <IonCardContent>
                  <p className="text-center">No hay proveedores disponibles</p>
                </IonCardContent>
              </IonCard>
            ) : (
              <IonList>
                {providers.map((provider) => (
                  <IonCard key={provider.provider_id}>
                    <IonCardHeader>
                      <IonCardTitle>
                        {provider.provider_name} {provider.provider_last_name}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="mb-2">
                        <p><strong>Email:</strong> {provider.provider_mail}</p>
                        <p><strong>Estado:</strong> {provider.provider_state}</p>
                      </div>
                      <div className="flex justify-between mt-4">
                        <IonButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setShowEditModal(true);
                          }}
                        >
                          Editar
                        </IonButton>
                        <IonButton
                          size="small"
                          color="danger"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setShowAlert(true);
                          }}
                        >
                          Eliminar
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonList>
            )}
          </div>
        )}
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        
        {/* Delete confirmation alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar eliminación"
          message={`¿Está seguro que desea eliminar al proveedor "${selectedProvider?.provider_name} ${selectedProvider?.provider_last_name}"?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Eliminar',
              role: 'confirm',
              handler: () => {
                if (selectedProvider) {
                  handleDelete(selectedProvider.provider_id);
                }
              },
            },
          ]}
        />
        
        {/* Add Provider Modal */}
        <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nuevo Proveedor</IonTitle>
              <IonButton slot="end" onClick={() => setShowAddModal(false)}>Cerrar</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {formError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {formError}
              </div>
            )}
            
            <IonItem>
              <IonLabel position="floating">Nombre*</IonLabel>
              <IonInput
                value={name}
                onIonChange={(e) => setName(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="floating">Apellido*</IonLabel>
              <IonInput
                value={lastName}
                onIonChange={(e) => setLastName(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="floating">Correo electrónico*</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>
            
            <div className="ion-padding">
              <IonButton expand="block" onClick={() => handleSaveProvider(false)}>
                Guardar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
        
        {/* Edit Provider Modal */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Proveedor</IonTitle>
              <IonButton slot="end" onClick={() => setShowEditModal(false)}>Cerrar</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {formError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {formError}
              </div>
            )}
            
            <IonItem>
              <IonLabel position="floating">Nombre*</IonLabel>
              <IonInput
                value={name}
                onIonChange={(e) => setName(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="floating">Apellido*</IonLabel>
              <IonInput
                value={lastName}
                onIonChange={(e) => setLastName(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonItem>
              <IonLabel position="floating">Correo electrónico*</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonItem>
              <IonLabel>Estado</IonLabel>
              <IonSelect value={state} onIonChange={(e) => setState(e.detail.value)}>
                <IonSelectOption value="Activo">Activo</IonSelectOption>
                <IonSelectOption value="Inactivo">Inactivo</IonSelectOption>
              </IonSelect>
            </IonItem>
            
            <div className="ion-padding">
              <IonButton expand="block" onClick={() => handleSaveProvider(true)}>
                Actualizar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ProvidersPage;
