// src/ui/mobileUiTokens.ts
// Base mobile-first. Android cible : touch target ~48dp, WCAG : 44px CSS min.

export const MOBILE_UI = {
  minTouchTarget: 48,
  minTouchGap: 8,
  safePadding: 16,
  panelRadius: 14,
  buttonHeight: 56,
  buttonSmallHeight: 48,
  titleFontSize: 28,
  actionFontSize: 18,
  bodyFontSize: 14,
  captionFontSize: 12,
  iconSize: 28,
  strokeWidth: 2,
  pressScale: 0.97,
} as const;

export type MobileButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export function getButtonSpec(variant: MobileButtonVariant) {
  switch (variant) {
    case "primary":
      return { height: MOBILE_UI.buttonHeight, minWidth: 180, emphasis: 1 };
    case "secondary":
      return { height: MOBILE_UI.buttonSmallHeight, minWidth: 148, emphasis: 0.65 };
    case "danger":
      return { height: MOBILE_UI.buttonHeight, minWidth: 180, emphasis: 0.9 };
    case "ghost":
      return { height: MOBILE_UI.buttonSmallHeight, minWidth: 120, emphasis: 0.35 };
  }
}
