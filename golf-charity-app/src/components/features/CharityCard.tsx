import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function CharityCard({ id, name, tag }: { id: string, name: string, tag: string }) {
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-48 bg-slate-200 w-full relative">
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold uppercase rounded-full shadow-sm">
            {tag}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{name}</h3>
        <p className="text-slate-600 text-sm mb-6 line-clamp-3">
          Working tirelessly to improve lives and communities across the globe through dedicated funding and on-the-ground support.
        </p>
        <div className="mt-auto pt-4 border-t border-slate-100">
          <Link href={`/charities/${id}`} className="text-blue-600 font-semibold hover:text-blue-800 flex items-center">
            View Impact details &rarr;
          </Link>
        </div>
      </div>
    </Card>
  );
}
