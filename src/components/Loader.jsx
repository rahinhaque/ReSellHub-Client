import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] gap-4">
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-20" />
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      </div>
      <p className="text-sm font-semibold tracking-widest text-emerald-600 uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
}
