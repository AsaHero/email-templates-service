import { pixelBasedPreset, TailwindConfig } from '@react-email/components';

export const config: TailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        bg: '#150029',
        primary: '#FF1773',
        text: '#ffffff',
      },
    },
  },
};
