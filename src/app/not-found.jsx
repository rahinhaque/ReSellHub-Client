import Link from "next/link";
import { Home, Compass, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-8 sm:p-16 rounded-3xl shadow-2xl flex flex-col items-center text-center">
        {/* Attractive Illustration Section */}
        <div className="relative mb-8 flex items-center justify-center">
          <h1 className="text-[8rem] sm:text-[12rem] font-black text-slate-100 tracking-tighter drop-shadow-sm select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center gap-4">
            <Compass className="w-20 h-20 sm:w-32 sm:h-32 text-emerald-500 animate-pulse" strokeWidth={1.5} />
            <MapPinOff className="w-16 h-16 sm:w-24 sm:h-24 text-blue-400 -mt-8 rotate-12" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you took a wrong turn!
        </p>

        {/* Back To Home Button */}
        <Link
          href="/"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-emerald-500 rounded-2xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
          <Home className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform duration-300" />
          <span className="relative">Back To Home</span>
        </Link>
      </div>
    </div>
  );
}
