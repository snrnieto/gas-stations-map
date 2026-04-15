import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBannerBottomInset } from '../hooks/useBannerBottomInset';
import { usePricePhotoDraftStore } from '../store/usePricePhotoDraftStore';

/** Simulador/emulador: sin sensor real; onCameraReady suele no dispararse y la vista previa es negra. */
const IS_SIMULATOR = !Device.isDevice;

export default function PricePhotoCameraScreen() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBannerBottomInset();
  const isFocused = useIsFocused();
  const { stationId, stationName } = useLocalSearchParams<{
    stationId: string;
    stationName?: string;
  }>();

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission, refreshPermission] = useCameraPermissions();

  useFocusEffect(
    useCallback(() => {
      void refreshPermission();
    }, [refreshPermission]),
  );
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [cameraReady, setCameraReady] = useState(IS_SIMULATOR);
  const [capturing, setCapturing] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);

  useEffect(() => {
    setMountError(null);
  }, [facing]);

  useEffect(() => {
    if (permission?.granted && IS_SIMULATOR) {
      setCameraReady(true);
    }
  }, [permission?.granted, facing]);

  useEffect(() => {
    if (!permission?.granted || IS_SIMULATOR) return;
    const id = setTimeout(() => setCameraReady(true), 12000);
    return () => clearTimeout(id);
  }, [permission?.granted, facing]);

  const openPreviewWithUri = useCallback(
    (uri: string) => {
      if (!stationId) return;
      usePricePhotoDraftStore.getState().setDraft(uri, stationId, stationName ?? '');
      router.push('/price-photo-preview');
    },
    [stationId, stationName],
  );

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || capturing) return;
    if (!IS_SIMULATOR && !cameraReady) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.92 });
      if (photo?.uri) openPreviewWithUri(photo.uri);
    } catch (e) {
      Alert.alert(
        'No se pudo tomar la foto',
        IS_SIMULATOR
          ? 'En el simulador la cámara no captura bien. Prueba en un iPhone o iPad real, o usa la galería.'
          : 'Intenta de nuevo o elige una imagen de la galería.',
      );
      if (__DEV__) console.warn(e);
    } finally {
      setCapturing(false);
    }
  }, [cameraReady, capturing, openPreviewWithUri]);

  const pickFromLibrary = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Activa el acceso a fotos para elegir una imagen de la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      openPreviewWithUri(result.assets[0].uri);
    }
  }, [openPreviewWithUri]);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    if (!IS_SIMULATOR) {
      setCameraReady(false);
    }
  }, []);

  if (permission === null) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (!permission.granted) {
    const canAskAgain = permission.canAskAgain !== false;

    const onPrimaryPress = async () => {
      if (canAskAgain) {
        await requestPermission();
        return;
      }
      try {
        await Linking.openSettings();
      } catch (e) {
        if (__DEV__) console.warn(e);
        Alert.alert(
          'Ajustes',
          'No se pudo abrir los ajustes. Ve a Ajustes del sistema → esta app y activa el permiso de cámara.',
        );
      }
    };

    return (
      <View style={[styles.centered, styles.deniedWrap, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar style="light" />
        <Text style={styles.deniedTitle}>Permiso de cámara</Text>
        <Text style={styles.deniedBody}>
          Necesitamos acceso a la cámara para fotografiar el tarifario de precios.
        </Text>
        {!canAskAgain && (
          <Text style={styles.deniedHint}>
            Ya rechazaste el permiso: el sistema no vuelve a mostrar el aviso. Activa la cámara en los ajustes de la
            aplicación.
          </Text>
        )}
        <Pressable onPress={onPrimaryPress} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>{canAskAgain ? 'Permitir cámara' : 'Abrir ajustes'}</Text>
        </Pressable>
        <Pressable onPress={pickFromLibrary} style={styles.galleryBtn}>
          <Text style={styles.galleryBtnText}>Usar foto de la galería</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <CameraView
        ref={cameraRef}
        key={`camera-${facing}`}
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode="picture"
        active={isFocused}
        onCameraReady={() => setCameraReady(true)}
        onMountError={(e) => {
          const message =
            'message' in e && typeof (e as { message?: string }).message === 'string'
              ? (e as { message: string }).message
              : 'nativeEvent' in e &&
                  typeof (e as { nativeEvent?: { message?: string } }).nativeEvent?.message === 'string'
                ? (e as { nativeEvent: { message: string } }).nativeEvent.message
                : 'No se pudo iniciar la vista previa.';
          setMountError(message);
          setCameraReady(true);
        }}
      />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <Pressable
          onPress={() => router.back()}
          hitSlop={14}
          style={styles.iconHit}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <Ionicons name="close" size={32} color="#ffffff" />
        </Pressable>
        {!!stationName && (
          <Text style={styles.stationTitle} numberOfLines={1}>
            {stationName}
          </Text>
        )}
      </View>

      {IS_SIMULATOR && (
        <View style={[styles.simBanner, { top: insets.top + 52 }]}>
          <Text style={styles.simBannerText}>
            Simulador: la vista previa suele verse negra y la captura puede fallar. Usa un dispositivo real o la galería.
          </Text>
        </View>
      )}

      {!!mountError && !IS_SIMULATOR && (
        <View style={[styles.errorBanner, { top: insets.top + 52 }]}>
          <Text style={styles.errorBannerText} numberOfLines={3}>
            {mountError}
          </Text>
        </View>
      )}

      <View style={[styles.bottomBar, { paddingBottom: Math.max(bottomInset, 16) }]}>
        <Pressable
          onPress={pickFromLibrary}
          style={styles.sideControl}
          accessibilityRole="button"
          accessibilityLabel="Elegir de la galería"
        >
          <Ionicons name="images-outline" size={28} color="#ffffff" />
        </Pressable>

        <Pressable
          onPress={takePicture}
          disabled={capturing || (!IS_SIMULATOR && !cameraReady)}
          style={[
            styles.shutterOuter,
            (capturing || (!IS_SIMULATOR && !cameraReady)) && styles.shutterDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Tomar foto"
        >
          <View style={styles.shutterInner} />
        </Pressable>

        <Pressable
          onPress={toggleFacing}
          style={styles.sideControl}
          accessibilityRole="button"
          accessibilityLabel="Cambiar de cámara"
        >
          <Ionicons name="camera-reverse-outline" size={30} color="#ffffff" />
        </Pressable>
      </View>

      {capturing && (
        <View style={styles.capturingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  deniedWrap: {
    paddingHorizontal: 24,
  },
  deniedTitle: {
    color: '#fafafa',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  deniedBody: {
    color: '#d4d4d4',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  deniedHint: {
    color: '#a3a3a3',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: '#fafafa',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 12,
    minWidth: 220,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#171717',
    fontWeight: '600',
    fontSize: 16,
  },
  galleryBtn: {
    paddingVertical: 14,
    marginBottom: 4,
  },
  galleryBtnText: {
    color: '#93c5fd',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryBtn: {
    paddingVertical: 12,
  },
  secondaryBtnText: {
    color: '#a3a3a3',
    fontSize: 16,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  iconHit: {
    padding: 4,
    zIndex: 2,
  },
  stationTitle: {
    flex: 1,
    color: '#fafafa',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 40,
  },
  simBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    zIndex: 4,
  },
  simBannerText: {
    color: '#fde68a',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  errorBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: 'rgba(127,29,29,0.85)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    zIndex: 4,
  },
  errorBannerText: {
    color: '#fecaca',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  sideControl: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  shutterDisabled: {
    opacity: 0.45,
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff',
  },
  capturingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
