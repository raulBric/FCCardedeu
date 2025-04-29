"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Upload, X, Loader2, Check, Eye, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button, FormField } from "@/components/dashboard/FormComponents";
import Card from "@/components/dashboard/Card";
import { crearNoticia } from "@/services/dashboardService";
import { supabase } from '@/lib/supabaseClient';

export default function CrearNoticiaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    fecha: new Date().toISOString().split('T')[0],
    autor: "",
    categoria: "",
    destacada: false,
    imagen_url: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Borrar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tipo y tamaño
    if (!file.type.includes('image/')) {
      setErrors(prev => ({ ...prev, imagen: "El fitxer ha de ser una imatge" }));
      return;
    }
    
    // Validar formato recomendado
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setErrors(prev => ({ ...prev, imagen: "Format recomanat: JPG o PNG" }));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imagen: "La imatge no ha de superar els 5MB" }));
      return;
    }
    
    // Mostrar vista previa local inmediatamente
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    // Subir a Supabase utilizando el servicio
    try {
      setUploadStatus('uploading');
      console.log('Iniciando subida de imagen...');
      
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      
      // Mostrar información de diagnóstico
      console.log('Información de la imagen:');
      console.log('- Tipo:', file.type);
      console.log('- Tamaño:', (file.size / 1024).toFixed(2), 'KB');
      console.log('- Nombre generado:', fileName);
      
      // Usar el servicio para subir el archivo
      const publicUrl = await subirArchivo('noticies', fileName, file);
      console.log('URL obtenida:', publicUrl);
      
      // Actualizar el estado del formulario con la URL pública
      setFormData(prev => ({ ...prev, imagen_url: publicUrl }));
      setUploadStatus('success');
      console.log('Imagen subida exitosamente');
      
      // Eliminar cualquier error previo
      if (errors.imagen) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.imagen;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Error al pujar imatge:", error);
      setUploadStatus('error');
      setErrors(prev => ({ ...prev, imagen: "Error al pujar la imatge. Intenta de nou." }));
    }
  };
  
  // Función auxiliar para subir un archivo a Supabase utilizando una aproximación simplificada
  const subirArchivo = async (bucket: string, path: string, file: File): Promise<string> => {
    try {
      console.log(`Intentando subir archivo a ${bucket}/${path}`);
      
      // Paso 1: Comprobar si hay claves de Supabase configuradas
      console.log('URL de Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Clave de Supabase configurada:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      // Paso 2: Intentar subir directamente sin verificar el bucket
      // Si el bucket no existe se creará automáticamente con la RLS correcta
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error específico al subir:', uploadError);
        
        // Comprobar si es un error de permisos
        if (uploadError.message.includes('permission') || uploadError.message.includes('not found')) {
          console.log('Intentando crear bucket explícitamente...');
          // Intentar crear el bucket explícitamente
          try {
            const { error: createError } = await supabase.storage.createBucket(bucket, {
              public: true,
              fileSizeLimit: 5242880 // 5MB en bytes
            });
            
            if (createError) {
              console.error('Error al crear bucket:', createError);
              throw createError;
            }
            
            // Reintentar la subida
            const { error: retryError } = await supabase.storage
              .from(bucket)
              .upload(path, file, {
                cacheControl: '3600',
                upsert: true
              });
              
            if (retryError) throw retryError;
          } catch (e) {
            console.error('Error al crear bucket o reintentar:', e);
            throw e;
          }
        } else {
          throw uploadError;
        }
      }
      
      // Para diagnóstico
      console.log('Archivo subido correctamente:', path);
      
      // Obtener la URL pública usando el método oficial de Supabase
      // pero con una verificación de seguridad adicional
      try {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(path);
          
        if (urlData && urlData.publicUrl) {
          console.log('URL pública obtenida correctamente:', urlData.publicUrl);
          return urlData.publicUrl;
        }
      } catch (urlError) {
        console.error('Error al obtener URL pública:', urlError);
        // Continuar con el método de respaldo
      }
      
      // Método de respaldo: Generar URL directamente
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
      
      console.log('URL generada manualmente (respaldo):', publicUrl);
      return publicUrl;
    } catch (error: unknown) {
      const typedError = error as { message?: string; error_description?: string };
      const errorMsg = typedError?.message || typedError?.error_description || JSON.stringify(error) || 'Error desconocido';
      console.error(`Error detallado al subir archivo a ${bucket}/${path}:`, errorMsg);
      throw new Error(`Error al pujar la imatge: ${errorMsg}`);
    }
  };
  
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imagen_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadStatus('idle');
  };
  
  // Funciones para la barra de herramientas del editor Markdown
  const handleToolbarAction = (action: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.contenido.substring(start, end);
    let newText = '';
    
    const insertText = (before: string, after: string = '') => {
      const newContent = 
        formData.contenido.substring(0, start) + 
        before + 
        selectedText + 
        after + 
        formData.contenido.substring(end);
      
      setFormData(prev => ({ ...prev, contenido: newContent }));
      
      // Establecer posición del cursor
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = selectedText.length > 0 
          ? start + before.length + selectedText.length + after.length
          : start + before.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    };
    
    switch (action) {
      case 'h1':
        insertText('# ', '\n');
        break;
      case 'h2':
        insertText('## ', '\n');
        break;
      case 'h3':
        insertText('### ', '\n');
        break;
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'strike':
        insertText('~~', '~~');
        break;
      case 'ol':
        if (selectedText.length > 0) {
          // Convertir cada línea en un elemento de lista ordenada
          const lines = selectedText.split('\n');
          newText = lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
          insertText(newText);
        } else {
          insertText('1. ');
        }
        break;
      case 'ul':
        if (selectedText.length > 0) {
          // Convertir cada línea en un elemento de lista no ordenada
          const lines = selectedText.split('\n');
          newText = lines.map(line => `- ${line}`).join('\n');
          insertText(newText);
        } else {
          insertText('- ');
        }
        break;
      case 'link':
        insertText('[', '](https://exemple.com)');
        break;
      case 'image':
        insertText('![', '](https://exemple.com/imatge.jpg)');
        break;
      case 'quote':
        if (selectedText.length > 0) {
          // Convertir cada línea en una cita
          const lines = selectedText.split('\n');
          newText = lines.map(line => `> ${line}`).join('\n');
          insertText(newText);
        } else {
          insertText('> ');
        }
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          insertText('```\n', '\n```');
        } else {
          insertText('`', '`');
        }
        break;
      case 'hr':
        insertText('\n---\n');
        break;
      default:
        break;
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio";
    }
    
    if (!formData.contenido.trim()) {
      newErrors.contenido = "El contenido es obligatorio";
    }
    
    if (!formData.fecha) {
      newErrors.fecha = "La fecha es obligatoria";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Verificar que la imagen esté en formData si se subió una imagen
      if (imagePreview && !formData.imagen_url) {
        console.error('Imagen subida pero la URL no está en formData');
        throw new Error('La imagen se ha subido pero no se ha guardado la URL');
      }
      
      console.log('Guardando noticia con los siguientes datos:', {
        titulo: formData.titulo,
        fecha: formData.fecha,
        categoria: formData.categoria || 'No definida',
        imagen_url: formData.imagen_url || 'No hay imagen'
      });
      
      // Crear noticia
      // Note: fecha is handled automatically by the backend service
      const noticia = await crearNoticia({
        titulo: formData.titulo,
        contenido: formData.contenido,
        autor: formData.autor || undefined,
        categoria: formData.categoria || undefined,
        destacada: formData.destacada,
        imagen_url: formData.imagen_url || undefined
      });
      
      console.log('Noticia creada exitosamente con ID:', noticia.id);
      console.log('URL de imagen guardada:', noticia.imagen_url || 'No hay imagen');
      
      // Redirigir a la lista de noticias
      router.push('/dashboard/noticies');
    } catch (error) {
      console.error("Error al crear noticia:", error);
      alert("Ha ocurrido un error al crear la noticia. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout 
      title="Nova notícia" 
      description="Crea una nova notícia per al web"
    >
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/noticies')}
          iconLeft={<ArrowLeft className="h-4 w-4" />}
        >
          Tornar a notícies
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6 space-y-4">
                <FormField
                  label="Títol"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  error={errors.titulo}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contingut<span className="text-red-500">*</span>
                  </label>
                  <div className="mb-2 flex space-x-4">
                    <button
                      type="button"
                      className={`flex items-center px-3 py-1 rounded text-sm ${!isPreview ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setIsPreview(false)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Editor
                    </button>
                    <button
                      type="button"
                      className={`flex items-center px-3 py-1 rounded text-sm ${isPreview ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setIsPreview(true)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Vista prèvia
                    </button>
                  </div>
                  {!isPreview ? (
                    <div className="mb-1">
                      {/* Barra de herramientas del editor */}
                      <div className="flex flex-wrap items-center mb-2 p-1 bg-gray-50 border border-gray-300 rounded-md">
                        {/* Encabezados */}
                        <div className="border-r border-gray-300 pr-2 mr-2 flex space-x-1">
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('h1')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Encapçalament 1"
                          >
                            <span className="font-bold">H1</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('h2')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Encapçalament 2"
                          >
                            <span className="font-bold">H2</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('h3')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Encapçalament 3"
                          >
                            <span className="font-bold">H3</span>
                          </button>
                        </div>
                        
                        {/* Formato de texto */}
                        <div className="border-r border-gray-300 pr-2 mr-2 flex space-x-1">
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('bold')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Negreta"
                          >
                            <span className="font-bold">B</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('italic')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Cursiva"
                          >
                            <span className="italic">I</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('strike')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Ratllat"
                          >
                            <span className="line-through">S</span>
                          </button>
                        </div>
                        
                        {/* Listas */}
                        <div className="border-r border-gray-300 pr-2 mr-2 flex space-x-1">
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('ol')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Llista ordenada"
                          >
                            <span className="font-mono">1.</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('ul')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Llista no ordenada"
                          >
                            <span className="font-mono">•</span>
                          </button>
                        </div>
                        
                        {/* Enlaces e imágenes */}
                        <div className="flex space-x-1">
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('link')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Enllaç"
                          >
                            <span className="underline">URL</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('image')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Imatge"
                          >
                            <span className="font-mono">IMG</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('quote')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Cita"
                          >
                            <span className="font-mono">&quot;&quot;</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('code')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Codi"
                          >
                            <span className="font-mono">{`<>`}</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleToolbarAction('hr')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Línia horitzontal"
                          >
                            <span className="font-mono">―</span>
                          </button>
                        </div>
                      </div>
                      
                      <textarea
                        ref={textareaRef}
                        name="contenido"
                        value={formData.contenido}
                        onChange={handleChange}
                        rows={15}
                        className={`w-full px-3 py-2 border rounded-md font-mono text-sm ${
                          errors.contenido ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        placeholder="Utilitza format Markdown per a donar format al text..."
                      />
                      <div className="mt-1 text-right">
                        <a 
                          href="https://www.markdownguide.org/cheat-sheet/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-red-700 hover:underline"
                        >
                          Guia de Markdown
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden bg-white">
                      {/* Cabecera de vista previa */}
                      <div className="bg-gray-50 p-3 text-sm text-gray-500 border-b flex items-center justify-between">
                        <span>Vista prèvia de com es veurà la notícia publicada</span>
                        <button 
                          type="button" 
                          onClick={() => setIsPreview(false)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium focus:outline-none"
                        >
                          Tornar a l&apos;editor
                        </button>
                      </div>
                      
                      {/* Artículo completo */}
                      <div className="max-w-4xl mx-auto px-4 py-8">
                        {/* Título y fecha */}
                        <div className="mb-6">
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {formData.titulo || "Títol de la notícia"}
                          </h1>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date().toLocaleDateString('ca-ES', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                            {formData.categoria && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                                  {formData.categoria}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Imagen principal */}
                        {(imagePreview || formData.imagen_url) && (
                          <div className="mb-6 rounded-lg overflow-hidden">
                            <Image 
                              src={imagePreview || formData.imagen_url} 
                              alt={formData.titulo} 
                              className="w-full h-auto object-cover max-h-[400px]" 
                              width={800}
                              height={400}
                            />
                          </div>
                        )}
                        
                        {/* Contenido */}
                        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline">
                          {formData.contenido ? (
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeRaw]}
                            >
                              {formData.contenido}
                            </ReactMarkdown>
                          ) : (
                            <p className="text-gray-400 italic">El contingut de la notícia es mostrarà aquí...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {errors.contenido && (
                    <p className="mt-1 text-sm text-red-500">{errors.contenido}</p>
                  )}
                </div>
              </div>
            </Card>
            
            <Card title="Imatge">
              <div className="p-6">
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {imagePreview ? (
                    <div className="relative">
                      <Image 
                        src={imagePreview} 
                        alt="Vista previa" 
                        className="max-h-64 rounded" 
                        width={300}
                        height={200}
                      />
                      <button 
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="mt-2 flex items-center justify-center">
                        {uploadStatus === 'uploading' && (
                          <div className="flex items-center text-amber-600">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm">Subiendo imagen...</span>
                          </div>
                        )}
                        {uploadStatus === 'success' && (
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            <span className="text-sm">Imagen subida correctamente</span>
                          </div>
                        )}
                        {uploadStatus === 'error' && (
                          <div className="flex items-center text-red-600">
                            <X className="h-4 w-4 mr-2" />
                            <span className="text-sm">Error al subir imagen</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-3 py-8 border-2 border-dashed border-gray-300 rounded-md text-center hover:border-red-500 transition-colors"
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        Carrega una imatge
                      </button>
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-500">
                          Formats recomanats: JPG, PNG (màxim 5MB)
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Mida recomanada:</span> 1200x630 píxels (16:9)
                        </p>
                        <p className="text-xs italic text-gray-500">
                          Les imatges horitzontals es veuran millor a la portada i al detall
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {errors.imagen && (
                  <p className="mt-1 text-sm text-red-500">{errors.imagen}</p>
                )}
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card title="Publicació">
              <div className="p-6 space-y-4">
                <FormField
                  label="Data"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  error={errors.fecha}
                  required
                  startIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                />
                
                <FormField
                  label="Autor"
                  name="autor"
                  value={formData.autor}
                  onChange={handleChange}
                  error={errors.autor}
                  placeholder="Nom de l'autor (opcional)"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.categoria ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-red-500`}
                  >
                    <option value="">Selecciona una categoria</option>
                    <option value="Primer Equip">Primer Equip</option>
                    <option value="Femení">Femení</option>
                    <option value="Futbol Base">Futbol Base</option>
                    <option value="Club">Club</option>
                  </select>
                  {errors.categoria && (
                    <p className="mt-1 text-sm text-red-500">{errors.categoria}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="destacada"
                    name="destacada"
                    checked={formData.destacada}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="destacada" className="ml-2 block text-sm text-gray-900">
                    Marcar como destacada
                  </label>
                </div>
              </div>
            </Card>
            
            <div className="flex flex-col gap-3">
              <Button 
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting || uploadStatus === 'uploading'}
                fullWidth
              >
                Crear notícia
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/noticies')}
                fullWidth
              >
                Cancel·lar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
