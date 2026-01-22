export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-xl z-[9999]">
      <div className="flex flex-col items-center gap-6">
        {/* Loader Animation */}
        <div className="relative flex items-center justify-center">
          {/* Гадна талын эргэлддэг цагираг */}
          <div className="h-20 w-20 animate-spin rounded-full border-[3px] border-transparent border-t-[#692d91] border-b-[#692d91]" />
          
          {/* Дотор талын импульс өгдөг дугуй */}
          <div className="absolute h-12 w-12 animate-pulse rounded-full bg-yellow-400 opacity-80 shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          
          {/* Төв хэсэгт байрлах логоны жижиг дүрс эсвэл цэг */}
          <div className="absolute h-4 w-4 rounded-full bg-[#692d91]" />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xl font-black italic uppercase tracking-[0.2em] text-[#692d91] animate-pulse">
            Loading
          </p>
          <div className="h-1 w-12 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}