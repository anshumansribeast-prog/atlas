import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

export function BrandLogo({ size = "md", withText = true }: BrandLogoProps) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textMap = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-atlas-blue via-atlas-violet to-atlas-cyan opacity-40 blur-sm group-hover:opacity-75 transition-opacity duration-300" />
        
        {/* Core Vector Icon */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full p-1"
        >
          {/* Compass / Outer Hex Ring */}
          <polygon
            points="24,3 43,14 43,34 24,45 5,34 5,14"
            className="stroke-atlas-border group-hover:stroke-atlas-blue/60 transition-colors"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          
          {/* Neural Connection Lines */}
          <path d="M24 10L14 24L24 38L34 24L24 10Z" stroke="url(#logo-grad)" strokeWidth="2" strokeLinejoin="round" />
          <line x1="24" y1="10" x2="24" y2="38" stroke="url(#logo-grad)" strokeWidth="1.5" />
          <line x1="14" y1="24" x2="34" y2="24" stroke="url(#logo-grad)" strokeWidth="1.5" />

          {/* Central Knowledge Core */}
          <circle cx="24" cy="24" r="3.5" fill="#36D9E8" className="animate-pulse" />

          {/* Peripheral Knowledge Nodes */}
          <circle cx="24" cy="10" r="2.5" fill="#3987FF" />
          <circle cx="34" cy="24" r="2.5" fill="#895CFF" />
          <circle cx="24" cy="38" r="2.5" fill="#3987FF" />
          <circle cx="14" cy="24" r="2.5" fill="#895CFF" />

          <defs>
            <linearGradient id="logo-grad" x1="14" y1="10" x2="34" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3987FF" />
              <stop offset="0.5" stopColor="#895CFF" />
              <stop offset="1" stopColor="#36D9E8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-heading font-bold tracking-wider text-white ${textMap[size]}`}>
              AI<span className="text-transparent bg-clip-text bg-gradient-to-r from-atlas-blue via-atlas-violet to-atlas-cyan">ATLAS</span>
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-atlas-textMuted font-mono font-medium -mt-0.5">
            Knowledge Engine
          </span>
        </div>
      )}
    </Link>
  );
}
