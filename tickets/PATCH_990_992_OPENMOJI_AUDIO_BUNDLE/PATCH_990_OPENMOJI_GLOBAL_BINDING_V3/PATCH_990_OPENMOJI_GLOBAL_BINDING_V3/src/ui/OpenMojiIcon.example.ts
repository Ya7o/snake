// Example helper for DOM/React projects.
// If Snake Drive uses Phaser-only rendering, adapt this into preload keys + image textures.

export type OpenMojiIconProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
};

export function openMojiImgProps({
  src,
  alt = '',
  size = 24,
  className,
}: OpenMojiIconProps) {
  return {
    src,
    alt,
    width: size,
    height: size,
    className,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
}
