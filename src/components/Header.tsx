export default function Header() {
  return (
    <header id="main-header" className="sticky top-0 z-50 bg-[#070707]/90 backdrop-blur-md border-b border-gold-900/40 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 border-2 border-gold-400 flex items-center justify-center rounded-sm shadow-md bg-black">
            <span className="text-gold-400 font-display text-2xl font-black">R</span>
          </div>
          <div>
            <h1 className="font-display text-lg md:text-xl font-black tracking-[0.2em] gold-shimmer select-none leading-none">
              ROBERTO'S BARBERSHOP
            </h1>
          </div>
        </div>

      </div>
    </header>
  );
}
