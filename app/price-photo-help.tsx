import { useLocalSearchParams, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBannerBottomInset } from '../hooks/useBannerBottomInset';

const FOOTER_BAR_HEIGHT = 88;

export default function PricePhotoHelpScreen() {
  const insets = useSafeAreaInsets();
  const bottomInset = useBannerBottomInset();
  const { stationId, stationName } = useLocalSearchParams<{
    stationId: string;
    stationName?: string;
  }>();

  const goToCamera = () => {
    if (!stationId) {
      router.back();
      return;
    }
    router.push({
      pathname: '/price-photo-camera',
      params: { stationId, stationName: stationName ?? '' },
    });
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-4 py-3 border-b border-neutral-200">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <Ionicons name="close" size={28} color="#171717" />
        </Pressable>
        <Text className="flex-1 text-center text-neutral-900 font-bold text-lg pr-8">
          Enviar foto de precios
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: bottomInset + FOOTER_BAR_HEIGHT + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {!!stationName && (
          <Text className="text-neutral-600 text-sm mb-4" numberOfLines={2}>
            Estación: <Text className="font-semibold text-neutral-800">{stationName}</Text>
          </Text>
        )}

        <Text className="text-neutral-900 font-semibold text-base mb-2">
          Cómo debe verse la imagen
        </Text>
        <Text className="text-neutral-700 text-[15px] leading-6 mb-4">
          Toma una foto donde se vean con claridad los precios del surtidor o del cartel oficial
          (corriente, premium, diesel y cualquier otro combustible indicado). Otra persona revisará la
          imagen manualmente y, con base en ella, actualizará los precios en la aplicación.
        </Text>

        <Text className="text-neutral-900 font-semibold text-base mb-2">Consejos</Text>
        <View className="gap-3 mb-2">
          <Bullet text="Encuadra de frente el panel o el letrero; evita cortar cifras o etiquetas." />
          <Bullet text="Busca buena luz; si hay reflejos en el vidrio, cambia un poco el ángulo." />
          <Bullet text="Mantén el teléfono firme y enfocado para que los números se lean bien." />
          <Bullet text="Si hay varios precios, que todos los que quieras reportar queden visibles en la misma foto." />
        </View>
      </ScrollView>

      <View
        className="absolute left-0 right-0 border-t border-neutral-200 bg-white px-4 py-3"
        style={{ bottom: bottomInset }}
      >
        <Pressable
          onPress={goToCamera}
          className="bg-neutral-900 rounded-2xl py-3.5 active:opacity-90"
        >
          <Text className="text-white font-semibold text-center text-base">Continuar a la cámara</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View className="flex-row gap-2">
      <Text className="text-blue-600 font-bold mt-0.5">•</Text>
      <Text className="flex-1 text-neutral-700 text-[15px] leading-6">{text}</Text>
    </View>
  );
}
