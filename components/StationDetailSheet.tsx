import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useGasStationsStore } from "../store/useGasStationsStore";
import { useBannerBottomInset } from "../hooks/useBannerBottomInset";
import { formatCop } from "../utils/format";
import { StationEditForm } from "./StationEditForm";

export function StationDetailSheet() {
  const { height: windowHeight } = useWindowDimensions();
  const bottomInset = useBannerBottomInset();
  const sheetRef = useRef<BottomSheetModalMethods>(null);

  const stations = useGasStationsStore((s) => s.stations);
  const viewMode = useGasStationsStore((s) => s.viewMode);
  const selectedStationId = useGasStationsStore((s) => s.selectedStationId);
  const selectStation = useGasStationsStore((s) => s.selectStation);
  const setViewMode = useGasStationsStore((s) => s.setViewMode);
  const setMapFocusTarget = useGasStationsStore((s) => s.setMapFocusTarget);

  const selectedStation = useMemo(() => {
    if (!selectedStationId) return null;
    return stations.find((s) => s.id === selectedStationId) ?? null;
  }, [selectedStationId, stations]);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(false);
  }, [selectedStationId]);

  useEffect(() => {
    if (selectedStationId && selectedStation) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [selectedStationId, selectedStation]);

  const handleDismiss = useCallback(() => {
    setIsEditing(false);
    selectStation(null);
  }, [selectStation]);

  const requestClose = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.35}
        pressBehavior="close"
      />
    ),
    [],
  );

  const openDirections = () => {
    if (!selectedStation) return;
    const { latitude, longitude, name } = selectedStation;

    const url =
      Platform.OS === "ios"
        ? `maps:${latitude},${longitude}?q=${encodeURIComponent(name)}`
        : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(name)})`;

    Linking.openURL(url).catch(() => {});
  };

  const openInAppMap = () => {
    if (!selectedStation) return;
    setMapFocusTarget({
      lat: selectedStation.latitude,
      lng: selectedStation.longitude,
    });
    setViewMode("map");
    setIsEditing(false);
    sheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing
      maxDynamicContentSize={windowHeight * 0.92}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      bottomInset={bottomInset}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#d4d4d4",
        width: 40,
      }}
    >
      <BottomSheetView className="px-4 pb-5 pt-2">
        {selectedStation ? (
          isEditing ? (
            <StationEditForm
              stationId={selectedStation.id}
              initialPrices={selectedStation.prices}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <Text className="text-neutral-900 font-bold text-lg">{selectedStation.name}</Text>
              <Text className="text-neutral-600 mt-1" numberOfLines={2}>
                {selectedStation.address}
              </Text>

              <View className="mt-4 bg-neutral-50 border border-neutral-200 rounded-2xl p-3">
                <Text className="text-neutral-800 font-semibold mb-2">Precios</Text>
                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-neutral-600 font-semibold">Corriente</Text>
                    <Text className="text-neutral-900 font-bold">
                      {formatCop(selectedStation.prices.corriente)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-neutral-600 font-semibold">Extra</Text>
                    <Text className="text-neutral-900 font-bold">
                      {formatCop(selectedStation.prices.extra)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-neutral-600 font-semibold">Diesel</Text>
                    <Text className="text-neutral-900 font-bold">
                      {formatCop(selectedStation.prices.diesel)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2 mt-4">
                <Pressable
                  onPress={openDirections}
                  className="flex-1 bg-neutral-900 rounded-2xl px-4 py-3"
                >
                  <Text className="text-white font-semibold text-center">Cómo llegar</Text>
                </Pressable>
                {viewMode === "list" && (
                  <Pressable
                    onPress={openInAppMap}
                    className="flex-1 bg-blue-500 rounded-2xl px-4 py-3"
                  >
                    <Text className="text-white font-semibold text-center">Ver en mapa</Text>
                  </Pressable>
                )}
              </View>
              <View className="flex-row gap-2 mt-2">
                <Pressable
                  onPress={() => setIsEditing(true)}
                  className="flex-1 bg-white border border-neutral-200 rounded-2xl px-4 py-3"
                >
                  <Text className="text-neutral-900 font-semibold text-center">Editar precios</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={requestClose}
                className="mt-3 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-3"
              >
                <Text className="text-center text-neutral-700 font-semibold">Cerrar</Text>
              </Pressable>
            </>
          )
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
