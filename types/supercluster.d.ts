declare module 'supercluster' {
  type MapPoint = { type: 'Point'; coordinates: [number, number] };

  type MapFeature<P = Record<string, unknown>> = {
    type: 'Feature';
    geometry: MapPoint;
    properties: P | null;
  };

  export type SuperclusterOptions = {
    minZoom?: number;
    maxZoom?: number;
    radius?: number;
    extent?: number;
    nodeSize?: number;
  };

  export default class SuperCluster {
    constructor(options?: SuperclusterOptions);
    load(points: MapFeature[]): this;
    getClusters(bbox: [number, number, number, number], zoom: number): MapFeature[];
    getLeaves(clusterId: number, limit?: number, offset?: number): MapFeature[];
    getClusterExpansionZoom(clusterId: number): number;
  }
}
