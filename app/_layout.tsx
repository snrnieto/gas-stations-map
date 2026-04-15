import 'react-native-gesture-handler';
import '../global.css';

import { useEffect } from 'react';
import Constants from 'expo-constants';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { shouldShowBannerOverlay } from '../constants/bannerVisibility';
import { useBannerAdLayoutStore } from '../store/useBannerAdLayoutStore';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const extra = Constants.expoConfig?.extra || {};
  const googleMobileAds = getGoogleMobileAdsModule();
  const setOverlayBannerEnabled = useBannerAdLayoutStore((s) => s.setOverlayBannerEnabled);

  useEffect(() => {
    if (!googleMobileAds?.default) return;
    const mobileAds = googleMobileAds.default();
    (async () => {
      try {
        if (__DEV__) {
          await mobileAds.setRequestConfiguration({ testDeviceIdentifiers: ['EMULATOR'] });
        }
        await mobileAds.initialize();
      } catch (e) {
        if (__DEV__) console.warn('[AdMob] initialize failed', e);
      }
    })();
  }, [googleMobileAds]);
  const fallbackBannerId = __DEV__ ? googleMobileAds?.TestIds?.BANNER : undefined;
  const adUnitId =
    Platform.OS === 'android'
      ? (extra.admobAndroidBannerUnitId as string | undefined) || fallbackBannerId
      : (extra.admobIosBannerUnitId as string | undefined) || fallbackBannerId;
  const canRenderBanner = !!googleMobileAds?.BannerAd && !!googleMobileAds?.BannerAdSize;
  const shouldShowBanner = canRenderBanner && typeof adUnitId === 'string' && adUnitId.length > 0;
  const bannerBottom = Math.max(insets.bottom, 8);
  const bannerLayoutStatus = useBannerAdLayoutStore((s) => s.status);
  const bannerHeightPx = useBannerAdLayoutStore((s) => s.heightPx);
  const setBannerLoaded = useBannerAdLayoutStore((s) => s.setLoaded);
  const setBannerFailed = useBannerAdLayoutStore((s) => s.setFailed);
  const resetBannerLayout = useBannerAdLayoutStore((s) => s.reset);

  useEffect(() => {
    if (!shouldShowBanner) resetBannerLayout();
  }, [shouldShowBanner, resetBannerLayout]);

  useEffect(() => {
    setOverlayBannerEnabled(shouldShowBannerOverlay(pathname));
  }, [pathname, setOverlayBannerEnabled]);

  const overlayBannerEnabled = useBannerAdLayoutStore((s) => s.overlayBannerEnabled);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
        {shouldShowBanner && overlayBannerEnabled && bannerLayoutStatus !== 'failed' && (
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: bannerBottom,
              height: bannerLayoutStatus === 'loaded' && bannerHeightPx > 0 ? bannerHeightPx : 0,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <googleMobileAds.BannerAd
              key={adUnitId}
              unitId={adUnitId}
              size={googleMobileAds.BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              onAdLoaded={({ height }: { width: number; height: number }) => setBannerLoaded(height)}
              onSizeChange={({ height }: { width: number; height: number }) => setBannerLoaded(height)}
              onAdFailedToLoad={() => setBannerFailed()}
            />
          </View>
        )}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

function getGoogleMobileAdsModule():
  | {
      default: () => {
        initialize: () => Promise<unknown>;
        setRequestConfiguration: (config: {
          testDeviceIdentifiers?: string[];
        }) => Promise<void>;
      };
      BannerAd: any;
      BannerAdSize: Record<string, string>;
      TestIds?: Record<string, string>;
    }
  | undefined {
  try {
    // Avoid hard crash when native module is not yet present in current dev client binary.
    return require('react-native-google-mobile-ads');
  } catch {
    return undefined;
  }
}

