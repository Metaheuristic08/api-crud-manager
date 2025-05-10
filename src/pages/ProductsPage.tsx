
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
  IonImg
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { Product } from '@/types';
import { productsApi } from '@/services/api';
import ProductModalForm from '@/components/ProductModalForm';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      console.log('Fetching products...');
      const data = await productsApi.getAll();
      console.log('Products data:', data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoadError('Error al cargar los productos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadProducts();
    event.detail.complete();
  };

  const handleDelete = async (productId: number) => {
    try {
      setLoading(true);
      await productsApi.delete(productId);
      setProducts(products.filter((p) => p.product_id !== productId));
      setShowAlert(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <IonLoading isOpen={loading} message="Cargando productos..." />
          </div>
        ) : loadError ? (
          <div className="p-4">
            <IonCard>
              <IonCardContent>
                <p className="text-center text-red-600">{loadError}</p>
                <div className="flex justify-center mt-4">
                  <IonButton onClick={loadProducts}>Reintentar</IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        ) : (
          <div className="ion-padding">
            {products.length === 0 ? (
              <IonCard>
                <IonCardContent>
                  <p className="text-center">No hay productos disponibles</p>
                </IonCardContent>
              </IonCard>
            ) : (
              <IonList>
                {products.map((product) => (
                  <IonCard key={product.product_id}>
                    <IonImg
                      src={product.product_image || 'https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto-1200x900.jpg'}
                      alt={product.product_name}
                      className="h-40 object-cover w-full"
                    />
                    <IonCardHeader>
                      <IonCardTitle>{product.product_name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="mb-2">
                        <p><strong>Precio:</strong> ${product.product_price}</p>
                        <p><strong>Estado:</strong> {product.product_state}</p>
                      </div>
                      <div className="flex justify-between mt-4">
                        <IonButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowEditModal(true);
                          }}
                        >
                          Editar
                        </IonButton>
                        <IonButton
                          size="small"
                          color="danger"
                          onClick={() => {
                            setSelectedProduct(product);
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
        
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar eliminación"
          message={`¿Está seguro que desea eliminar "${selectedProduct?.product_name}"?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Eliminar',
              role: 'confirm',
              handler: () => {
                if (selectedProduct) {
                  handleDelete(selectedProduct.product_id);
                }
              },
            },
          ]}
        />
        
        <ProductModalForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={(product) => {
            setProducts([...products, product]);
            setShowAddModal(false);
          }}
        />
        
        <ProductModalForm
          isOpen={showEditModal}
          product={selectedProduct}
          isEdit
          onClose={() => setShowEditModal(false)}
          onSave={(updatedProduct) => {
            setProducts(
              products.map((p) =>
                p.product_id === updatedProduct.product_id ? updatedProduct : p
              )
            );
            setShowEditModal(false);
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProductsPage;
