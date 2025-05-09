
import React, { useState, useEffect } from 'react';
import { 
  IonButton, 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonLoading
} from '@ionic/react';
import { Product } from '@/types';
import { productsApi } from '@/services/api';

interface ProductModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null;
  isEdit?: boolean;
}

const ProductModalForm: React.FC<ProductModalFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  product,
  isEdit = false
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [state, setState] = useState('Activo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product && isEdit) {
      setName(product.product_name);
      setPrice(product.product_price.toString());
      setImage(product.product_image);
      setState(product.product_state);
    } else {
      resetForm();
    }
  }, [product, isEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setImage('https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto-1200x900.jpg');
    setState('Activo');
    setError('');
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim()) {
      setError('Nombre y precio son obligatorios');
      return;
    }

    const numPrice = parseFloat(price);
    
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('El precio debe ser un número válido mayor que 0');
      return;
    }

    setLoading(true);
    
    try {
      if (isEdit && product) {
        // Update existing product
        const updatedData = {
          product_id: product.product_id,
          product_name: name,
          product_price: numPrice,
          product_image: image || 'https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto-1200x900.jpg',
          product_state: state
        };
        
        const response = await productsApi.update(updatedData);
        
        if (response) {
          onSave({
            ...updatedData,
            product_id: product.product_id
          });
        }
      } else {
        // Add new product
        const newData = {
          product_name: name,
          product_price: numPrice,
          product_image: image || 'https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto-1200x900.jpg'
        };
        
        const response = await productsApi.add(newData);
        
        if (response && response.product_id) {
          onSave({
            ...newData,
            product_id: response.product_id,
            product_state: 'Activo'
          });
        }
      }
      
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Error al guardar el producto. Inténtelo de nuevo.');
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
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
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
            onIonChange={(e) => setPrice(e.detail.value!)}
            required
          />
        </IonItem>
        
        <IonItem>
          <IonLabel position="floating">URL de la imagen</IonLabel>
          <IonInput
            value={image}
            onIonChange={(e) => setImage(e.detail.value!)}
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
          <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
            Guardar
          </IonButton>
        </div>
        
        <IonLoading isOpen={loading} message="Guardando..." />
      </IonContent>
    </IonModal>
  );
};

export default ProductModalForm;
