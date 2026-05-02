import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

import preset from '@stryvia/ui/tailwind-preset';

const config = {
  darkMode: ['class'],
  presets: [preset],
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  plugins: [animate],
} satisfies Config;

export default config;
