
import React, { useEffect, useState } from 'react';
import { 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSelect, 
  IonSelectOption 
} from '@ionic/react';
import { Product } from '@/types';
import { productsApi } from '@/services/api';

interface ProductModalFormProps {
  isOpen: boolean;
  isEdit?: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductModalForm: React.FC<ProductModalFormProps> = ({ 
  isOpen, 
  isEdit = false, 
  product = null, 
  onClose, 
  onSave 
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [state, setState] = useState('Activo');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && isEdit) {
      setName(product.product_name);
      setPrice(product.product_price);
      setImageUrl(product.product_image || '');
      setState(product.product_state);
    } else {
      resetForm();
    }
  }, [product, isEdit]);

  const resetForm = () => {
    setName('');
    setPrice(0);
    setImageUrl('');
    setState('Activo');
    setFormError('');
  };

  const handleSaveProduct = async () => {
    if (!name.trim()) {
      setFormError('El nombre del producto es obligatorio');
      return;
    }

    if (price <= 0) {
      setFormError('El precio debe ser mayor que 0');
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit && product) {
        const updatedData = {
          product_id: product.product_id,
          product_name: name,
          product_price: price,
          product_image: imageUrl || 'https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto-1200x900.jpg',
          product_state: state
        };
        
        await productsApi.update(updatedData);
        onSave(updatedData);
      } else {
        const newData = {
          product_name: name,
          product_price: price,
          product_image: imageUrl || 'https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto-1200x900.jpg'
        };
        
        const response = await productsApi.add(newData);
        
        if (response && response.product_id) {
          const newProduct = {
            ...newData,
            product_id: response.product_id,
            product_state: 'Activo'
          };
          
          onSave(newProduct);
        }
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      setFormError('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</IonTitle>
          <IonButton slot="end" onClick={onClose}>Cerrar</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {formError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {formError}
          </div>
        )}
        
        <IonItem>
          <IonLabel position="floating">Nombre del producto*</IonLabel>
          <IonInput
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
            required
          />
        </IonItem>
        
        <IonItem>
          <IonLabel position="floating">Precio*</IonLabel>
          <IonInput
            type="number"
            value={price}
            onIonChange={(e) => setPrice(Number(e.detail.value))}
            required
          />
        </IonItem>
        
        <IonItem>
          <IonLabel position="floating">URL de imagen</IonLabel>
          <IonInput
            value={imageUrl}
            onIonChange={(e) => setImageUrl(e.detail.value!)}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </IonItem>
        
        {isEdit && (
          <IonItem>
            <IonLabel>Estado</IonLabel>
            <IonSelect value={state} onIonChange={(e) => setState(e.detail.value)}>
              <IonSelectOption value="Activo">Activo</IonSelectOption>
              <IonSelectOption value="Inactivo">Inactivo</IonSelectOption>
            </IonSelect>
          </IonItem>
        )}
        
        <div className="ion-padding">
          <IonButton 
            expand="block" 
            onClick={handleSaveProduct}
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Guardar')}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ProductModalForm;
