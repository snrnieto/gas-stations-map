const fs = require('fs');
const path = require('path');
const appJson = require('./app.json');

function readEnvLocal() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) return {};

  const content = fs.readFileSync(envPath, 'utf8');
  const result = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    result[key] = value;
  }

  return result;
}

const localEnv = readEnvLocal();
const googleMapsAndroidApiKey =
  process.env.GOOGLE_MAPS_ANDROID_API_KEY || localEnv.GOOGLE_MAPS_ANDROID_API_KEY || '';
const googleMapsIosApiKey =
  process.env.GOOGLE_MAPS_IOS_API_KEY || localEnv.GOOGLE_MAPS_IOS_API_KEY || '';
const admobAndroidAppId =
  process.env.ADMOB_ANDROID_APP_ID ||
  localEnv.ADMOB_ANDROID_APP_ID ||
  'ca-app-pub-3940256099942544~3347511713';
const admobIosAppId =
  process.env.ADMOB_IOS_APP_ID ||
  localEnv.ADMOB_IOS_APP_ID ||
  'ca-app-pub-3940256099942544~1458002511';
const admobAndroidBannerUnitId =
  process.env.ADMOB_ANDROID_BANNER_UNIT_ID ||
  localEnv.ADMOB_ANDROID_BANNER_UNIT_ID ||
  'ca-app-pub-3940256099942544/6300978111';
const admobIosBannerUnitId =
  process.env.ADMOB_IOS_BANNER_UNIT_ID ||
  localEnv.ADMOB_IOS_BANNER_UNIT_ID ||
  'ca-app-pub-3940256099942544/2934735716';
const admobBannerHeight =
  Number(process.env.ADMOB_BANNER_HEIGHT || localEnv.ADMOB_BANNER_HEIGHT || '60') || 60;

const plugins = [...(appJson.expo.plugins || [])];
const hasReactNativeMapsPlugin = plugins.some(
  (plugin) => (Array.isArray(plugin) ? plugin[0] : plugin) === 'react-native-maps',
);
if (!hasReactNativeMapsPlugin) {
  plugins.push([
    'react-native-maps',
    {
      androidGoogleMapsApiKey: googleMapsAndroidApiKey,
      iosGoogleMapsApiKey: googleMapsIosApiKey,
    },
  ]);
}
const hasGoogleMobileAdsPlugin = plugins.some(
  (plugin) => (Array.isArray(plugin) ? plugin[0] : plugin) === 'react-native-google-mobile-ads',
);
if (!hasGoogleMobileAdsPlugin) {
  plugins.push([
    'react-native-google-mobile-ads',
    {
      androidAppId: admobAndroidAppId,
      iosAppId: admobIosAppId,
    },
  ]);
}

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    plugins,
    android: {
      ...(appJson.expo.android || {}),
      config: {
        ...((appJson.expo.android && appJson.expo.android.config) || {}),
        googleMaps: {
          ...(((appJson.expo.android &&
            appJson.expo.android.config &&
            appJson.expo.android.config.googleMaps) ||
            {})),
          apiKey: googleMapsAndroidApiKey,
        },
      },
    },
    extra: {
      ...(appJson.expo.extra || {}),
      googleMapsAndroidApiKey,
      googleMapsIosApiKey,
      admobAndroidBannerUnitId,
      admobIosBannerUnitId,
      admobBannerHeight,
    },
  },
};
