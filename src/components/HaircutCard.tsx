import React from "react";
import { Haircut } from "../types";
import { motion } from "motion/react";

interface HaircutCardProps {
  haircut: Haircut;
  onClick?: () => void;
}

export const HaircutCard: React.FC<HaircutCardProps> = ({ haircut, onClick }) => {
  return (
    <motion.div
      id={`haircut-card-${haircut.id}`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className="group relative bg-[#0e0e0e] border border-gold-900/30 hover:border-gold-400/80 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 col-span-1 cursor-pointer"
    >
      {/* Haircut image wrapper */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={haircut.imageUrl}
          alt={haircut.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Invisible default overlay, fades in with name and category on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <p className="text-[10px] font-mono tracking-[0.25em] text-gold-400 uppercase mb-1">
            {haircut.category} Collection
          </p>
          <h3 className="font-display text-base font-bold text-white tracking-wider uppercase">
            {haircut.name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default HaircutCard;

