import { useCallback, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBannerBottomInset } from '../hooks/useBannerBottomInset';
import { uploadPricePhotoMock } from '../services/pricePhotoUpload.mock';
import { usePricePhotoDraftStore } from '../store/usePricePhotoDraftStore';

const VERIFICATION_ALERT_TITLE = 'Foto lista';
const VERIFICATION_ALERT_MESSAGE =
  'La imagen se enviará para verificación manual. Los precios se actualizarán cuando una persona encargada los confirme según la foto.';

export default function PricePhotoPreviewScreen() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBannerBottomInset();
  const imageUri = usePricePhotoDraftStore((s) => s.imageUri);
  const stationId = usePricePhotoDraftStore((s) => s.stationId);
  const stationName = usePricePhotoDraftStore((s) => s.stationName);
  const setDraft = usePricePhotoDraftStore((s) => s.setDraft);
  const clearDraft = usePricePhotoDraftStore((s) => s.clearDraft);

  const [uploading, setUploading] = useState(false);

  useLayoutEffect(() => {
    const { imageUri: u, stationId: s } = usePricePhotoDraftStore.getState();
    if (!u || !s) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  }, []);

  const pickAnother = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Activa el acceso a fotos para elegir otra imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri && stationId) {
      setDraft(result.assets[0].uri, stationId, stationName ?? '');
    }
  }, [setDraft, stationId, stationName]);

  const confirmSend = useCallback(async () => {
    if (!imageUri || !stationId || uploading) return;
    setUploading(true);
    try {
      await uploadPricePhotoMock(imageUri, stationId);
      router.dismissAll();
      clearDraft();
      setTimeout(() => {
        Alert.alert(VERIFICATION_ALERT_TITLE, VERIFICATION_ALERT_MESSAGE);
      }, 450);
    } catch (e) {
      if (__DEV__) console.warn(e);
      Alert.alert('Error al enviar', 'No se pudo completar el envío. Intenta de nuevo.');
      setUploading(false);
    }
  }, [imageUri, stationId, uploading, clearDraft]);

  if (!imageUri || !stationId) {
    return null;
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      <View className="flex-row items-center px-4 py-3 border-b border-neutral-200">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Ionicons name="chevron-back" size={28} color="#171717" />
        </Pressable>
        <Text className="flex-1 text-center text-neutral-900 font-bold text-lg pr-8">Revisar foto</Text>
      </View>

      {!!stationName && (
        <Text className="text-neutral-600 text-sm px-4 pt-2 pb-1" numberOfLines={2}>
          {stationName}
        </Text>
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: bottomInset + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', aspectRatio: 3 / 4 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-neutral-500 text-xs mt-3 text-center leading-5">
          Comprueba que los precios se lean bien. Puedes tomar otra foto o elegir otra imagen antes de enviar.
        </Text>
      </ScrollView>

      <View
        className="absolute left-0 right-0 border-t border-neutral-200 bg-white px-4 pt-3 gap-2"
        style={{ bottom: 0, paddingBottom: Math.max(bottomInset, 12) }}
      >
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => router.back()}
            disabled={uploading}
            className="flex-1 bg-white border border-neutral-200 rounded-2xl py-3 active:bg-neutral-50"
          >
            <Text className="text-neutral-900 font-semibold text-center">Tomar otra</Text>
          </Pressable>
          <Pressable
            onPress={pickAnother}
            disabled={uploading}
            className="flex-1 bg-white border border-neutral-200 rounded-2xl py-3 active:bg-neutral-50"
          >
            <Text className="text-neutral-900 font-semibold text-center">Elegir otra</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={confirmSend}
          disabled={uploading}
          className="bg-neutral-900 rounded-2xl py-3.5 active:opacity-90"
        >
          <Text className="text-white font-semibold text-center">Confirmar y enviar</Text>
        </Pressable>
      </View>

      {uploading && (
        <View
          className="absolute inset-0 bg-white/90 items-center justify-center"
          style={{ zIndex: 50 }}
          pointerEvents="auto"
        >
          <ActivityIndicator size="large" color="#404040" />
          <Text className="text-neutral-800 font-medium mt-4">Enviando imagen…</Text>
        </View>
      )}
    </View>
  );
}
