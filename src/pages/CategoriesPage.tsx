
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
import { Category } from '@/types';
import { categoriesApi } from '@/services/api';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [categoryState, setCategoryState] = useState('Activa');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory && showEditModal) {
      setCategoryName(selectedCategory.category_name);
      setCategoryState(selectedCategory.category_state);
    } else {
      resetForm();
    }
  }, [selectedCategory, showEditModal]);

  const resetForm = () => {
    setCategoryName('');
    setCategoryState('Activa');
    setFormError('');
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadCategories();
    event.detail.complete();
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await categoriesApi.delete(categoryId);
      setCategories(categories.filter((c) => c.category_id !== categoryId));
      setShowAlert(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSaveCategory = async (isEdit: boolean) => {
    if (!categoryName.trim()) {
      setFormError('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit && selectedCategory) {
        const updatedData = {
          category_id: selectedCategory.category_id,
          category_name: categoryName,
          category_state: categoryState
        };
        
        await categoriesApi.update(updatedData);
        
        setCategories(
          categories.map((c) =>
            c.category_id === selectedCategory.category_id ? updatedData : c
          )
        );
        
        setShowEditModal(false);
      } else {
        const newData = {
          category_name: categoryName
        };
        
        const response = await categoriesApi.add(newData);
        
        if (response && response.category_id) {
          const newCategory = {
            ...newData,
            category_id: response.category_id,
            category_state: 'Activa'
          };
          
          setCategories([...categories, newCategory]);
        }
        
        setShowAddModal(false);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      setFormError('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Categorías</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        
        {loading && !showAddModal && !showEditModal ? (
          <div className="flex justify-center items-center h-full">
            <IonLoading isOpen={loading} message="Cargando categorías..." />
          </div>
        ) : (
          <div className="ion-padding">
            {categories.length === 0 ? (
              <IonCard>
                <IonCardContent>
                  <p className="text-center">No hay categorías disponibles</p>
                </IonCardContent>
              </IonCard>
            ) : (
              <IonList>
                {categories.map((category) => (
                  <IonCard key={category.category_id}>
                    <IonCardHeader>
                      <IonCardTitle>{category.category_name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="mb-2">
                        <p><strong>Estado:</strong> {category.category_state}</p>
                      </div>
                      <div className="flex justify-between mt-4">
                        <IonButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowEditModal(true);
                          }}
                        >
                          Editar
                        </IonButton>
                        <IonButton
                          size="small"
                          color="danger"
                          onClick={() => {
                            setSelectedCategory(category);
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
          message={`¿Está seguro que desea eliminar "${selectedCategory?.category_name}"?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Eliminar',
              role: 'confirm',
              handler: () => {
                if (selectedCategory) {
                  handleDelete(selectedCategory.category_id);
                }
              },
            },
          ]}
        />
        
        {/* Add Category Modal */}
        <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Categoría</IonTitle>
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
              <IonLabel position="floating">Nombre de la categoría*</IonLabel>
              <IonInput
                value={categoryName}
                onIonChange={(e) => setCategoryName(e.detail.value!)}
                required
              />
            </IonItem>
            
            <div className="ion-padding">
              <IonButton expand="block" onClick={() => handleSaveCategory(false)}>
                Guardar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
        
        {/* Edit Category Modal */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Categoría</IonTitle>
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
              <IonLabel position="floating">Nombre de la categoría*</IonLabel>
              <IonInput
                value={categoryName}
                onIonChange={(e) => setCategoryName(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonItem>
              <IonLabel>Estado</IonLabel>
              <IonSelect value={categoryState} onIonChange={(e) => setCategoryState(e.detail.value)}>
                <IonSelectOption value="Activa">Activa</IonSelectOption>
                <IonSelectOption value="Inactiva">Inactiva</IonSelectOption>
              </IonSelect>
            </IonItem>
            
            <div className="ion-padding">
              <IonButton expand="block" onClick={() => handleSaveCategory(true)}>
                Actualizar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CategoriesPage;
