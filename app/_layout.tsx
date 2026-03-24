import 'react-native-gesture-handler';
import '../global.css';

import Constants from 'expo-constants';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FALLBACK_BANNER_HEIGHT } from '../constants/ads';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const insets = useSafeAreaInsets();
  const extra = Constants.expoConfig?.extra || {};
  const googleMobileAds = getGoogleMobileAdsModule();
  const fallbackBannerId = __DEV__ ? googleMobileAds?.TestIds?.BANNER : undefined;
  const adUnitId =
    Platform.OS === 'android'
      ? (extra.admobAndroidBannerUnitId as string | undefined) || fallbackBannerId
      : (extra.admobIosBannerUnitId as string | undefined) || fallbackBannerId;
  const canRenderBanner = !!googleMobileAds?.BannerAd && !!googleMobileAds?.BannerAdSize;
  const shouldShowBanner = canRenderBanner && typeof adUnitId === 'string' && adUnitId.length > 0;
  const bannerBottom = Math.max(insets.bottom, 8);
  const bannerHeight = Number(extra.admobBannerHeight ?? FALLBACK_BANNER_HEIGHT) || FALLBACK_BANNER_HEIGHT;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
        {shouldShowBanner && (
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: bannerBottom,
              minHeight: bannerHeight,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <googleMobileAds.BannerAd
              unitId={adUnitId}
              size={googleMobileAds.BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>
        )}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

function getGoogleMobileAdsModule():
  | {
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

