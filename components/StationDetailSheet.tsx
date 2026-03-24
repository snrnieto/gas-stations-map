import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActivityIndicator,
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
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useGasStationsStore } from "../store/useGasStationsStore";
import { useBannerBottomInset } from "../hooks/useBannerBottomInset";
import { useStationPriceHistory } from "../hooks/useStationPriceHistory";
import { formatCop, formatHistoryDate } from "../utils/format";
import { StationEditForm } from "./StationEditForm";

export function StationDetailSheet() {
  const { height: windowHeight } = useWindowDimensions();
  const safeInsets = useSafeAreaInsets();
  const bottomInset = useBannerBottomInset();
  const sheetRef = useRef<BottomSheetModalMethods>(null);
  const lastSnappedStationIdRef = useRef<string | null>(null);

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

  const [historyOpen, setHistoryOpen] = useState(false);
  const { entries: priceHistory, status: priceHistoryStatus, error: priceHistoryError } =
    useStationPriceHistory(selectedStationId, historyOpen);

  const [isEditing, setIsEditing] = useState(false);

  /**
   * Altura máxima del sheet: desde el borde superior útil hasta justo encima del anuncio
   * (bottomInset = safe bottom + banner en useBannerBottomInset).
   */
  const sheetMaxHeight = useMemo(() => {
    const topReserve = Math.max(safeInsets.top, 0) + 8;
    const usable = windowHeight - bottomInset - topReserve;
    const capped = Math.min(usable, windowHeight * 0.92);
    return Math.max(240, Math.round(capped));
  }, [bottomInset, safeInsets.top, windowHeight]);

  /**
   * Historial cerrado: debe caber título, precios, filas de botones (incl. lista con 2 CTAs),
   * Cerrar y la fila del acordeón. El 44 % + mín 280 era demasiado bajo.
   */
  const sheetCompactHeight = useMemo(() => {
    const collapsedContentFloor = 500;
    const fromRatio = Math.round(sheetMaxHeight * 0.64);
    const target = Math.max(collapsedContentFloor, fromRatio);
    return Math.min(sheetMaxHeight - 1, target);
  }, [sheetMaxHeight]);

  const snapPoints = useMemo(
    () => [sheetCompactHeight, sheetMaxHeight],
    [sheetCompactHeight, sheetMaxHeight],
  );

  const scrollContentPadding = useMemo(
    () => ({ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }),
    [],
  );

  useEffect(() => {
    setIsEditing(false);
  }, [selectedStationId]);

  useEffect(() => {
    setHistoryOpen(false);
  }, [selectedStationId]);

  useEffect(() => {
    if (!selectedStationId) lastSnappedStationIdRef.current = null;
  }, [selectedStationId]);

  useEffect(() => {
    if (selectedStationId && selectedStation) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [selectedStationId, selectedStation]);

  /** 0 = compacto (historial cerrado), 1 = alto completo (historial o edición). */
  useEffect(() => {
    if (!selectedStationId || !selectedStation) return;
    const stationChanged = lastSnappedStationIdRef.current !== selectedStationId;
    lastSnappedStationIdRef.current = selectedStationId;
    const id = requestAnimationFrame(() => {
      if (stationChanged) {
        sheetRef.current?.snapToIndex(0);
        return;
      }
      sheetRef.current?.snapToIndex(historyOpen || isEditing ? 1 : 0);
    });
    return () => cancelAnimationFrame(id);
  }, [historyOpen, isEditing, selectedStationId, selectedStation]);

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
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      bottomInset={bottomInset}
      containerStyle={{ zIndex: 100000, elevation: 48 }}
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
      {selectedStation ? (
        isEditing ? (
          <BottomSheetScrollView
            contentContainerStyle={scrollContentPadding}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <StationEditForm
              stationId={selectedStation.id}
              initialPrices={selectedStation.prices}
              onCancel={() => setIsEditing(false)}
            />
          </BottomSheetScrollView>
        ) : (
          <BottomSheetScrollView
            contentContainerStyle={scrollContentPadding}
            showsVerticalScrollIndicator
          >
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

              <View className="mt-4 bg-neutral-50 border border-neutral-200 rounded-2xl overflow-hidden">
                <Pressable
                  onPress={() => setHistoryOpen((o) => !o)}
                  className="flex-row items-center justify-between px-3 py-3 active:bg-neutral-100"
                  accessibilityRole="button"
                  accessibilityState={{ expanded: historyOpen }}
                  accessibilityLabel="Historial de precios"
                >
                  <View className="flex-1 pr-2">
                    <Text className="text-neutral-800 font-semibold">Historial de precios</Text>
                    <Text className="text-neutral-500 text-xs mt-0.5">
                      {!historyOpen
                        ? "Toca para cargar y ver fechas anteriores"
                        : priceHistoryStatus === "loading"
                          ? "Cargando…"
                          : priceHistoryStatus === "ready"
                            ? `${priceHistory.length} registro${priceHistory.length === 1 ? "" : "s"}`
                            : priceHistoryStatus === "error"
                              ? "Error al cargar"
                              : ""}
                    </Text>
                  </View>
                  <Text className="text-neutral-500 text-lg">{historyOpen ? "▲" : "▼"}</Text>
                </Pressable>

                {historyOpen && (
                  <View className="border-t border-neutral-200 px-3 pb-3">
                    {priceHistoryStatus === "loading" && (
                      <View className="flex-row items-center gap-2 py-4 justify-center">
                        <ActivityIndicator color="#404040" />
                        <Text className="text-neutral-600 text-sm">Cargando historial…</Text>
                      </View>
                    )}
                    {priceHistoryStatus === "error" && priceHistoryError && (
                      <Text className="text-red-700 text-sm py-2">{priceHistoryError}</Text>
                    )}
                    {priceHistoryStatus === "ready" && priceHistory.length === 0 && (
                      <Text className="text-neutral-500 text-sm py-2">
                        No hay historial disponible para esta estación.
                      </Text>
                    )}
                    {priceHistoryStatus === "ready" && priceHistory.length > 0 && (
                      <View className="pt-2">
                        {priceHistory.map((row, index) => (
                          <View
                            key={row.recordedAt}
                            className={index > 0 ? "mt-3 pt-3 border-t border-neutral-200" : ""}
                          >
                            <Text className="text-neutral-900 font-semibold text-sm">
                              {formatHistoryDate(row.recordedAt)}
                            </Text>
                            <Text className="text-neutral-600 text-xs mt-1 leading-5">
                              Corriente {formatCop(row.prices.corriente)} · Extra{" "}
                              {formatCop(row.prices.extra)} · Diesel {formatCop(row.prices.diesel)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </>
          </BottomSheetScrollView>
        )
      ) : null}
    </BottomSheetModal>
  );
}
