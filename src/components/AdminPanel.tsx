import React, { useState, useEffect } from "react";
import { Haircut, PriceItem } from "../types";
import { 
  getHaircuts, 
  addOrUpdateHaircut, 
  uploadHaircutImage, 
  deleteHaircut,
  getPriceList,
  updatePriceItem
} from "../lib/db";
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
  Sparkles,
  ClipboardList,
  Image as ImageIcon
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

  // Tabs: "gallery" manages uploaded haircut cards, "prices" manages the pricelist menu
  const [activeTab, setActiveTab] = useState<"gallery" | "prices">("gallery");

  // Gallery Management States
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [loadingCuts, setLoadingCuts] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [category, setCategory] = useState<"men" | "women" | "children">("men");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Price List Menu Management States
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [editingPriceItemId, setEditingPriceItemId] = useState<string | null>(null);
  const [editPriceItemPrice, setEditPriceItemPrice] = useState("");
  const [savingPriceItemId, setSavingPriceItemId] = useState<string | null>(null);

  // Load Inventory (Gallery & Price List)
  const loadInventory = async () => {
    setLoadingCuts(true);
    try {
      const data = await getHaircuts();
      setHaircuts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCuts(false);
    }
  };

  const loadPriceItemsList = async () => {
    setLoadingPrices(true);
    try {
      const data = await getPriceList();
      setPriceItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPrices(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "gallery") {
        loadInventory();
      } else {
        loadPriceItemsList();
      }
    }
  }, [isAuthenticated, activeTab]);

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
    if (!file || !price) {
      setError("Por favor selecciona una imagen e ingresa el precio.");
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
        name: "Exclusive Style",
        category,
        imageUrl,
        price: parseFloat(price),
        duration: 45,
        description: "Exclusive custom haircut from our portfolio.",
        details: `Corte premium de la colección de ${category}.`,
        likes: 0
      };

      await addOrUpdateHaircut(newHaircut);

      setUploadSuccess("¡Imagen subida y publicada con éxito!");
      
      // Reset form
      setFile(null);
      setPreviewUrl("");
      setPrice("");

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
    setEditPrice(cut.price.toString());
  };

  // Handle Saving edits
  const saveEdit = async (cut: Haircut) => {
    if (!editPrice) return;

    setSavingId(cut.id);
    try {
      const updatedCut: Haircut = {
        ...cut,
        price: parseFloat(editPrice)
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

  // Handle Deleting haircut
  const handleDelete = async (cut: Haircut) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este corte de la galería?")) {
      return;
    }
    setDeletingId(cut.id);
    try {
      await deleteHaircut(cut.id, cut.imageUrl, cut.category);
      await loadInventory();
      onRefreshGallery();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle Price Menu Items Edit
  const startPriceItemEdit = (item: PriceItem) => {
    setEditingPriceItemId(item.id);
    setEditPriceItemPrice(item.price.toString());
  };

  const savePriceItemEdit = async (item: PriceItem) => {
    if (!editPriceItemPrice) return;
    setSavingPriceItemId(item.id);
    try {
      const updated: PriceItem = {
        ...item,
        price: parseFloat(editPriceItemPrice)
      };
      await updatePriceItem(updated);
      setEditingPriceItemId(null);
      await loadPriceItemsList();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPriceItemId(null);
    }
  };

  // Group price items by category for layout
  const groupedPriceItems = () => {
    const groups: { [key: string]: PriceItem[] } = {
      women: [],
      men: [],
      teenagers: [],
      boys: [],
      extras: []
    };
    priceItems.forEach(item => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    });
    // Sort items inside groups by order
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => a.order - b.order);
    });
    return groups;
  };

  const categoriesMap: { [key: string]: string } = {
    women: "👩 Damas / Women",
    men: "🧔 Hombres / Men",
    teenagers: "🧑 Adolescentes / Teenagers",
    boys: "🧒 Niños / Boys",
    extras: "✨ Extras / Services"
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-gold-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Portal Administrativo
            </div>
            <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase mt-1">
              CONTROL DE BARBERÍA
            </h2>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex bg-black/60 p-1 border border-gold-900/20 rounded-lg max-w-sm">
            <button
              onClick={() => setActiveTab("gallery")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-gold-500 text-black font-bold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Fotos / Galería
            </button>
            <button
              onClick={() => setActiveTab("prices")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                activeTab === "prices"
                  ? "bg-gold-500 text-black font-bold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Lista de Precios
            </button>
          </div>
          
          <button
            onClick={onBack}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 bg-black border border-gold-900/40 rounded-lg text-xs font-mono text-gold-300 hover:text-white hover:border-gold-400 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> VOLVER A LA GALERÍA
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <AnimatePresence mode="wait">
          {activeTab === "gallery" ? (
            /* GALLERY VIEW TAB */
            <motion.div
              key="gallery-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* LEFT COLUMN: Upload Panel */}
              <section className="lg:col-span-5 bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-gold-900/30 p-6 rounded-2xl shadow-xl h-fit">
                <h3 className="font-display text-lg font-black text-[#d4af37] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5" />
                  Publicar Nuevo Corte
                </h3>

                <form onSubmit={handleUpload} className="space-y-5">
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

              {/* RIGHT COLUMN: Inventory Grid */}
              <section className="lg:col-span-7 bg-[#0b0b0b] border border-gold-900/10 rounded-2xl shadow-xl p-6 flex flex-col">
                <h3 className="font-display text-lg font-black text-[#d4af37] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Scissors className="w-5 h-5" />
                  Catálogo & Precios Activos
                </h3>

                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingCuts ? (
                    <div className="text-center py-20 font-mono text-zinc-500 animate-pulse text-xs uppercase tracking-widest">
                      Cargando catálogo...
                    </div>
                  ) : haircuts.length === 0 ? (
                    <div className="text-center py-20 text-zinc-600 text-sm">
                      No hay fotos en el catálogo.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(["men", "women", "children"] as const).map((cat) => {
                        const catCuts = haircuts.filter(c => c.category === cat);
                        return (
                          <div key={cat} className="space-y-3">
                            <h4 className="font-display text-[#d4af37] font-bold text-xs border-b border-gold-900/10 pb-1.5 uppercase tracking-widest text-center bg-black/40 py-2 rounded-t-lg">
                              {cat === "men" ? "Hombres" : cat === "women" ? "Damas" : "Niños"}
                            </h4>
                            {catCuts.length === 0 ? (
                              <p className="text-[10px] text-zinc-600 text-center italic uppercase tracking-wider py-4">Vacío</p>
                            ) : (
                              catCuts.map((cut) => {
                                const isEditing = editingId === cut.id;
                                const isDeleting = deletingId === cut.id;
                                
                                return (
                                  <div 
                                    key={cut.id}
                                    className="p-3 bg-black/60 border border-gold-900/20 rounded-xl flex flex-col gap-3 animate-fadeIn"
                                  >
                                    <div className="flex gap-3 items-center">
                                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gold-900/20 bg-zinc-950 flex-shrink-0">
                                        <img 
                                          src={cut.imageUrl} 
                                          alt={cut.name} 
                                          className="w-full h-full object-cover" 
                                        />
                                      </div>
                                      
                                      <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[7px] font-mono text-zinc-500 uppercase">
                                            {cut.id.startsWith("storage-") ? "Subido" : "Sistema"}
                                          </span>
                                        </div>
                                        <h4 className="font-display font-bold text-white text-[11px] tracking-wide mt-1 line-clamp-2 leading-tight">
                                          {cut.id.startsWith("storage-") ? "Foto Personalizada" : cut.name}
                                        </h4>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gold-900/10">
                                      <div className="flex items-center">
                                        {isEditing ? (
                                          <div className="flex items-center gap-1">
                                            <span className="text-[#d4af37] font-bold text-xs">$</span>
                                            <input
                                              type="number"
                                              value={editPrice}
                                              onChange={(e) => setEditPrice(e.target.value)}
                                              className="w-12 bg-zinc-900 border border-gold-900/40 p-1 rounded text-xs text-center text-white focus:outline-none focus:border-gold-500"
                                            />
                                          </div>
                                        ) : (
                                          <span className="text-[#d4af37] font-display font-black text-sm">
                                            ${cut.price}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-1.5">
                                        {isEditing ? (
                                          <>
                                            <button
                                              onClick={() => saveEdit(cut)}
                                              disabled={savingId === cut.id}
                                              className="p-1.5 bg-gold-950/20 hover:bg-gold-500 border border-gold-800 hover:border-gold-400 text-gold-300 hover:text-black rounded transition-all cursor-pointer"
                                              title="Guardar"
                                            >
                                              {savingId === cut.id ? (
                                                <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                              ) : (
                                                <Check className="w-3 h-3" />
                                              )}
                                            </button>
                                            <button
                                              onClick={() => setEditingId(null)}
                                              className="p-1.5 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-stone-400 hover:text-white rounded transition-all cursor-pointer"
                                              title="Cancelar"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              onClick={() => startEdit(cut)}
                                              className="p-1.5 bg-gold-950/10 hover:bg-gold-950/30 border border-gold-900/40 hover:border-[#d4af37]/60 text-gold-400 hover:text-white rounded transition-all cursor-pointer"
                                              title="Editar Precio"
                                            >
                                              <Edit3 className="w-3 h-3" />
                                            </button>
                                            <button
                                              onClick={() => handleDelete(cut)}
                                              disabled={isDeleting}
                                              className="p-1.5 bg-red-950/10 hover:bg-red-650 border border-red-900/40 hover:border-red-500 text-red-400 hover:text-white rounded transition-all cursor-pointer"
                                              title="Eliminar de la Galería"
                                            >
                                              {isDeleting ? (
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                              ) : (
                                                <Trash2 className="w-3 h-3" />
                                              )}
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : (
            /* PRICE LIST EDIT VIEW */
            <motion.div
              key="prices-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#0b0b0b] border border-gold-900/15 p-6 rounded-2xl shadow-xl max-w-4xl mx-auto"
            >
              <h3 className="font-display text-lg font-black text-[#d4af37] uppercase tracking-wider mb-6 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Edición de Menú de Precios
              </h3>

              {loadingPrices ? (
                <div className="text-center py-20 font-mono text-zinc-500 animate-pulse text-xs uppercase tracking-widest">
                  Cargando menú de precios...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(groupedPriceItems()).map(([catKey, items]) => {
                    if (items.length === 0) return null;
                    
                    return (
                      <div key={catKey} className="space-y-3">
                        <h4 className="font-display text-[#d4af37] font-bold text-xs border-b border-gold-900/10 pb-1.5 uppercase tracking-widest text-center bg-black/40 py-2 rounded-t-lg">
                          {categoriesMap[catKey] || catKey}
                        </h4>
                        
                        <div className="space-y-3">
                          {items.map((item) => {
                            const isEditingItem = editingPriceItemId === item.id;
                            const isSavingItem = savingPriceItemId === item.id;
                            
                            return (
                              <div 
                                key={item.id}
                                className="p-3.5 bg-black/40 border border-gold-950/20 rounded-lg flex items-center justify-between gap-4"
                              >
                                <span className="text-xs font-semibold text-stone-300 truncate">
                                  {item.name}
                                </span>
                                
                                <div className="flex items-center gap-3.5 flex-shrink-0">
                                  {isEditingItem ? (
                                    <div className="flex items-center gap-1">
                                      <span className="text-[#d4af37] font-bold text-xs">$</span>
                                      <input
                                        type="number"
                                        value={editPriceItemPrice}
                                        onChange={(e) => setEditPriceItemPrice(e.target.value)}
                                        className="w-14 bg-zinc-900 border border-gold-900/40 p-1.5 rounded text-xs text-center text-white focus:outline-none"
                                        autoFocus
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-[#d4af37] font-mono text-xs font-bold">
                                      ${item.price}
                                    </span>
                                  )}

                                  <div className="flex items-center gap-1.5">
                                    {isEditingItem ? (
                                      <>
                                        <button
                                          onClick={() => savePriceItemEdit(item)}
                                          disabled={isSavingItem}
                                          className="p-1.5 bg-gold-950/20 hover:bg-gold-500 border border-gold-800 hover:border-gold-400 text-gold-300 hover:text-black rounded transition-all cursor-pointer"
                                          title="Guardar"
                                        >
                                          {isSavingItem ? (
                                            <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                          ) : (
                                            <Check className="w-3 h-3" />
                                          )}
                                        </button>
                                        <button
                                          onClick={() => setEditingPriceItemId(null)}
                                          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-stone-400 hover:text-white rounded transition-all cursor-pointer"
                                          title="Cancelar"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => startPriceItemEdit(item)}
                                        className="p-1.5 bg-gold-950/10 hover:bg-gold-950/30 border border-gold-900/40 hover:border-gold-400 text-gold-400 hover:text-white rounded transition-all cursor-pointer"
                                        title="Editar precio de servicio"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
