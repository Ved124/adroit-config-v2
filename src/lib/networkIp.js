// src/lib/networkIp.js
// Finds this machine's LAN IP for "Exhibition WiFi Mode" — the address other
// devices on the same venue WiFi use to reach this laptop. Machines often
// have multiple active network interfaces (VPN/Tailscale, Docker, WSL,
// virtual adapters) alongside the real WiFi adapter; os.networkInterfaces()
// enumeration order has no guaranteed relationship to which one is the
// actual venue WiFi. Standard home/office/venue routers hand out 192.168.x.x
// addresses, so that range is checked first; anything else is only used as a
// last-resort fallback so this never returns nothing.
import { networkInterfaces } from "os";

export function getNetworkIP() {
  const interfaces = networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal && iface.address.startsWith("192.168")) {
        return iface.address;
      }
    }
  }

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "localhost";
}
