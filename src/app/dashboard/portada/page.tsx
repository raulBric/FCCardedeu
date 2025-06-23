"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Upload, Trash2, Edit2, X, Save, Check, Image as ImageIcon, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, DataTable } from "@/components/dashboard/FormComponents";
import { supabase } from "@/lib/supabaseClient";

// Tipo para los elementos de la portada
interface HeroItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageFile?: File;
  order: number;
  active: boolean;
}

export default function PortadaPage() {
  // Estado para los elementos de la portada
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
  const [editingItem, setEditingItem] = useState<HeroItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Estado para el formulario de nuevo elemento
  const [newItem, setNewItem] = useState<HeroItem>({
    id: `temp-${Date.now()}`,
    title: "",
    subtitle: "",
    imageUrl: "",
    order: 0,
    active: true
  });
  
  // Estado para el proceso de carga
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Título y descripción para el layout del dashboard
  const pageTitle = "Gestión de Portada";
  const pageDescription = "Edita las imágenes y textos que aparecen en la sección principal del sitio web.";

  // Cargar ejemplos de datos al iniciar (esto sería reemplazado por la carga desde Supabase)
  useEffect(() => {
    // Simulamos cargar datos existentes
    setHeroItems([
      {
        id: "1",
        title: "Viu la Passió amb FC Cardedeu!",
        subtitle: "Uneix-te al club de futbol amb més història del Vallès Oriental",
        imageUrl: "/assets/portada1.jpg",
        order: 0,
        active: true
      },
      {
        id: "2",
        title: "Units per un sentiment!",
        subtitle: "Més que un club, som una família",
        imageUrl: "/assets/portada2.jpg",
        order: 1,
        active: true
      },
      {
        id: "3",
        title: "Formant campions des de 1934",
        subtitle: "Compromesos amb l'esport i els valors",
        imageUrl: "/assets/portada3.jpg",
        order: 2,
        active: false
      }
    ]);
  }, []);

  // Manejar cambio de archivo de imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Crear URL temporal para previsualización
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        imageFile: file,
        imageUrl: previewUrl
      });
    } else {
      setNewItem({
        ...newItem,
        imageFile: file,
        imageUrl: previewUrl
      });
    }
  };

  // Guardar un nuevo elemento o actualizar uno existente
  const handleSaveItem = async () => {
    setIsLoading(true);
    
    try {
      let itemToSave = editingItem ? {...editingItem} : {...newItem};
      
      // Aquí iría la lógica para subir la imagen a Supabase Storage
      // y obtener la URL pública
      
      if (itemToSave.imageFile) {
        // Simulamos la subida de la imagen
        console.log(`Subiendo imagen: ${itemToSave.imageFile.name}`);
        // La URL real vendría de Supabase después de subir el archivo
        // itemToSave.imageUrl = urlFromSupabase;
      }
      
      // Guardar en Supabase
      if (editingItem) {
        // Actualizar elemento existente
        console.log("Actualizando elemento:", itemToSave);
        
        // Actualizar en el estado local
        setHeroItems(heroItems.map(item => 
          item.id === itemToSave.id ? itemToSave : item
        ));
        
        // Limpiar estado de edición
        setEditingItem(null);
      } else {
        // Crear nuevo elemento
        console.log("Creando nuevo elemento:", itemToSave);
        
        // En una implementación real, aquí se obtendría el ID generado por Supabase
        const newId = `item-${Date.now()}`;
        itemToSave.id = newId;
        
        // Añadir al estado local
        setHeroItems([...heroItems, {...itemToSave, id: newId}]);
        
        // Reiniciar formulario
        setNewItem({
          id: `temp-${Date.now()}`,
          title: "",
          subtitle: "",
          imageUrl: "",
          order: heroItems.length,
          active: true
        });
        
        setShowForm(false);
      }
      
      // Limpiar previsualización
      setPreviewImage(null);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ha ocurrido un error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar un elemento
  const handleDeleteItem = (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
      return;
    }
    
    // Aquí iría la eliminación en Supabase
    console.log("Eliminando elemento:", id);
    
    // Actualizar estado local
    setHeroItems(heroItems.filter(item => item.id !== id));
  };

  // Iniciar edición de un elemento
  const handleEditItem = (item: HeroItem) => {
    setEditingItem({...item});
    setShowForm(false);
    setPreviewImage(item.imageUrl);
  };

  // Cancelar edición o creación
  const handleCancel = () => {
    setEditingItem(null);
    setPreviewImage(null);
    setShowForm(false);
  };

  // Cambiar el orden de los elementos
  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const currentIndex = heroItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === heroItems.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newItems = [...heroItems];
    const temp = newItems[currentIndex];
    newItems[currentIndex] = newItems[newIndex];
    newItems[newIndex] = temp;
    
    // Actualizar órdenes
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setHeroItems(updatedItems);
  };

  // Cambiar estado activo/inactivo
  const handleToggleActive = (id: string) => {
    setHeroItems(heroItems.map(item => 
      item.id === id ? {...item, active: !item.active} : item
    ));
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        {!editingItem && (
          <Button
            variant="primary" 
            onClick={() => setShowForm(!showForm)}
            iconLeft={showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {showForm ? "Cancelar" : "Nuevo elemento"}
          </Button>
        )}
      </div>
      
      {/* Formulario de edición */}
      {editingItem && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Editar elemento</CardTitle>
          </CardHeader>
          <CardContent>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Subtítulo o descripción
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                  value={editingItem.subtitle}
                  onChange={(e) => setEditingItem({...editingItem, subtitle: e.target.value})}
                />
              </div>
              
              <div className="flex items-center mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={editingItem.active}
                    onChange={() => setEditingItem({...editingItem, active: !editingItem.active})}
                  />
                  <span className="ml-2">Mostrar en portada</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Imagen
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                {previewImage ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={previewImage}
                      alt="Vista previa"
                      className="rounded object-cover"
                      fill
                    />
                    <button
                      onClick={() => {
                        setPreviewImage(null);
                        setEditingItem({...editingItem, imageUrl: "", imageFile: undefined});
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">Haz clic para seleccionar una imagen</p>
                    <p className="text-xs text-gray-400 mt-1">Recomendado: 1920 x 1080 px</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className={previewImage ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveItem}
              disabled={isLoading}
              iconLeft={!isLoading ? <Save className="w-4 h-4" /> : null}
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
          </CardContent>
        </Card>
      )}
      
      {/* Formulario para nuevo elemento */}
      {showForm && !editingItem && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nuevo elemento de portada</CardTitle>
          </CardHeader>
          <CardContent>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Subtítulo o descripción
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                  value={newItem.subtitle}
                  onChange={(e) => setNewItem({...newItem, subtitle: e.target.value})}
                />
              </div>
              
              <div className="flex items-center mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={newItem.active}
                    onChange={() => setNewItem({...newItem, active: !newItem.active})}
                  />
                  <span className="ml-2">Mostrar en portada</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Imagen
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                {previewImage ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={previewImage}
                      alt="Vista previa"
                      className="rounded object-cover"
                      fill
                    />
                    <button
                      onClick={() => {
                        setPreviewImage(null);
                        setNewItem({...newItem, imageUrl: "", imageFile: undefined});
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">Haz clic para seleccionar una imagen</p>
                    <p className="text-xs text-gray-400 mt-1">Recomendado: 1920 x 1080 px</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className={previewImage ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveItem}
              disabled={isLoading || !newItem.title || !previewImage}
              iconLeft={!isLoading ? <Save className="w-4 h-4" /> : null}
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
          </CardContent>
        </Card>
      )}
      
      {/* Lista de elementos existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Elementos de portada</CardTitle>
        </CardHeader>
        <CardContent>
          {heroItems.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No hay elementos en la portada. Añade uno nuevo para comenzar.</p>
            </div>
          ) : (
            <div className="divide-y">
              {heroItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 mr-4 overflow-hidden rounded-md flex-shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.title}
                        className="object-cover absolute inset-0 w-full h-full"
                        width="64"
                        height="64"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.subtitle}</p>
                      <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                        item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReorder(item.id, 'up')}
                        disabled={item.order === 0}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReorder(item.id, 'down')}
                        disabled={item.order === heroItems.length - 1}
                        className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(item.id)}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <Check className={`w-5 h-5 ${item.active ? 'text-green-600' : 'text-gray-400'}`} />
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-1 rounded hover:bg-gray-200 text-blue-600"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded hover:bg-gray-200 text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
