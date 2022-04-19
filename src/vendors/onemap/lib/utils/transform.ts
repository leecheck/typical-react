import { wktToGeoJSON, geojsonToWKT } from '@terraformer/wkt';
import * as maptalks from 'maptalks';
import { ISimpleGeoJson, IGeoJson } from 'app-vendors/deep-eye/react-leaflet/geojsonpolygon';

import {
  booleanContains,
  booleanOverlap,
  booleanCrosses,
  booleanDisjoint,
  booleanEqual,
  difference,
} from '@turf/turf';

export function ToGeoJSON(wkt: string, props?: Object) {
  try {
    let gson = wktToGeoJSON(wkt);
    if (gson) {
      if (props) gson['properties'] = props;
    }
    return gson;
  } catch (error) {
    return null;
  }
}

export const getwktPolygon = (wkt: string) => {
  try {
    const geojson = wktToGeoJSON(wkt);
    let polygon = new maptalks.Geometry.fromJSON(geojson);
    return polygon;
  } catch (error) {
    return null;
  }
};

// 图形分离 但允许接边
export const separated = (poly1: ISimpleGeoJson, poly2: ISimpleGeoJson) => {
  try {
    const cut = difference(poly1, poly2);
    if (!cut) {
      // 有一个是null的 说明包含
      return false;
    }
    return booleanEqual(cut.geometry, poly1); // 运算出的图形不等于他本身 说明是分离的
  } catch (error) {
    return false;
  }
};

// 图形第二个在第一个内部 且允许接边
export const coverd = (poly1: ISimpleGeoJson, poly2: ISimpleGeoJson) => {
  try {
    return difference(poly1, poly2) && !difference(poly2, poly1);
  } catch (error) {
    return false;
  }
};
