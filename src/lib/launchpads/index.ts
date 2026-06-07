import { pumpfunAdapter, bonkfunAdapter } from "./pumpportal";
import { bagsfmAdapter } from "./bagsfm";
import type { LaunchpadAdapter, LaunchpadId } from "./types";

export const LAUNCHPADS: LaunchpadAdapter[] = [
  pumpfunAdapter,
  bonkfunAdapter,
  bagsfmAdapter,
];

export function getLaunchpad(id: LaunchpadId): LaunchpadAdapter | undefined {
  return LAUNCHPADS.find((lp) => lp.id === id);
}

export * from "./types";
