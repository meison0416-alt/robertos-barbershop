import React, { useState, useEffect } from "react";
import { Haircut } from "../types";
import { getHaircuts, addOrUpdateHaircut, uploadHaircutImage } from "../lib/db";
import { 
  KeyRound, 
  UploadCloud, 
  Trash2, 
  DollarSign, 
  Edit3, 
  Check, 
  X, 
  Scissors, 
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  onBack: () => void;
  onRefreshGallery: () => void;
}

export default function AdminPanel({ onBack, onRefreshGallery }: AdminPanelProps) {
  // Auth states
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Business logic states
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [loading, setLoading] = useState(false);

  // Upload Form states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [category, setCategory] = useState<"men" | "women" | "children">("men");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  // Load Inventory
  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await getHaircuts();
      setHaircuts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadInventory();
    }
  }, [isAuthenticated]);

  // Handle Passcode verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "barber2026") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Passcode incorrecto. Inténtalo de nuevo.");
      setPasscode("");
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Handle Upload Submission
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !price || !description) {
      setError("Por favor completa todos los campos y selecciona una imagen.");
      return;
    }

    setUploading(true);
    setUploadSuccess("");
    setError("");

    try {
      // 1. Upload to Storage
      const imageUrl = await uploadHaircutImage(file, category);

      // 2. Save in Firestore
      const newHaircut: Haircut = {
        id: `storage-${category}-${Date.now()}`,
        name,
        category,
        imageUrl,
        price: parseFloat(price),
        duration: 45, // default
        description,
        details: `Corte premium personalizado de la colección de ${category}.`,
        likes: 0
      };

      await addOrUpdateHaircut(newHaircut);

      setUploadSuccess("¡Imagen subida y publicada con éxito!");
      
      // Reset form
      setFile(null);
      setPreviewUrl("");
      setName("");
      setPrice("");
      setDescription("");

      // Reload inventory & notify main gallery
      await loadInventory();
      onRefreshGallery();
    } catch (err: any) {
      setError("Error al subir el corte: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle Editing start
  const startEdit = (cut: Haircut) => {
    setEditingId(cut.id);
    setEditName(cut.name);
    setEditPrice(cut.price.toString());
    setEditDescription(cut.description);
  };

  // Handle Saving edits
  const saveEdit = async (cut: Haircut) => {
    if (!editName || !editPrice || !editDescription) return;

    setSavingId(cut.id);
    try {
      const updatedCut: Haircut = {
        ...cut,
        name: editName,
        price: parseFloat(editPrice),
        description: editDescription
      };
      
      await addOrUpdateHaircut(updatedCut);
      setEditingId(null);
      await loadInventory();
      onRefreshGallery();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center p-6 text-[#e5e5e5]">
        <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(212,175,55,0.04)_0%,transparent_75%]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md w-full bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-gold-900/40 p-8 rounded-2xl shadow-2xl text-center z-10"
        >
          {/* Header */}
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          
          <div className="w-14 h-14 bg-gold-950/20 border border-gold-600/40 rounded-full flex items-center justify-center mx-auto mt-6 mb-6">
            <KeyRound className="w-6 h-6 text-gold-400" />
          </div>
          
          <h2 className="font-display text-xl font-black text-white tracking-[0.2em] uppercase">
            Acceso Administrativo
          </h2>
          <p className="text-xs text-zinc-500 mt-2 font-mono tracking-wider">
            ROBERTO'S BARBERSHOP PORTAL
          </p>
          
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Ingresar Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-black/60 border border-gold-900/30 focus:border-gold-400 focus:outline-none p-4 rounded-xl text-center text-lg tracking-widest text-white transition-colors"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-xs font-mono tracking-wide">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full py-4 bg-gold-500 text-black font-display font-black tracking-[0.2em] uppercase rounded-xl hover:bg-gold-400 transform hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              AUTENTICAR
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-[#e5e5e5] pb-20">
      {/* Admin Subheader Navigation */}
      <section className="bg-gradient-to-b from-[#0f0f0f] to-[#070707] border-b border-gold-900/35 px-6 py-6 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-gold-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Portal Administrativo
            </div>
            <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase mt-1">
              GESTIÓN DE CORTES
            </h2>
          </div>
          
          <button
            onClick={onBack}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-black border border-gold-900/40 rounded-lg text-xs font-mono text-gold-300 hover:text-white hover:border-gold-400 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> VOLVER A LA GALERÍA
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Upload Panel (5 cols) */}
        <section className="lg:col-span-5 bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-gold-900/30 p-6 rounded-2xl shadow-xl h-fit">
          <h3 className="font-display text-lg font-black text-[#d4af37] uppercase tracking-wider mb-6 flex items-center gap-2">
            <UploadCloud className="w-5 h-5" />
            Publicar Nuevo Corte
          </h3>

          <form onSubmit={handleUpload} className="space-y-5">
            {/* File upload zone */}
            <div className="relative border-2 border-dashed border-gold-900/30 hover:border-gold-500/50 rounded-xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center bg-black/40 transition-colors group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 pointer-events-none">
                  <UploadCloud className="w-10 h-10 text-gold-600 mx-auto mb-3 group-hover:text-gold-400 transition-colors" />
                  <span className="text-xs text-stone-300 block font-semibold mb-1">
                    Seleccionar Foto
                  </span>
                  <span className="text-[10px] text-zinc-500 block font-mono">
                    PNG, JPG o WEBP desde macOS
                  </span>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono tracking-widest text-zinc-400 block mb-1.5 uppercase">
                  Categoría / Colección
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["men", "women", "children"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 text-[10px] font-mono tracking-wider uppercase rounded border font-bold transition-all cursor-pointer ${
                        category === cat
                          ? "bg-gold-500 text-black border-gold-400 font-bold"
                          : "bg-black/50 text-zinc-400 border-gold-900/20 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest text-zinc-400 block mb-1 uppercase">
                  Nombre del Estilo
                </label>
                <input
                  type="text"
                  placeholder="Ej. Taper Low Fade"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/50 border border-gold-900/35 focus:border-gold-500 focus:outline-none p-3 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest text-zinc-400 block mb-1 uppercase">
                  Precio (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gold-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    placeholder="35"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black/50 border border-gold-900/35 focus:border-gold-500 focus:outline-none p-3 pl-9 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest text-zinc-400 block mb-1 uppercase">
                  Descripción Corta
                </label>
                <textarea
                  placeholder="Describe las características visuales principales de este estilo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/50 border border-gold-900/35 focus:border-gold-500 focus:outline-none p-3 rounded-lg text-sm text-white h-20 resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-mono text-center">{error}</p>
            )}
            
            {uploadSuccess && (
              <p className="text-green-500 text-xs font-mono text-center">{uploadSuccess}</p>
            )}

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3.5 bg-gold-500 text-black font-display font-black tracking-[0.15em] uppercase rounded-lg transition-all ${
                uploading 
                  ? "opacity-50 cursor-wait" 
                  : "hover:bg-gold-400 transform hover:scale-[1.01] cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)]"
              }`}
            >
              {uploading ? "SUBIENDO..." : "PUBLICAR CORTE"}
            </button>
          </form>
        </section>

        {/* RIGHT COLUMN: Inventory (7 cols) */}
        <section className="lg:col-span-7 bg-[#0b0b0b] border border-gold-900/10 rounded-2xl shadow-xl p-6 flex flex-col">
          <h3 className="font-display text-lg font-black text-[#d4af37] uppercase tracking-wider mb-6 flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            Catálogo & Precios Activos
          </h3>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-20 font-mono text-zinc-500 animate-pulse text-xs uppercase tracking-widest">
                Cargando inventario de cortes...
              </div>
            ) : haircuts.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 text-sm">
                No hay cortes en el inventario actual.
              </div>
            ) : (
              haircuts.map((cut) => {
                const isEditing = editingId === cut.id;
                
                return (
                  <div 
                    key={cut.id}
                    className="p-4 bg-black/60 border border-gold-900/20 rounded-xl flex gap-4 items-center justify-between"
                  >
                    <div className="flex gap-4 items-center flex-grow">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gold-900/20 bg-zinc-950 flex-shrink-0">
                        <img 
                          src={cut.imageUrl} 
                          alt={cut.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono tracking-widest text-[#d4af37] uppercase bg-[#1a1412] px-1.5 py-0.5 border border-gold-900/40 rounded-sm">
                            {cut.category}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">
                            {cut.id.startsWith("storage-") ? "subido por barber" : "sistema"}
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="space-y-2 mt-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-zinc-900 border border-gold-900/40 p-2 rounded text-xs text-white"
                            />
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full bg-zinc-900 border border-gold-900/40 p-2 rounded text-xs text-stone-300 h-12 resize-none"
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className="font-display font-bold text-white text-sm tracking-wide mt-1.5 truncate">
                              {cut.name}
                            </h4>
                            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-sans leading-tight">
                              {cut.description}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0 ml-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#d4af37] font-bold text-sm">$</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-16 bg-zinc-900 border border-gold-900/40 p-2 rounded text-xs text-center text-white"
                          />
                        </div>
                      ) : (
                        <span className="text-[#d4af37] font-display font-black text-base">
                          ${cut.price}
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(cut)}
                              disabled={savingId === cut.id}
                              className="p-2 bg-gold-950/20 hover:bg-gold-500 border border-gold-800 hover:border-gold-400 text-gold-300 hover:text-black rounded-lg transition-all cursor-pointer"
                              title="Guardar"
                            >
                              {savingId === cut.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-stone-400 hover:text-white rounded-lg transition-all cursor-pointer"
                              title="Cancelar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(cut)}
                            className="p-2 bg-gold-950/10 hover:bg-gold-950/30 border border-gold-900/40 hover:border-[#d4af37]/60 text-gold-400 hover:text-white rounded-lg transition-all cursor-pointer"
                            title="Editar Precio y Detalles"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
