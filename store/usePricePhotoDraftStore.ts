import { create } from 'zustand';

/** Solo guardamos la URI string que apunta al archivo temporal del SO (cámara/ImagePicker), no duplicamos la imagen en memoria. */

type PricePhotoDraftState = {
  imageUri: string | null;
  stationId: string | null;
  stationName: string | null;
  setDraft: (imageUri: string, stationId: string, stationName: string) => void;
  clearDraft: () => void;
};

export const usePricePhotoDraftStore = create<PricePhotoDraftState>((set) => ({
  imageUri: null,
  stationId: null,
  stationName: null,
  setDraft: (imageUri, stationId, stationName) => set({ imageUri, stationId, stationName }),
  clearDraft: () => set({ imageUri: null, stationId: null, stationName: null }),
}));
