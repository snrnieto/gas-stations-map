import { Platform } from "react-native";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FALLBACK_BANNER_HEIGHT } from "../constants/ads";

function getGoogleMobileAdsModule():
  | {
      BannerAd: unknown;
      BannerAdSize: Record<string, string>;
      TestIds?: Record<string, string>;
    }
  | undefined {
  try {
    return require("react-native-google-mobile-ads");
  } catch {
    return undefined;
  }
}

/**
 * Distancia desde el borde inferior de la pantalla hasta donde debe terminar el contenido
 * (safe area + banner si está activo). Misma lógica que `app/_layout.tsx`.
 */
export function useBannerBottomInset(): number {
  const insets = useSafeAreaInsets();
  const extra = Constants.expoConfig?.extra ?? {};
  const googleMobileAds = getGoogleMobileAdsModule();
  const fallbackBannerId = __DEV__ ? googleMobileAds?.TestIds?.BANNER : undefined;
  const adUnitId =
    Platform.OS === "android"
      ? (extra.admobAndroidBannerUnitId as string | undefined) || fallbackBannerId
      : (extra.admobIosBannerUnitId as string | undefined) || fallbackBannerId;
  const canRenderBanner = !!googleMobileAds?.BannerAd && !!googleMobileAds?.BannerAdSize;
  const shouldShowBanner = canRenderBanner && typeof adUnitId === "string" && adUnitId.length > 0;
  const bannerBottom = Math.max(insets.bottom, 8);
  const bannerHeight =
    Number(extra.admobBannerHeight ?? FALLBACK_BANNER_HEIGHT) || FALLBACK_BANNER_HEIGHT;

  if (!shouldShowBanner) return insets.bottom;
  return bannerBottom + bannerHeight;
}
