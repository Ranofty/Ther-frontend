import React from "react";
import pumpPng from "./pump.png";
import bonkPng from "./bonk.png";

/**
 * Pump.fun logo — stylized "P" rocket icon in the official green.
 */
export function PumpfunLogo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <img
      src={pumpPng}
      alt="Pump.fun Logo"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className || ""}`}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * LetsBonk.fun logo — stylized BONK dog head in orange.
 */
export function BonkfunLogo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <img
      src={bonkPng}
      alt="LetsBonk.fun Logo"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className || ""}`}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Bags.fm logo — stylized money bag icon in green.
 */
export function BagsfmLogo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="60" fill="#02FF40" />
      {/* Bag body */}
      <path
        d="M36 50C32 62 30 82 36 92C40 98 50 100 60 100C70 100 80 98 84 92C90 82 88 62 84 50L60 44L36 50Z"
        fill="white"
      />
      {/* Bag neck / tie */}
      <path
        d="M44 48C44 48 52 42 60 42C68 42 76 48 76 48"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bag top / opening */}
      <path
        d="M48 42C46 34 50 24 60 24C70 24 74 34 72 42"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Dollar sign */}
      <text
        x="60"
        y="80"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#02FF40"
        fontSize="32"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
      >
        $
      </text>
    </svg>
  );
}

/** Logo lookup map by launchpad ID */
export const LAUNCHPAD_LOGOS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  pumpfun: PumpfunLogo,
  bonkfun: BonkfunLogo,
  bagsfm: BagsfmLogo,
};
