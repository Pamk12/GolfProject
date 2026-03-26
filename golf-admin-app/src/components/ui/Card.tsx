import { cn } from "@/lib/utils";
import React from "react";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("bg-white rounded-2xl shadow-sm border border-slate-100", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
