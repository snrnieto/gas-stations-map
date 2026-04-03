import { Platform } from "react-native";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBannerAdLayoutStore } from "../store/useBannerAdLayoutStore";

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
 * Distancia desde el borde inferior hasta donde debe terminar el contenido:
 * safe area + altura real del banner solo si el anuncio cargó (`useBannerAdLayoutStore`).
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
  const configWantsBanner = canRenderBanner && typeof adUnitId === "string" && adUnitId.length > 0;
  const bannerStatus = useBannerAdLayoutStore((s) => s.status);
  const bannerHeightPx = useBannerAdLayoutStore((s) => s.heightPx);
  const bannerBottom = Math.max(insets.bottom, 8);

  if (!configWantsBanner) return insets.bottom;
  if (bannerStatus !== "loaded" || bannerHeightPx <= 0) return insets.bottom;
  return bannerBottom + bannerHeightPx;
}
