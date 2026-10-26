import type { ImageMetadata } from 'astro';

// Все скриншоты из src/assets/screens — по имени файла без расширения.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/screens/*.{webp,png,jpg}', { eager: true });

export const shots: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), mod.default]),
);

export function shot(name: string): ImageMetadata {
  const img = shots[name];
  if (!img) throw new Error(`Нет скриншота src/assets/screens/${name}.*`);
  return img;
}
