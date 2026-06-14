import React from "react";

export const PriceList: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Main Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        
        {/* Columna 1: Damas y Hombres */}
        <div className="space-y-6">
          {/* Damas / Women */}
          <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl border-l-4 border-l-[#d4af37] shadow-xl">
            <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
              <span className="mr-2 text-2xl">👩</span> Damas / Women
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Corte de Dama / Women's Cut</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$25</span>
              </div>
            </div>
          </section>

          {/* Hombre / Man */}
          <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl shadow-xl border-t-4 border-t-[#795548]">
            <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
              <span className="mr-2 text-2xl">🧔</span> Hombre / Man
            </h2>
            <div className="space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Corte Regular / Regular Cut</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$25</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Corte Fade</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$30</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Corte Fade + Barba / Beard</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$35</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Line up & Beard</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$20</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Color de Barba / Beard Color</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$35</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Diseños / Designs</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$20</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Adulto Mayor / Senior Citizen</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$25</span>
              </div>
            </div>
          </section>
        </div>

        {/* Columna 2: Adolescentes, Niños y Extras */}
        <div className="space-y-6">
          {/* Adolescentes / Teenagers */}
          <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl shadow-xl">
            <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
              <span className="mr-2 text-2xl">🧑</span> Adolescentes / Teenagers
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Regular</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$25</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Fade</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$30</span>
              </div>
            </div>
          </section>

          {/* Niños / Boys */}
          <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl border-l-4 border-l-[#d4af37] shadow-xl">
            <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
              <span className="mr-2 text-2xl">🧒</span> Niños / Boys
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Corte Regular / Regular Cut</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$20</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Corte Fade</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$25</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Corte Fade + Diseño / Design</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$30</span>
              </div>
            </div>
          </section>

          {/* Extras (Debajo de Niños) */}
          <section className="bg-gradient-to-br from-[#1a1412] to-[#0f0f0f] border border-[#5d4037] hover:border-[#d4af37] hover:shadow-[0_10px_20px_rgba(78,52,46,0.3)] transition-all duration-300 p-5 rounded-xl border-t-2 border-t-[#795548] shadow-xl">
            <h2 className="font-display text-xl text-[#d4af37] mb-4 flex items-center tracking-wider font-bold">
              <span className="mr-2 text-2xl">✨</span> Extras
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Cejas / Eyebrows</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$10</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-300">Toalla Caliente / Hot Towel</span>
                <div className="flex-grow border-b border-dotted border-[#8d6e63] mx-2.5 opacity-60"></div>
                <span className="text-[#d4af37] font-bold text-base">$10</span>
              </div>
            </div>
          </section>
        </div>

        {/* Columna 3: Espacio decorativo o Logotipo */}
        <div className="hidden lg:block h-full">
          <div className="p-8 border-2 border-dashed border-[#5d4037] rounded-xl flex flex-col items-center justify-center opacity-40 h-full min-h-[350px]">
            <span className="text-6xl text-[#d4af37] mb-4 animate-pulse">✂️</span>
            <p className="font-display text-center text-xl tracking-widest text-[#d4af37] uppercase font-bold">
              Roberto<br />Barbershop
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PriceList;
