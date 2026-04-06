import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { Prices } from '../types/gasStation';
import { useGasStationsStore } from '../store/useGasStationsStore';

type Props = {
  stationId: string;
  initialPrices: Prices;
  onCancel: () => void;
};

export function StationEditForm({ stationId, initialPrices, onCancel }: Props) {
  const [corriente, setCorriente] = useState(String(initialPrices.corriente));
  const [premium, setPremium] = useState(String(initialPrices.premium));
  const [diesel, setDiesel] = useState(String(initialPrices.diesel));

  const applyEditedPrices = useGasStationsStore((s) => s.applyEditedPrices);

  const fuelInputs = useMemo(
    () =>
      [
        { label: 'Corriente', value: corriente, onChange: setCorriente, key: 'corriente' as const },
        { label: 'Premium', value: premium, onChange: setPremium, key: 'premium' as const },
        { label: 'Diesel', value: diesel, onChange: setDiesel, key: 'diesel' as const },
      ] as const,
    [corriente, diesel, premium],
  );

  const onSave = () => {
    const parseOrFallback = (raw: string, fallback: number) => {
      const n = Number(raw);
      return Number.isFinite(n) ? n : fallback;
    };

    const nextPrices: Prices = {
      corriente: parseOrFallback(corriente, initialPrices.corriente),
      premium: parseOrFallback(premium, initialPrices.premium),
      diesel: parseOrFallback(diesel, initialPrices.diesel),
    };

    applyEditedPrices(stationId, nextPrices);
    onCancel();
  };

  return (
    <View className="pt-2">
      <Text className="font-bold text-neutral-900 mb-3">Editar precios (local)</Text>

      {fuelInputs.map((inp) => (
        <View key={inp.key} className="mb-3">
          <Text className="text-neutral-700 text-xs mb-1">{inp.label}</Text>
          <TextInput
            value={inp.value}
            onChangeText={inp.onChange}
            keyboardType="numeric"
            className="border border-neutral-200 rounded-xl px-3 py-2"
          />
        </View>
      ))}

      <View className="flex-row gap-2 mt-2">
        <Pressable
          onPress={onCancel}
          className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2"
        >
          <Text className="text-center font-semibold text-neutral-800">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={onSave}
          className="flex-1 bg-neutral-900 rounded-xl px-3 py-2"
        >
          <Text className="text-center font-semibold text-white">Guardar</Text>
        </Pressable>
      </View>
    </View>
  );
}

