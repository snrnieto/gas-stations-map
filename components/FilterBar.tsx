import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { FuelType } from '../types/gasStation';
import { useGasStationsStore } from '../store/useGasStationsStore';

type Props = {
  onClose: () => void;
};

export function FilterBar({ onClose }: Props) {
  const filters = useGasStationsStore((s) => s.filters);
  const setFuelTypeFilter = useGasStationsStore((s) => s.setFuelTypeFilter);
  const setPriceRangeFilter = useGasStationsStore((s) => s.setPriceRangeFilter);
  const resetFilters = useGasStationsStore((s) => s.resetFilters);

  const [fuelTypeDraft, setFuelTypeDraft] = useState<FuelType | undefined>(filters.fuelType);
  const [minDraft, setMinDraft] = useState<string>(filters.minPrice !== undefined ? String(filters.minPrice) : '');
  const [maxDraft, setMaxDraft] = useState<string>(filters.maxPrice !== undefined ? String(filters.maxPrice) : '');

  useEffect(() => {
    // Si el usuario abre/cierra, mantenemos sincronía.
    setFuelTypeDraft(filters.fuelType);
    setMinDraft(filters.minPrice !== undefined ? String(filters.minPrice) : '');
    setMaxDraft(filters.maxPrice !== undefined ? String(filters.maxPrice) : '');
  }, [filters.fuelType, filters.maxPrice, filters.minPrice]);

  const fuelTypes = useMemo(
    () =>
      [
        { label: 'Todas', value: undefined as FuelType | undefined },
        { label: 'Corriente', value: 'corriente' as FuelType },
        { label: 'Premium', value: 'premium' as FuelType },
        { label: 'Diesel', value: 'diesel' as FuelType },
      ] as const,
    [],
  );

  const apply = () => {
    const minPrice = minDraft.trim() === '' ? undefined : Number(minDraft);
    const maxPrice = maxDraft.trim() === '' ? undefined : Number(maxDraft);

    setFuelTypeFilter(fuelTypeDraft);
    setPriceRangeFilter({
      minPrice: minPrice !== undefined && Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: maxPrice !== undefined && Number.isFinite(maxPrice) ? maxPrice : undefined,
    });

    onClose();
  };

  const clear = () => {
    resetFilters();
    onClose();
  };

  return (
    <View className="absolute inset-0 justify-center px-4 bg-black/35">
      <View className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-neutral-900 text-base">Filtros</Text>
          <Pressable
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
          >
            <Text className="text-neutral-700 font-bold text-base">X</Text>
          </Pressable>
        </View>

        <Text className="mt-4 text-neutral-700 font-semibold">Tipo de gasolina</Text>
        <View className="flex-row flex-wrap mt-2 gap-2">
          {fuelTypes.map((opt) => {
            const active = fuelTypeDraft === opt.value;
            return (
              <Pressable
                key={opt.label}
                onPress={() => setFuelTypeDraft(opt.value)}
                className={`px-3 py-2 rounded-xl border ${active ? 'bg-neutral-900 border-neutral-900' : 'bg-white border-neutral-200'}`}
              >
                <Text className={`font-semibold ${active ? 'text-white' : 'text-neutral-800'}`}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="mt-4 text-neutral-700 font-semibold">Rango de precio (COP/gal)</Text>
        <View className="flex-row mt-2 gap-2">
          <View className="flex-1">
            <Text className="text-neutral-600 text-xs mb-1">Min</Text>
            <TextInput
              value={minDraft}
              onChangeText={setMinDraft}
              keyboardType="numeric"
              placeholder="Ej: 12000"
              className="border border-neutral-200 rounded-xl px-3 py-2"
            />
          </View>
          <View className="flex-1">
            <Text className="text-neutral-600 text-xs mb-1">Max</Text>
            <TextInput
              value={maxDraft}
              onChangeText={setMaxDraft}
              keyboardType="numeric"
              placeholder="Ej: 14000"
              className="border border-neutral-200 rounded-xl px-3 py-2"
            />
          </View>
        </View>

        <View className="flex-row mt-4 gap-2">
          <Pressable
            onPress={clear}
            className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2"
          >
            <Text className="text-center font-semibold text-neutral-800">Limpiar</Text>
          </Pressable>
          <Pressable
            onPress={apply}
            className="flex-1 bg-neutral-900 rounded-xl px-3 py-2"
          >
            <Text className="text-center font-semibold text-white">Aplicar</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={onClose}
          className="mt-3 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-3 w-full"
        >
          <Text className="text-center text-neutral-700 font-semibold">Cerrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

