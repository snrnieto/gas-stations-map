import { create } from 'zustand';

export type BannerAdLayoutStatus = 'idle' | 'loaded' | 'failed';

type BannerAdLayoutState = {
  status: BannerAdLayoutStatus;
  heightPx: number;
  setLoaded: (heightPx: number) => void;
  setFailed: () => void;
  reset: () => void;
};

export const useBannerAdLayoutStore = create<BannerAdLayoutState>((set) => ({
  status: 'idle',
  heightPx: 0,
  setLoaded: (heightPx) =>
    set({
      status: 'loaded',
      heightPx: Number.isFinite(heightPx) && heightPx > 0 ? heightPx : 0,
    }),
  setFailed: () => set({ status: 'failed', heightPx: 0 }),
  reset: () => set({ status: 'idle', heightPx: 0 }),
}));
