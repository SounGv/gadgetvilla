import {
  Armchair, Keyboard, Mouse, Headphones, Grid2x2, Gamepad2, Webcam, Video,
  Server, Zap, Plug, BatteryCharging, LayoutGrid, Usb, Monitor, MonitorSmartphone,
  Cable, Bluetooth, MemoryStick, type LucideIcon,
} from 'lucide-react';

export interface Category {
  slug: string;
  name: string;
  brand: 'fantech' | 'ugreen';
  icon: LucideIcon;
}

// หมวดสินค้าจริงที่จำหน่ายเท่านั้น (Fantech + UGREEN) — ไม่มี SSD/RAM/CPU/Mainboard/VGA
export const categories: Category[] = [
  // ── FANTECH · Gaming ──
  { slug: 'gaming-chair', name: 'เก้าอี้เกมมิ่ง', brand: 'fantech', icon: Armchair },
  { slug: 'keyboard', name: 'คีย์บอร์ด', brand: 'fantech', icon: Keyboard },
  { slug: 'mouse', name: 'เมาส์', brand: 'fantech', icon: Mouse },
  { slug: 'headset', name: 'หูฟัง', brand: 'fantech', icon: Headphones },
  { slug: 'mousepad', name: 'แผ่นรองเมาส์', brand: 'fantech', icon: Grid2x2 },
  { slug: 'controller', name: 'จอยเกม', brand: 'fantech', icon: Gamepad2 },
  { slug: 'webcam', name: 'เว็บแคม', brand: 'fantech', icon: Webcam },
  { slug: 'streaming', name: 'อุปกรณ์สตรีม', brand: 'fantech', icon: Video },
  // ── UGREEN · Charging / Storage / Connectivity ──
  { slug: 'nas', name: 'NAS / NASync', brand: 'ugreen', icon: Server },
  { slug: 'gan-charger', name: 'ที่ชาร์จ GaN', brand: 'ugreen', icon: Zap },
  { slug: 'usb-charger', name: 'ที่ชาร์จ USB', brand: 'ugreen', icon: Plug },
  { slug: 'powerbank', name: 'พาวเวอร์แบงก์', brand: 'ugreen', icon: BatteryCharging },
  { slug: 'dock', name: 'Docking Station', brand: 'ugreen', icon: LayoutGrid },
  { slug: 'usb-hub', name: 'USB Hub', brand: 'ugreen', icon: Usb },
  { slug: 'hdmi', name: 'อุปกรณ์ HDMI', brand: 'ugreen', icon: Monitor },
  { slug: 'display-adapter', name: 'ตัวแปลงจอ', brand: 'ugreen', icon: MonitorSmartphone },
  { slug: 'usb-cable', name: 'สาย USB', brand: 'ugreen', icon: Cable },
  { slug: 'charging-cable', name: 'สายชาร์จ', brand: 'ugreen', icon: Cable },
  { slug: 'bluetooth-adapter', name: 'Bluetooth Adapter', brand: 'ugreen', icon: Bluetooth },
  { slug: 'card-reader', name: 'Card Reader', brand: 'ugreen', icon: MemoryStick },
];

export const fantechCategories = categories.filter((c) => c.brand === 'fantech');
export const ugreenCategories = categories.filter((c) => c.brand === 'ugreen');
