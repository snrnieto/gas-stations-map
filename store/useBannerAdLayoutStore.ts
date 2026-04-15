import { create } from 'zustand';

export type BannerAdLayoutStatus = 'idle' | 'loaded' | 'failed';

type BannerAdLayoutState = {
  status: BannerAdLayoutStatus;
  heightPx: number;
  /** Si la ruta actual permite mostrar el banner encima del contenido (false = pantallas full-bleed). */
  overlayBannerEnabled: boolean;
  setLoaded: (heightPx: number) => void;
  setFailed: () => void;
  reset: () => void;
  setOverlayBannerEnabled: (enabled: boolean) => void;
};

export const useBannerAdLayoutStore = create<BannerAdLayoutState>((set) => ({
  status: 'idle',
  heightPx: 0,
  overlayBannerEnabled: true,
  setLoaded: (heightPx) =>
    set({
      status: 'loaded',
      heightPx: Number.isFinite(heightPx) && heightPx > 0 ? heightPx : 0,
    }),
  setFailed: () => set({ status: 'failed', heightPx: 0 }),
  reset: () => set({ status: 'idle', heightPx: 0 }),
  setOverlayBannerEnabled: (enabled) => set({ overlayBannerEnabled: enabled }),
}));
