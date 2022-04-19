import * as maptalks from 'maptalks';

export const setBaseLayer = (layerKey, map) => {
  switch (layerKey) {
    case 'baidu':
      map.setSpatialReference({
        projection: 'baidu',
      });
      map.setBaseLayer(
        new maptalks.TileLayer('base-baidu', {
          urlTemplate:
            'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
          subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          cssFilter:
            'brightness(74%) contrast(100%) sepia(100%) invert(100%) saturate(100%) grayscale(0%) opacity(100%) hue-rotate(328deg)',
        }),
      );
      break;
    case 'esri':
      map.setSpatialReference(null);
      map.setBaseLayer(
        new maptalks.TileLayer('base-esri', {
          urlTemplate:
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        }),
      );
      break;
  }
};

export const newVectorLayer = (id, map) => {
  return new maptalks.VectorLayer(id).addTo(map);
};
