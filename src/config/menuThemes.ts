export interface MenuThemeButtons {
  primaryFill: number;
  primaryPressed: number;
  primaryStroke: number;
  primaryText: string;
  secondaryFill: number;
  secondaryPressed: number;
  secondaryStroke: number;
  secondaryText: string;
}

export interface MenuThemeColors {
  primary: number;
  primaryHex: string;
  secondary: number;
  secondaryHex: string;
  panelBg: number;
  panelAlpha: number;
  textHex: string;
  titleHex?: string;    // override for universe title text (LevelIntro header)
  btnTextDark: boolean;
}

export interface MenuTheme {
  colors: MenuThemeColors;
  buttons: MenuThemeButtons;
  fx: 'magic' | 'rings' | 'rain' | 'impact' | 'neon' | 'snow' | 'embers' | 'paper';
}

export const MENU_THEMES: Record<string, MenuTheme> = {
  castle: {
    colors: {
      primary: 0xF6C45C, primaryHex: '#F6C45C',
      secondary: 0x8B4BFF, secondaryHex: '#8B4BFF',
      panelBg: 0x190A2A, panelAlpha: 0.88,
      textHex: '#F7F1FF',
      titleHex: '#e8deff',
      btnTextDark: true,
    },
    buttons: {
      primaryFill: 0xF6C45C, primaryPressed: 0xFFD982, primaryStroke: 0xFFEFAD, primaryText: '#1c1025',
      secondaryFill: 0x180A2A, secondaryPressed: 0x24123D, secondaryStroke: 0x8B4BFF, secondaryText: '#e6d8ff',
    },
    fx: 'magic',
  },
  sonic: {
    colors: {
      primary: 0xFFD21F, primaryHex: '#FFD21F',
      secondary: 0x118CFF, secondaryHex: '#118CFF',
      panelBg: 0x002460, panelAlpha: 0.88,
      textHex: '#FFFFFF',
      btnTextDark: true,
    },
    buttons: {
      primaryFill: 0x0E72C5, primaryPressed: 0x1A8CE0, primaryStroke: 0xFFD21F, primaryText: '#ffffff',
      secondaryFill: 0x001840, secondaryPressed: 0x002460, secondaryStroke: 0x118CFF, secondaryText: '#c8e8ff',
    },
    fx: 'rings',
  },
  streets: {
    colors: {
      primary: 0xFF4FD8, primaryHex: '#FF4FD8',
      secondary: 0x16D9FF, secondaryHex: '#16D9FF',
      panelBg: 0x0A0E19, panelAlpha: 0.88,
      textHex: '#F5F7FF',
      btnTextDark: true,
    },
    buttons: {
      primaryFill: 0xFF4FD8, primaryPressed: 0xCC3CB0, primaryStroke: 0xFF4FD8, primaryText: '#0a0e1a',
      secondaryFill: 0x0A0E19, secondaryPressed: 0x151C30, secondaryStroke: 0x16D9FF, secondaryText: '#c8f0ff',
    },
    fx: 'rain',
  },
  fighter: {
    colors: {
      primary: 0xFFB13B, primaryHex: '#FFB13B',
      secondary: 0xC8281D, secondaryHex: '#C8281D',
      panelBg: 0x120A08, panelAlpha: 0.90,
      textHex: '#FFF1D6',
      btnTextDark: true,
    },
    buttons: {
      primaryFill: 0xFFB13B, primaryPressed: 0xCC8520, primaryStroke: 0xFFB13B, primaryText: '#1a0800',
      secondaryFill: 0x120A08, secondaryPressed: 0x1C1008, secondaryStroke: 0xC8281D, secondaryText: '#fff1d6',
    },
    fx: 'impact',
  },
  outrun: {
    colors: {
      primary: 0xFF4FC3, primaryHex: '#FF4FC3',
      secondary: 0x20E6FF, secondaryHex: '#20E6FF',
      panelBg: 0x080D20, panelAlpha: 0.88,
      textHex: '#FFF8E8',
      btnTextDark: true,
    },
    buttons: {
      primaryFill: 0xFF4FC3, primaryPressed: 0xCC3B98, primaryStroke: 0xFF4FC3, primaryText: '#080d20',
      secondaryFill: 0x080D20, secondaryPressed: 0x0D1530, secondaryStroke: 0x20E6FF, secondaryText: '#d0f8ff',
    },
    fx: 'neon',
  },
  shinobi: {
    colors: {
      primary: 0xB5121B, primaryHex: '#B5121B',
      secondary: 0xC9D0D6, secondaryHex: '#C9D0D6',
      panelBg: 0x080A0E, panelAlpha: 0.90,
      textHex: '#F2F4F5',
      btnTextDark: false,
    },
    buttons: {
      primaryFill: 0xB5121B, primaryPressed: 0x8A0D15, primaryStroke: 0xC9D0D6, primaryText: '#ffffff',
      secondaryFill: 0x080A0E, secondaryPressed: 0x10141E, secondaryStroke: 0xC9D0D6, secondaryText: '#e0e5e8',
    },
    fx: 'snow',
  },
  kombat: {
    colors: {
      primary: 0xB51212, primaryHex: '#B51212',
      secondary: 0xF05A24, secondaryHex: '#F05A24',
      panelBg: 0x0A0808, panelAlpha: 0.92,
      textHex: '#F7E7D2',
      btnTextDark: false,
    },
    buttons: {
      primaryFill: 0xB51212, primaryPressed: 0x8A0D0D, primaryStroke: 0xF05A24, primaryText: '#ffffff',
      secondaryFill: 0x0A0808, secondaryPressed: 0x160E0E, secondaryStroke: 0xF05A24, secondaryText: '#f7e7d2',
    },
    fx: 'embers',
  },
  paperboy: {
    colors: {
      primary: 0xE83527, primaryHex: '#E83527',
      secondary: 0x1976E8, secondaryHex: '#1976E8',
      panelBg: 0x081C38, panelAlpha: 0.88,
      textHex: '#FFFFFF',
      btnTextDark: false,
    },
    buttons: {
      primaryFill: 0xE83527, primaryPressed: 0xBB261B, primaryStroke: 0xE83527, primaryText: '#ffffff',
      secondaryFill: 0x081C38, secondaryPressed: 0x0D2550, secondaryStroke: 0x1976E8, secondaryText: '#c8dcff',
    },
    fx: 'paper',
  },
};
