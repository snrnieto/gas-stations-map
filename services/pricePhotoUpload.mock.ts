/**
 * Subida de foto de precios.
 *
 * La URI (`file://…`) solo indica **dónde está el archivo en el dispositivo**. En la red **no**
 * se envía esa cadena como sustituto del archivo: igual que en web con `<input type="file">`,
 * el cliente arma **multipart/form-data** y el runtime de React Native **lee el fichero** desde
 * esa ruta y envía los **bytes** en el cuerpo.
 *
 * Patrón equivalente al web:
 * `formData.append('photo', fileBlob)` → aquí `append('photo', { uri, name, type })` es la forma
 * nativa de referenciar el mismo binario en iOS/Android.
 */

/**
 * Cuerpo listo para `fetch(url, { method: 'POST', body: formData })`.
 * No pongas `Content-Type` manual: el cliente fija el boundary del multipart.
 */
export function buildPricePhotoFormData(uri: string, stationId: string): FormData {
  const formData = new FormData();
  formData.append('station_id', stationId);
  formData.append('photo', {
    uri,
    name: 'price-board.jpg',
    type: 'image/jpeg',
  } as any);
  return formData;
}

/**
 * Sustituir por algo como:
 *
 * ```ts
 * const res = await fetch(`${API_URL}/stations/price-photo`, {
 *   method: 'POST',
 *   body: buildPricePhotoFormData(uri, stationId),
 *   headers: { Authorization: `Bearer ${token}` },
 * });
 * if (!res.ok) throw new Error(await res.text());
 * ```
 */
export async function uploadPricePhotoMock(uri: string, stationId: string): Promise<void> {
  void buildPricePhotoFormData(uri, stationId);
  await new Promise<void>((resolve) => setTimeout(resolve, 1800));
}
