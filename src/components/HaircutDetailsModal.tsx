import React from "react";
import { Haircut } from "../types";
import { X, Clock, DollarSign, Sliders, ShieldCheck, Heart } from "lucide-react";
import { motion } from "motion/react";

interface HaircutDetailsModalProps {
  haircut: Haircut;
  onClose: () => void;
  onLike: (id: string, e: any) => void;
}

export default function HaircutDetailsModal({
  haircut,
  onClose,
  onLike
}: HaircutDetailsModalProps) {
  // Extract custom parameters or fallback with gorgeous default data tailored to the style
  const getStylingGuidelines = (styleName: string) => {
    const defaultData = {
      faceShapes: ["Oval", "Square", "Chiseled", "Diamond"],
      hairType: "Straight, Wavy, or Coarse texture",
      stylingProducts: "Premium hybrid matte clay or low-shine pomade",
      maintenance: "High (Requires fresh trims every 2 - 3 weeks to keep gradients crisp)",
      tips: "Blow-dry upward from root with medium heat, apply clay evenly from back to front, and arrange tip textures by twisting with fingers."
    };

    if (styleName.toLowerCase().includes("fade") || styleName.toLowerCase().includes("undercut")) {
      return {
        faceShapes: ["Square", "Oval", "Heart Shape"],
        hairType: "Thick, Medium volume, straight or wavy",
        stylingProducts: "Water-based high-hold pomade or texture powder",
        maintenance: "Very High (Needs side maintenance every 10-14 days)",
        tips: "Use a blow dryer with a nozzle concentrator directed upwards to secure natural height before layering clay."
      };
    } else if (styleName.toLowerCase().includes("bob") || styleName.toLowerCase().includes("pixie") || styleName.toLowerCase().includes("fringe")) {
      return {
        faceShapes: ["Oval", "Round", "Oblong"],
        hairType: "Fine, Medium, or soft wave fibers",
        stylingProducts: "Light-weight texturizing spray, sea salt mist, or light oil",
        maintenance: "Medium (Requires shaping every 4-6 weeks to retain weight line)",
        tips: "Dry naturally to about 80%, then apply sea salt spray and scrunch with your hands to invite organic movement."
      };
    }

    return defaultData;
  };

  const guidelines = getStylingGuidelines(haircut.name);

  return (
    <div id="modal-backdrop" className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-[#0d0d0d] border border-gold-400/40 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Close Button top corner */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black border border-gold-900/40 rounded-full text-gold-300 hover:text-white hover:border-gold-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Style Visuals */}
        <div className="w-full md:w-1/2 relative min-h-[250px] md:min-h-full bg-zinc-950 flex flex-col justify-end">
          <img
            src={haircut.imageUrl}
            alt={haircut.name}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-black/20" />
          
          <div className="relative p-6 md:p-8 z-10">
            <span className="text-[10px] font-mono tracking-[0.2em] text-white uppercase py-1 px-2.5 bg-gold-600/80 border border-gold-500/40 rounded-sm">
              {haircut.category} COLLECTION
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-black text-white mt-4 leading-tight tracking-wide drop-shadow-md">
              {haircut.name}
            </h2>
            
            <div className="flex gap-4 items-center mt-3 text-xs font-mono font-bold text-gold-200">
              <span className="flex items-center gap-1 bg-black/80 p-2 py-1 border border-gold-700/35 rounded-sm">
                <DollarSign className="w-4 h-4 text-gold-400" />
                {haircut.price} USD ESTIMATION
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Styling Encyclopedia */}
        <div id="modal-details-side" className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gold-900/20 pb-4">
              <span className="text-stone-400 text-xs font-mono tracking-widest uppercase">STYLING MANUAL & INTEL</span>
              
              <button
                id={`btn-like-detail-${haircut.id}`}
                onClick={(e) => onLike(haircut.id, e)}
                className="flex items-center gap-1 px-3 py-1 bg-gold-950/20 hover:bg-rose-950/20 border border-gold-900/30 hover:border-rose-900/40 rounded-lg text-xs font-mono text-zinc-300 hover:text-rose-300 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{haircut.likes} SAVED</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-mono font-extrabold tracking-widest uppercase text-gold-500">
                AESTHETIC DESCRIPTION
              </h4>
              <p className="text-xs font-sans text-stone-300 leading-relaxed">
                {haircut.details || haircut.description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-xl border border-gold-900/10">
              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-0.5">ESTIMATED COMPOSURE</span>
                <span className="text-xs text-white font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  {haircut.duration} Minutes
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-0.5">MAINTENANCE CYCLE</span>
                <span className="text-xs text-stone-300 block leading-tight">{guidelines.maintenance}</span>
              </div>
            </div>

            {/* In-depth styling guidelines */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-mono font-extrabold tracking-widest uppercase text-gold-500 border-b border-gold-900/20 pb-1 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Compatibility & Styling Tools
              </h4>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block mb-1">SUITABLE FACE FRAMING:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {guidelines.faceShapes.map((shape) => (
                      <span key={shape} className="bg-gold-950/30 text-gold-200 border border-gold-900/40 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono">
                        {shape}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block mb-0.5">FIBRE & HAIR TYPE:</span>
                  <span className="text-stone-300 font-sans">{guidelines.hairType}</span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block mb-0.5">RECOMMENDED STYLING MAT:</span>
                  <span className="text-stone-300 font-sans italic">{guidelines.stylingProducts}</span>
                </div>

                <div className="pt-2 bg-gradient-to-r from-gold-950/20 to-transparent p-3 rounded-lg border-l-2 border-gold-500">
                  <span className="text-[10px] text-gold-400 font-mono font-bold block mb-1">PRO SALON STYLING TIP:</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed italic">
                    "{guidelines.tips}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gold-900/20 text-center">
            <span className="text-[9px] text-zinc-600 font-mono flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
              ROBERTO'S BARBERSHOP STYLE REGISTRY
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
