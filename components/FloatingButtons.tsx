import { Pressable, Text, View } from 'react-native';
import { useGasStationsStore } from '../store/useGasStationsStore';

type Props = {
  onPressFilters?: () => void;
  bottomInset?: number;
};

export function FloatingButtons({ onPressFilters, bottomInset = 0 }: Props) {
  const viewMode = useGasStationsStore((s) => s.viewMode);
  const hasMapMoved = useGasStationsStore((s) => s.hasMapMoved);
  const mapCenter = useGasStationsStore((s) => s.mapCenter);
  const setSearchCenter = useGasStationsStore((s) => s.setSearchCenter);
  const setViewMode = useGasStationsStore((s) => s.setViewMode);

  const toggleView = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
  };

  return (
    <View className="absolute right-4 gap-2" style={{ bottom: Math.max(bottomInset, 12) + 12 }}>
      {/* Cambiar vista */}
      <Pressable
        onPress={toggleView}
        className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-sm"
      >
        <Text className="font-semibold text-neutral-900">
          {viewMode === 'map' ? 'Lista' : 'Mapa'}
        </Text>
      </Pressable>

      {/* Filtros (conectado en el siguiente paso) */}
      <Pressable
        onPress={onPressFilters}
        className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-sm"
      >
        <Text className="font-semibold text-neutral-900">Filtros</Text>
      </Pressable>

      {/* Buscar en esta zona */}
      {viewMode === 'map' && hasMapMoved && mapCenter && (
        <Pressable
          onPress={() => setSearchCenter(mapCenter)}
          className="bg-neutral-900 rounded-2xl px-4 py-3 shadow-sm"
        >
          <Text className="font-semibold text-white">Buscar en esta zona</Text>
        </Pressable>
      )}
    </View>
  );
}

