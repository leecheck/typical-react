export function getMtkConfig() {
  return {
    spatialReference: 'baidu',
    maxExtent: true,
    activeBaselayerConfig: 'qds.sd',
    mapDefaultZoom: 8.8,
    mapCenter: [120.466842, 36.114364],
    minZoom: 8,
    maxZoom: 18,
    'qds.sd': {
      tileSystem: [1, -1, -180, 90],
      urlTemplate:
        'https://t1.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=0c005ba20f7255ad23ebd218a6f2acdd',
      cssFilter:
        'brightness(74%) contrast(100%) sepia(100%) invert(100%) saturate(100%) grayscale(0%) opacity(100%) hue-rotate(328deg)',
    },
    baiduOffline: {
      urlTemplate: 'http://192.168.13.23:32066/localAsset/tiles/{z}/{x}/{y}.png',
      cssFilter:
        'brightness(74%) contrast(100%) sepia(100%) invert(100%) saturate(100%) grayscale(0%) opacity(100%) hue-rotate(328deg)',
    },
    baiduOnline: {
      urlTemplate:
        'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
      subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      cssFilter:
        'brightness(74%) contrast(100%) sepia(100%) invert(100%) saturate(100%) grayscale(0%) opacity(100%) hue-rotate(0deg)',
    },
  };
}
