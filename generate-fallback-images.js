import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('client/public/machines');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const svgTemplate = (title, color, icon) => `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#022c22;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#grad)" />
  <circle cx="300" cy="180" r="80" fill="rgba(255,255,255,0.1)" />
  <text x="300" y="195" font-family="Arial, sans-serif" font-size="64" text-anchor="middle" fill="#ffffff">${icon}</text>
  <text x="300" y="300" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="#ffffff">${title}</text>
  <text x="300" y="335" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#a7f3d0">Rural Machinery Verified Equipment</text>
</svg>
`;

const machines = [
  { name: 'sprayer-default.jpg', title: 'Boom Sprayer', color: '#065f46', icon: '💧' },
  { name: 'tractor-default.jpg', title: 'Agricultural Tractor', color: '#047857', icon: '🚜' },
  { name: 'harvester-default.jpg', title: 'Paddy Harvester', color: '#b45309', icon: '🌾' },
  { name: 'rotavator-default.jpg', title: 'Heavy Rotavator', color: '#1e3a8a', icon: '⚙️' },
  { name: 'seeddrill-default.jpg', title: 'Automatic Seed Drill', color: '#6d28d9', icon: '🌱' },
];

machines.forEach(m => {
  fs.writeFileSync(path.join(publicDir, m.name), svgTemplate(m.title, m.color, m.icon));
});

console.log('Default machinery fallback images generated in client/public/machines/');
