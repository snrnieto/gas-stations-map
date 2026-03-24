import { Pressable, Text, View } from 'react-native';
import type { FuelType, GasStation } from '../types/gasStation';
import { formatCop, formatDistanceKm } from '../utils/format';

type Props = {
  station: GasStation;
  fuelType: FuelType;
  onPress?: () => void;
  highlighted?: boolean;
};

export function GasStationCard({ station, fuelType, onPress, highlighted }: Props) {
  const price = station.prices[fuelType];

  return (
    <Pressable
      onPress={onPress}
      className={[
        'px-3 py-4 rounded-2xl mb-3 bg-white border',
        highlighted ? 'border-neutral-900' : 'border-neutral-200',
      ].join(' ')}
    >
      <Text className="font-semibold text-neutral-900">{station.name}</Text>
      <Text className="text-neutral-600 mt-1" numberOfLines={2}>
        {station.address}
      </Text>
      <View className="flex-row justify-between items-end mt-3">
        <Text className="font-semibold text-neutral-900">{formatCop(price)}</Text>
        <Text className="text-neutral-500 text-sm">
          {formatDistanceKm(station.distanceKm ?? NaN)}
        </Text>
      </View>
    </Pressable>
  );
}

