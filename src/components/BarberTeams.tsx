import { INITIAL_BARBERS } from "../lib/db";
import { Sparkles, Trophy, Scissors } from "lucide-react";
import { motion } from "motion/react";

export default function BarberTeams() {
  return (
    <div id="barber-team-panel" className="space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[11px] font-mono tracking-[0.25em] text-gold-400 uppercase flex items-center justify-center gap-2">
          <Scissors className="w-4 h-4" />
          The Masters of Shears
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
          Meet Your Master Artisans
        </h2>
        <div className="h-0.5 w-16 bg-gold-500 mx-auto" />
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          Our professionals combine decades of traditional salon expertise with hyper-precision razor fades and modern hair architecture to give you a golden look.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {INITIAL_BARBERS.map((barber, index) => (
          <motion.div
            id={`barber-card-${barber.id}`}
            key={barber.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="group bg-[#0e0e0e] border border-gold-900/10 hover:border-gold-500 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col items-center p-6 text-center"
          >
            {/* Avatar Circle */}
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gold-400 p-0.5 bg-black mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img
                src={barber.avatarUrl}
                alt={barber.name}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            <span className="text-[9px] font-mono tracking-widest text-gold-400 uppercase bg-gold-950/40 px-2 py-0.5 border border-gold-900/30 rounded-full mb-1">
              {barber.specialty}
            </span>

            <h3 className="font-display text-sm font-bold text-white tracking-wide group-hover:text-gold-300 transition-colors">
              {barber.name}
            </h3>
            
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
              {barber.role}
            </p>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              {barber.bio}
            </p>

            <div className="w-full border-t border-gold-900/10 pt-4 mt-4 flex items-center justify-center gap-1.5 text-zinc-500 text-[10px] font-mono">
              <Trophy className="w-3.5 h-3.5 text-gold-600" />
              <span>CERTIFIED AUREUM PROFESSIONAL</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
