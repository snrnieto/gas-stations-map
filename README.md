# Gas Stations Map (Cali) - Expo + React Native + Expo Router

Mapa mobile-first de estaciones de gasolina en Cali, Colombia.

## Tecnologías

- Expo (móvil iOS/Android)
- React Native + Expo Router
- TypeScript
- Estado global: Zustand
- Estilos: NativeWind (Tailwind)
- Mapas: `react-native-maps`
- Clustering (mapa): `supercluster` (zoom alineado con la región de `react-native-maps`)
- Geolocalización: `expo-location`
- Bottom sheet: `@gorhom/bottom-sheet`

## Ejecutar por entorno

1. Instala dependencias:

- `npm install`

### Desarrollo (rápido, con Metro/Expo)

Ideal para iterar UI y lógica rápidamente.

Primero instala el dev client en el dispositivo/simulador (al menos una vez, o cada vez que cambien dependencias nativas):

- Android:
  - `npm run android`
- iOS (requiere macOS):
  - `npm run ios`

Luego inicia Metro en modo dev client:

- Android:
  - `npm run start:dev:android`
- iOS:
  - `npm run start:dev`

Si hay caché raro en Android:

- `npm run start:dev:android:clear`

### Casi productivo (release local en dispositivo)

Compila binario release local para probar rendimiento/comportamiento sin depender de Expo server.

- Android:
  - `npx expo run:android --variant release`
- iOS (requiere macOS):
  - `npx expo run:ios --configuration Release`

### Productivo (distribución real)

Para publicar en stores necesitas build firmada y proceso de distribución.

- Android (APK/AAB firmada desde nativo):
  - `cd android && .\gradlew.bat assembleRelease` (Windows)
  - abrir `ios/*.xcworkspace` en Xcode y generar `Archive` (Release)

> Nota: para distribución profesional en ambos (sin abrir Android Studio/Xcode manualmente), se recomienda configurar EAS Build.

- **Instalar el APK en un dispositivo por USB (ADB):** activa **Depuración USB** en el teléfono (Opciones de desarrollador), conecta el cable y comprueba con `adb devices` que aparezca como `device` (acepta la huella RSA si el teléfono lo pide).
  - **Sin escribir la ruta del APK:** desde la raíz del repo, `cd android && .\gradlew.bat installRelease` (Windows) o `cd android && ./gradlew installRelease` (macOS/Linux). Compila si hace falta e instala en el dispositivo conectado.
  - **Con `adb install`:** no hace falta la ruta absoluta del disco; basta una ruta relativa al directorio donde ejecutes el comando. Desde la raíz del proyecto: `adb install -r android\app\build\outputs\apk\release\app-release.apk` (Windows) o `adb install -r android/app/build/outputs/apk/release/app-release.apk` (macOS/Linux). O entra a esa carpeta y usa solo el nombre: `adb install -r app-release.apk`.

## Estructura (alto nivel)

- `services/gasStations.service.ts`: servicio simulado con `getGasStations()` (latencia, Haversine, filtros y orden)
- `mock/gasStations.ts`: dataset de estaciones (15–20 puntos en Cali)
- `store/useGasStationsStore.ts`: Zustand (ubicación, filtros, estaciones, selección y edición en memoria)
- `hooks/useUserLocation.ts`: permisos y fallback a Cali
- `hooks/useStationsQuery.ts`: orquestación de carga desde el servicio simulado
- `components/MapViewWrapper.tsx`: mapa minimalista + clustering + marcadores
- `components/StationDetailSheet.tsx`: bottom sheet (detalle + edición)
- `components/FilterBar.tsx`: filtros (tipo + rango de precio)
- `screens/HomeScreen.tsx`: toggle mapa/lista + overlays UX

## Notas de UX

- Al abrir: carga ubicación y consulta estaciones cercanas (sin refetch por movimiento del mapa).
- Botón “Buscar en esta zona”: usa el centro actual del mapa y recalcula con el servicio simulado.
- Edición de precios: actualiza el estado global en memoria (sin persistencia real).
