import { DeviceTypes } from "@skylark-reference-apps/lib";
import { useTailwindBreakpoint } from "./useTailwindBreakpoint";

/**
 * Really simple way to distinguish a mobile vs a desktop
 * Originally designed for simply showing different images on mobile vs desktop
 * @returns {DeviceTypes}
 */
export const useDeviceType = (): DeviceTypes => {
  const [breakpoint] = useTailwindBreakpoint();
  const isSmartphone = ["", "sm"].includes(breakpoint);
  const device: DeviceTypes = isSmartphone ? "smartphone" : "pc";
  return device;
};
