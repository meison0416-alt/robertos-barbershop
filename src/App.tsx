import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HaircutCard from "./components/HaircutCard";
import HaircutDetailsModal from "./components/HaircutDetailsModal";
import { getHaircuts, INITIAL_HAIRCUTS } from "./lib/db";
import { Haircut } from "./types";
import { ShieldCheck, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [haircuts, setHaircuts] = useState<Haircut[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("men");
  
  // Select overlays
  const [selectedHaircut, setSelectedHaircut] = useState<Haircut | null>(null);
  
  // Feedback
  const [notification, setNotification] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state from Database
  const fetchState = async () => {
    setLoading(true);
    try {
      const uCuts = await getHaircuts();
      if (uCuts && uCuts.length > 0) {
        setHaircuts(uCuts);
      } else {
        setHaircuts(INITIAL_HAIRCUTS);
      }
    } catch (e) {
      console.error(e);
      setHaircuts(INITIAL_HAIRCUTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  const handleLike = async (id: string, e: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    // Likes are no longer displayed on cards or active in main flow, but we retain helper for the detail modal if needed
    if (selectedHaircut && selectedHaircut.id === id) {
      setSelectedHaircut(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  // Filter styles
  const filteredHaircuts = haircuts.filter((cut) => {
    return cut.category === categoryFilter;
  });

  return (
    <div id="app-root" className="min-h-screen bg-[#070707] flex flex-col justify-between selection:bg-gold-500 selection:text-black text-[#e5e5e5]">
      
      {/* Header element */}
      <Header />

      {/* Dynamic Toast Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            id="floating-notification"
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 px-5 py-3 bg-[#0e0e0e] border border-gold-400 text-gold-100 text-xs font-mono tracking-wider shadow-2xl rounded-lg flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-gold-400 animate-pulse" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content body */}
      <main className="flex-grow pb-16">
        
        <div id="main-catalog-tabs">
          
          <div id="tab-content-catalog">
            {/* Hero Banner Intro */}
            <section id="hero-banner-showcase" className="relative h-[240px] md:h-[300px] bg-[#080808] flex items-center justify-center p-6 text-center border-b border-gold-950/20">
              <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%]" />
              
              <div className="relative max-w-3xl space-y-4">
                <span className="text-[10px] font-mono tracking-[0.25em] text-gold-400 uppercase flex items-center justify-center gap-2">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  STYLE PORTFOLIO
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-black text-white tracking-widest leading-none uppercase">
                  HAIRCUT GALLERY
                </h2>
                <p className="text-xs md:text-sm text-zinc-400 tracking-wide font-sans max-w-xl mx-auto leading-relaxed">
                  Browse our curated collection of professional, classic, and modern haircut designs tailored for Men, Women, and Children.
                </p>
              </div>
            </section>

            {/* Filters Row Component */}
            <section id="catalog-filters-row" className="max-w-7xl mx-auto px-6 py-10 flex justify-center border-b border-gold-900/10">
              {/* Category Filter Chips (Bigger Tabs) */}
              <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap justify-center w-full max-w-4xl">
                {[
                  { id: "men", label: "MEN" },
                  { id: "women", label: "WOMEN" },
                  { id: "children", label: "CHILDREN" }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    id={`filter-chip-${chip.id}`}
                    onClick={() => setCategoryFilter(chip.id)}
                    className={`flex-1 min-w-[140px] max-w-[240px] text-center py-4 px-6 md:px-8 rounded-lg border text-xs sm:text-sm font-display font-black tracking-[0.25em] uppercase transition-all duration-300 transform cursor-pointer ${
                      categoryFilter === chip.id
                        ? "bg-gold-500 text-black border-gold-400 font-black shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-105"
                        : "bg-[#0b0b0b] text-stone-400 border-gold-900/30 hover:border-gold-500/60 hover:text-white hover:bg-zinc-900 hover:scale-[1.02]"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Gallery Card Grid */}
            <section id="catalog-cards-grid" className="max-w-7xl mx-auto px-6 py-10">
              {loading ? (
                <div className="text-center py-20 font-mono text-zinc-400 animate-pulse text-xs tracking-widest uppercase">
                  Seeding & cataloging authentic haircuts...
                </div>
              ) : filteredHaircuts.length === 0 ? (
                <div id="no-filtered-results" className="text-center py-24 border border-dashed border-gold-950/50 rounded-xl bg-black/10 p-10">
                  <HelpCircle className="w-10 h-10 text-gold-600 mx-auto mb-4" />
                  <h4 className="font-display text-md text-white font-semibold">No Matches Uncovered</h4>
                  <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    We couldn't locate styling templates in the <span className="text-gold-200 font-mono">"{categoryFilter}"</span> category. Try another collection!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredHaircuts.map((cut) => (
                    <HaircutCard
                      key={cut.id}
                      haircut={cut}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

        </div>

      </main>

      {/* --- FLOATING OVERLAYS MODALS --- */}
      
      {/* Haircut Details Modal overlay */}
      <AnimatePresence>
        {selectedHaircut && (
          <HaircutDetailsModal
            haircut={selectedHaircut}
            onClose={() => setSelectedHaircut(null)}
            onLike={handleLike}
          />
        )}
      </AnimatePresence>

      {/* Salon Footer */}
      <footer id="app-footer" className="bg-[#080808] border-t border-gold-900/20 py-8 px-6 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="font-display tracking-[0.3em] text-gold-500/80 uppercase text-xs">
            ROBERTO'S BARBERSHOP
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] text-zinc-650 tracking-wider">
            <span>AVAILABLE TODAY</span>
            <span>•</span>
            <span>HOURS: 8:00 AM - 6:00 PM</span>
            <span>•</span>
            <span>849 SOUNDVIEW AVENUE, BRONX, NY, 10473</span>
          </div>
          <div className="h-px w-10 bg-gold-900/30 mx-auto" />
          <p className="text-[9px] text-zinc-600">
            © 2026 Roberto's Barbershop. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
