import { polygon, pointOnFeature, centroid } from '@turf/turf';
import * as maptalks from 'maptalks';

let symbols = {},
  base = {};
let TDTToken = '0c005ba20f7255ad23ebd218a6f2acdd';

/**
 *  symbols
 */

/**
 *
 * @param {*} angle
 * @param {*} datetime
 * @param {*} level
 * @param {*} type
 */
symbols.AISPoint = function (angle, datetime, level, type) {
  const rotate = level && level > 10 ? true : false;
  let symbol = {
    markerType: rotate ? 'triangle' : 'ellipse',
    markerFill: fillColor,
    markerLineColor: rotate ? '#000000' : '#ffffff',
    markerLineWidth: rotate ? 1 : 0,
    markerWidth: rotate ? 10 : 5,
    markerHeight: rotate ? 20 : 5,
    markerRotation: 0,
  };
  let fillColor = '#0000ff';
  if (typeof key === 'object') {
    const gSymbol = key.getSymbol();
    symbol.markerFill = gSymbol.markerFill;
    symbol.markerRotation = gSymbol.markerRotation;
  } else {
    const current = new Date().getTime();
    const updateDate = new Date(datetime).getTime();
    const between = current - updateDate;
    if (between < 1000 * 60 * 30) {
      switch (type) {
        case '0':
          symbol.markerFill = '#f9f1da';
          break;
        case 'experiment':
          symbol.markerFill = '#3366cc';
          break;
        default:
          symbol.markerFill = '#f9f1da';
      }
    } else {
      symbol.markerFill = '#f9f1da';
    }
    symbol.markerRotation = Number(angle);
  }
  return symbol;
};

symbols.colorPoint = function ({ size = 30, color = '#f41261', labelField }) {
  let symbol = [
    {
      markerType: 'ellipse',
      markerFill: '#fff',
      markerFillOpacity: 1,
      markerWidth: 2,
      markerHeight: 2,
      markerLineWidth: 0,
    },
    {
      markerType: 'ellipse',
      markerFill: color,
      markerFillOpacity: 0.8,
      markerWidth: size * 0.4,
      markerHeight: size * 0.4,
      markerLineWidth: 0,
    },
    {
      markerType: 'ellipse',
      markerFill: color,
      markerFillOpacity: 0.3,
      markerWidth: size * 0.8,
      markerHeight: size * 0.8,
      markerLineWidth: 0,
    },
    {
      markerType: 'ellipse',
      markerFill: color,
      markerFillOpacity: 0.2,
      markerWidth: size,
      markerHeight: size,
      markerLineWidth: 0,
    },
  ];
  if (labelField && labelField.label) {
    symbol.push(symbols.addLabel(labelField));
  }
  return symbol;
};

symbols.addLabel = ({
  label,
  textDy,
  textDx,
  textSize,
  textFill,
  textHaloFill,
  textHaloRadius,
}) => {
  if (label) {
    return {
      textName: '{' + label + '}',
      textSize: textSize || 12,
      textFill: textFill || '#02F1F3',
      textWeight: 400,
      textHorizontalAlignment: 'right',
      textHaloFill: textHaloFill || '#0e56a8',
      textHaloRadius: textHaloRadius || 1,
      textDy: textDy || 6,
      textDx: textDx || 10,
    };
  }
};

symbols.getPatternSymbol = function (pattern, fillAlpha, key, lineColor, dash) {
  //图案base64填充
  let alpha = fillAlpha || 0.8;
  let line = lineColor || '#121212';
  let symbol = [];
  var poly = {
    polygonOpacity: alpha,
    polygonPatternFile: pattern,
    lineColor: line,
    lineWidth: 0.5,
    lineOpacity: 0.8,
  };
  if (dash) {
    poly.lineDasharray = dash;
  }
  symbol.push(poly);
  if (key) {
    symbol.push({
      textName: '{' + key + '}',
      textSize: 14,
      textFill: '#fff',
      textHaloFill: '#101010',
      textHaloRadius: 2,
      textHorizontalAlignment: 'middle',
      textWeight: 400,
    });
  }
  return symbol;
};

symbols.Icon = ({ icon, width = 32, height = 32, dx = 16, dy = -16, labelField }) => {
  let symbol = [
    {
      markerFile: icon,
      markerPlacement: 'vertex-last', //vertex, point, vertex-first, vertex-last, center
      markerVerticalAlignment: 'middle',
      markerWidth: width,
      markerHeight: height,
    },
  ];
  if (labelField && labelField.label) {
    symbol.push(symbols.addLabel(labelField));
  }
  return symbol;
};

/**
 *  base
 */

base.TileTpl = {
  google: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
  'geoq.blue':
    'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
  'geoq.color':
    'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
  'geoq.gray':
    'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
  'carto.dark': 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  'carto.light': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  'esri.image':
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  ht: 'http://www.oceanread.com:213/arcgis/rest/services/chart/chartAll/MapServer/tile/{z}/{y}/{x}',
  'TDT.Normal': 'http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=' + TDTToken,
  'TDT.Normal_Label':
    'http://t{s}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=' + TDTToken,
  'TDT.Satellite':
    'http://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=' + TDTToken,
  'TDT.Satellite_Label':
    'http://t{s}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=' + TDTToken,
  'TDT.Terrain': 'http://t{s}.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=' + TDTToken,
};

base.TileDomain = {
  numSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
  codeSubdomains: ['a', 'b', 'c'],
};

base.TileLayer = {
  'TDT.Normal': new maptalks.GroupTileLayer('group', [
    new maptalks.TileLayer('TDT.Normal', {
      urlTemplate: base.TileTpl['TDT.Normal'],
      subdomains: base.TileDomain['numSubdomains'],
    }),
    new maptalks.TileLayer('TDT.Normal_Label', {
      urlTemplate: base.TileTpl['TDT.Normal_Label'],
      subdomains: base.TileDomain['numSubdomains'],
    }),
  ]),
  'TDT.Satellite': new maptalks.TileLayer('TDT.Satellite', {
    urlTemplate: base.TileTpl['TDT.Satellite'],
    subdomains: base.TileDomain['numSubdomains'],
  }),
  'carto.light': new maptalks.TileLayer('carto.light', {
    urlTemplate: base.TileTpl['carto.light'],
    subdomains: base.TileDomain['codeSubdomains'],
  }),
  'geoq.blue': new maptalks.TileLayer('GeoQ', {
    urlTemplate: base.TileTpl['geoq.blue'],
    cssFilter: ' brightness(120%)',
    maxAvailableZoom: 16,
  }),
  'esri.image': new maptalks.GroupTileLayer('group', [
    new maptalks.TileLayer('esri', {
      urlTemplate: base.TileTpl['esri.image'],
      maxAvailableZoom: 17,
    }),
    // new maptalks.TileLayer('TDT.Normal_Label', {
    //     'urlTemplate': base.TileTpl["TDT.Normal_Label"],
    //     'subdomains': base.TileDomain["numSubdomains"]
    // })
  ]),
  ht: new maptalks.TileLayer('ht', {
    urlTemplate: base.TileTpl.ht,
    maxAvailableZoom: 12,
  }),
  'carto.blue': new maptalks.TileLayer('carto.blue', {
    urlTemplate: base.TileTpl['carto.light'],
    subdomains: ['a', 'b', 'c', 'd'],
    cssFilter: ' sepia(95%) invert(95%) brightness(180%) hue-rotate(315deg) ',
  }),
};

let StaticConf = {
  MousePos: {
    position: {
      bottom: '0',
      left: '0',
    },
  },
  ScaleConf: {
    position: 'bottom-right',
    maxWidth: 150,
    metric: true,
    imperial: false,
    //containerClass:'map-scale'
  },
  Distence: {
    symbol: {
      lineColor: '#34495e',
      lineWidth: 2,
    },
    vertexSymbol: {
      markerType: 'ellipse',
      markerFill: '#1bbc9b',
      markerLineColor: '#000',
      markerLineWidth: 3,
      markerWidth: 10,
      markerHeight: 10,
    },
    labelOptions: {
      textSymbol: {
        textFaceName: 'monospace',
        textFill: '#fff',
        textLineSpacing: 1,
        textHorizontalAlignment: 'right',
        textDx: 15,
        markerLineColor: '#b4b3b3',
        markerFill: '#000',
      },
      boxStyle: {
        padding: [6, 2],
        symbol: {
          markerType: 'square',
          markerFill: '#000',
          markerFillOpacity: 0.9,
          markerLineColor: '#b4b3b3',
        },
      },
    },
    clearButtonSymbol: [
      {
        markerType: 'square',
        markerFill: '#000',
        markerLineColor: '#b4b3b3',
        markerLineWidth: 2,
        markerWidth: 15,
        markerHeight: 15,
        markerDx: 20,
      },
      {
        markerType: 'x',
        markerWidth: 10,
        markerHeight: 10,
        markerLineColor: '#fff',
        markerDx: 20,
      },
    ],
    language: 'zh-CN',
  },
  Area: {
    symbol: {
      lineColor: '#1bbc9b',
      lineWidth: 2,
      polygonFill: '#fff',
      polygonOpacity: 0.3,
    },
    vertexSymbol: {
      markerType: 'ellipse',
      markerFill: '#34495e',
      markerLineColor: '#1bbc9b',
      markerLineWidth: 3,
      markerWidth: 10,
      markerHeight: 10,
    },
    labelOptions: {
      textSymbol: {
        textFaceName: 'monospace',
        textFill: '#fff',
        textLineSpacing: 1,
        textHorizontalAlignment: 'right',
        textDx: 15,
      },
      boxStyle: {
        padding: [6, 2],
        symbol: {
          markerType: 'square',
          markerFill: '#000',
          markerFillOpacity: 0.9,
          markerLineColor: '#b4b3b3',
        },
      },
    },
    clearButtonSymbol: [
      {
        markerType: 'square',
        markerFill: '#000',
        markerLineColor: '#b4b3b3',
        markerLineWidth: 2,
        markerWidth: 15,
        markerHeight: 15,
        markerDx: 22,
      },
      {
        markerType: 'x',
        markerWidth: 10,
        markerHeight: 10,
        markerLineColor: '#fff',
        markerDx: 22,
      },
    ],
    language: 'zh-CN',
  },
};

export { symbols, base, StaticConf };
