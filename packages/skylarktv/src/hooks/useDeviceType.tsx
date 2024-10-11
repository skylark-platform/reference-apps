import { DeviceTypes } from "../lib/interfaces";
import { useTailwindBreakpoint } from "./useTailwindBreakpoint";

/**
 * Really simple way to distinguish a mobile vs a desktop
 * Originally designed for simply showing different images on mobile vs desktop
 * @returns {DeviceTypes}
 */
export const useDeviceType = (): {
  deviceType?: DeviceTypes;
  isLoading: boolean;
} => {
  const [breakpoint] = useTailwindBreakpoint();
  const isSmartphone = ["", "sm"].includes(breakpoint as string);
  const isLoading = breakpoint === undefined;
  const deviceType: DeviceTypes = isSmartphone
    ? DeviceTypes.Smartphone
    : DeviceTypes.PC;
  return { isLoading, deviceType: isLoading ? undefined : deviceType };
};
