/**
 * Pathnames de expo-router donde el banner no debe mostrarse (pantalla completa sin solaparse).
 * Añade aquí nuevas rutas si necesitas la misma conducta.
 */
export const PATHNAMES_HIDING_BANNER = [
  '/price-photo-help',
  '/price-photo-camera',
  '/price-photo-preview',
] as const;

/**
 * Si el banner puede superponerse en esta ruta (`true`) o debe ocultarse (`false`).
 */
export function shouldShowBannerOverlay(pathname: string | null | undefined): boolean {
  if (pathname == null || pathname === '') return true;
  const normalized = pathname.replace(/\/$/, '') || '/';
  return !PATHNAMES_HIDING_BANNER.some(
    (p) => normalized === p || normalized.startsWith(`${p}/`),
  );
}
