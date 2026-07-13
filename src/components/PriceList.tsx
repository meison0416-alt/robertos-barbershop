import React, { useState, useEffect } from "react";
import { Scissors } from "lucide-react";
import { getPriceList } from "../lib/db";
import { PriceItem } from "../types";

export const PriceList: React.FC = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const list = await getPriceList();
        setPrices(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const getItemsByCategory = (category: string) => {
    return prices
      .filter((p) => p.category === category)
      .sort((a, b) => a.order - b.order);
  };

  if (loading) {
    return (
      <div className="text-center py-20 font-mono text-zinc-500 animate-pulse text-xs uppercase tracking-widest">
        Cargando lista de precios...
      </div>
    );
  }

  const womenItems = getItemsByCategory("women");
  const menItems = getItemsByCategory("men");
  const teenItems = getItemsByCategory("teenagers");
  const boysItems = getItemsByCategory("boys");
  const extraItems = getItemsByCategory("extras");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        
        {/* Columna 1: Damas y Hombres */}
        <div className="space-y-6">
          {/* Damas / Women */}
          {womenItems.length > 0 && (
            <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl border-l-4 border-l-[#d4af37] shadow-xl">
              <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
                <span className="mr-2 text-2xl">👩</span> Damas / Women
              </h2>
              <div className="space-y-2">
                {womenItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-stone-300">{item.name}</span>
                    <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                    <span className="text-[#d4af37] font-bold text-base">${item.price}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hombre / Man */}
          {menItems.length > 0 && (
            <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl shadow-xl border-t-4 border-t-[#795548]">
              <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
                <span className="mr-2 text-2xl">🧔</span> Hombre / Man
              </h2>
              <div className="space-y-2.5">
                {menItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-stone-300">{item.name}</span>
                    <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                    <span className="text-[#d4af37] font-bold text-base">${item.price}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Columna 2: Adolescentes, Niños y Extras */}
        <div className="space-y-6">
          {/* Adolescentes / Teenagers */}
          {teenItems.length > 0 && (
            <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl shadow-xl">
              <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
                <span className="mr-2 text-2xl">🧑</span> Adolescentes / Teenagers
              </h2>
              <div className="space-y-2">
                {teenItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-stone-300">{item.name}</span>
                    <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                    <span className="text-[#d4af37] font-bold text-base">${item.price}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Niños / Boys */}
          {boysItems.length > 0 && (
            <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl border-l-4 border-l-[#d4af37] shadow-xl">
              <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
                <span className="mr-2 text-2xl">🧒</span> Niños / Boys
              </h2>
              <div className="space-y-2">
                {boysItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-stone-300">{item.name}</span>
                    <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                    <span className="text-[#d4af37] font-bold text-base">${item.price}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Extras (Debajo de Niños) */}
          {extraItems.length > 0 && (
            <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl border-t-2 border-t-[#795548] shadow-xl">
              <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
                <span className="mr-2 text-2xl">✨</span> Extras
              </h2>
              <div className="space-y-2">
                {extraItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-stone-300">{item.name}</span>
                    <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                    <span className="text-[#d4af37] font-bold text-base">${item.price}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Columna 3: Espacio decorativo o Logotipo */}
        <div className="hidden lg:block h-full">
          <div className="bg-gradient-to-b from-[#1c1512] to-[#0a0a0a] border border-[#5d4037]/60 hover:border-[#d4af37] rounded-xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden h-full min-h-[350px] shadow-[0_15px_30px_rgba(0,0,0,0.5)] group/logo transition-all duration-300">
            {/* Ambient gold background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
            
            {/* Decorative gold border frame */}
            <div className="absolute inset-4 border border-[#d4af37]/10 rounded-lg pointer-events-none group-hover/logo:border-[#d4af37]/20 transition-all duration-300" />
            
            {/* Scissors Icon */}
            <Scissors className="w-12 h-12 text-[#d4af37] mb-6 stroke-1.2 transition-transform duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-45" />
            
            {/* Elegant Branding text */}
            <div className="relative z-10 space-y-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
              <p className="font-display text-center text-2xl tracking-[0.25em] text-white uppercase font-black leading-none drop-shadow-md">
                Roberto
              </p>
              <p className="font-mono text-center text-[10px] tracking-[0.4em] text-[#d4af37] uppercase font-light">
                BARBERSHOP
              </p>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
            </div>
            
            <p className="mt-8 text-[9px] font-mono tracking-widest text-stone-500 uppercase">
              EST. 2021
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PriceList;
