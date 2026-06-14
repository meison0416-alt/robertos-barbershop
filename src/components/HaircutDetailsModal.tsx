import React from "react";
import { Haircut } from "../types";
import { X, Clock, DollarSign, Sliders, ShieldCheck, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface HaircutDetailsModalProps {
  haircut: Haircut;
  onClose: () => void;
  onLike: (id: string, e: any) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function HaircutDetailsModal({
  haircut,
  onClose,
  onLike,
  onNext,
  onPrev
}: HaircutDetailsModalProps) {
  // Keypress listener for arrow keys navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      } else if (e.key === "ArrowRight" && onNext) {
        onNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, onClose]);

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
    <div id="modal-backdrop" className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-zinc-950 border border-gold-400/40 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[16/10] flex flex-col justify-end max-h-[85vh]"
      >
        {/* Close Button top corner */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-35 p-2 bg-black/85 border border-gold-900/40 rounded-full text-gold-300 hover:text-white hover:border-gold-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Full Visuals Section */}
        <div className="w-full h-full relative bg-zinc-950 flex flex-col justify-end group/img">
          <img
            src={haircut.imageUrl}
            alt={haircut.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-550"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
          
          {/* Navigation Arrows */}
          {onPrev && (
            <button
              id="btn-prev-haircut"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 hover:bg-black/95 border border-gold-900/40 hover:border-gold-400 rounded-full text-gold-300 hover:text-white transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover/img:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {onNext && (
            <button
              id="btn-next-haircut"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 hover:bg-black/95 border border-gold-900/40 hover:border-gold-400 rounded-full text-gold-300 hover:text-white transition-all cursor-pointer opacity-100 md:opacity-0 md:group-hover/img:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          
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
      </motion.div>
    </div>
  );
}
