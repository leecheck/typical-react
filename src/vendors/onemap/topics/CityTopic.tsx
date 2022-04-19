import * as maptalks from 'maptalks';
import * as THREE from 'three';
import React, { useContext, useRef } from 'react';
import { withOneMap, MapContext } from '../OneMap';
import { MapThing, IMapThingOption, BaseTopic, IBaseTopicOption, IMapApp } from '../lib/MapApp';
import { LinearGradientMaterial } from 'vendors/onemap/lib/utils/texture';
import RippleWall from 'vendors/onemap/lib/RippleWall';
import TextSprite from 'vendors/onemap/lib/TextSprite';
import { ThreeLayer } from 'maptalks.three';

require('app/sub-apps-common/onemap/asset/styles/citytopic.scss');

interface IProps {
  city: any;
  show: boolean;
  activeArea?: string;
  refData?: object;
  onSelect?: (areaId: string) => void;
  renderToolTip: (prop: any) => void;
}

function CityTopicFunction(props: IProps) {
  const topic = useRef<MapThing | null>(null);

  const stop1 = [
    [0, '#4C83FF'],
    [1, '#1C5180'],
  ];
  const stop2 = [
    [0, '#03FDCA'],
    [1, '#039376'],
  ];
  const stop3 = [
    [0, '#416ed6'],
    [1, '#153c5f'],
  ];
  const opacity = 0.92;
  const cityLineColor = '#90E0F7';

  const renderCityToolTip = (prop, subDatas) => {
    const acode = prop.adcode;
    const data = subDatas[acode];
    if (!data) {
      return `<div class='city-topic' style=''>
          <div class='tooltip-row'> <div class='tooltip-title'>暂无数据</div> </div>
          <div>`;
    }
    return `
        <div class='city-topic' style=''>
        <div class='tooltip-row'> <div class='tooltip-title'>人脸图片</div> <div class='tooltip-num'>${data.faceSnapCount}</div> </div>
        <div class='tooltip-row'> <div class='tooltip-title'>人体图片</div> <div class='tooltip-num'>${data.bodySnapCount}</div> </div>
        <div class='tooltip-row'> <div class='tooltip-title'>车辆图片</div> <div class='tooltip-num'>${data.carSnapCount}</div> </div>
        <div class='tooltip-row'> <div class='tooltip-title'>门禁抓拍</div> <div class='tooltip-num'>${data.accessControlSnapCount}</div> </div>
        <div>
        `;
  };

  const app = useContext(MapContext);
  React.useEffect(() => {
    topic.current = app.addThing({
      name: 'CityTopic',
      onPrepare: (topic, app) => {
        topic.extrudepolygons = [];
        topic.features = [];
        topic.selectedArea = '';
        topic.material = LinearGradientMaterial(stop1, opacity);
        topic.lineMaterial = new THREE.LineBasicMaterial({ color: cityLineColor });
        topic.hovermaterial = LinearGradientMaterial(stop3, opacity);
        topic.highlightmaterial = LinearGradientMaterial(stop2, opacity);
        app.threeLayer.bloomEnable = true;
        ThreeLayer.prototype.toText = function (coordinate, options) {
          return new TextSprite(coordinate, options, this);
        };
        topic.resetStyle = () => {
          topic.extrudepolygons.forEach((polygon) => {
            polygon.setSymbol(topic.material);
          });
        };
        topic.activePolygon = (activeId: string) => {
          topic.selectedArea = activeId;
          topic.resetStyle();
          topic.extrudepolygons.forEach((poly) => {
            if (poly.options.adcode == topic.selectedArea) {
              poly.setSymbol(topic.highlightmaterial);
            }
          });
        };
        topic.updateTooltip = (subDatas) => {
          topic.extrudepolygons.forEach((poly) => {
            poly.setToolTip(renderCityToolTip(poly.options, subDatas), {
              showTimeout: 500,
              eventsPropagation: true,
            });
          });
        };
        topic.addExtrudePolygon = (geojson) => {
          app.threeLayer.removeMesh(topic.extrudepolygons);
          app.threeLayer.removeMesh(topic.features);
          topic.extrudepolygons = [];
          topic.features = [];
          let idx = 0;
          geojson.features.slice(0, Infinity).forEach((f) => {
            const properties = f.properties;
            const lineStrings = [];
            const geometry = f.geometry;
            if (geometry.type === 'MultiPolygon') {
              geometry.coordinates.forEach((coordinates) => {
                lineStrings.push(new maptalks.LineString(coordinates[0]));
              });
            } else {
              lineStrings.push(new maptalks.LineString(geometry.coordinates[0]));
            }
            const polygon = app.threeLayer.toExtrudePolygon(
              f,
              { height: 3000, interactive: true, topColor: '#fff', ...properties },
              //topic.material
              topic.material,
            );
            ['mouseout', 'mouseover', 'click'].forEach(function (eventType) {
              polygon.on(eventType, function (e) {
                if (e.type === 'mouseout' && this.options.adcode != topic.selectedArea) {
                  this.setSymbol(topic.material);
                }
                if (e.type === 'mouseover' && this.options.adcode != topic.selectedArea) {
                  this.setSymbol(topic.hovermaterial);
                }
                if (e.type === 'click') {
                  topic.resetStyle();
                  topic.selectedArea = this.options.adcode;
                  this.setSymbol(topic.highlightmaterial);
                  props.onSelect && props.onSelect(this.options.adcode);
                }
              });
            });
            topic.extrudepolygons.push(polygon);
            lineStrings.forEach((lineString) => {
              const line = app.threeLayer.toLine(
                lineString,
                { altitude: 3001, interactive: false },
                topic.lineMaterial,
              );
              topic.features.push(line);
            });
            topic.features.push(
              app.threeLayer.toText(properties.centroid, {
                text: properties.name,
                color: 'white',
                fontSize: 30,
                interactive: false,
                altitude: 5000,
              }),
            );
            idx++;
          });
          app.threeLayer.addMesh(topic.extrudepolygons);
          app.threeLayer.addMesh(topic.features);
        };
      },
      onAdd: (topic, app) => {},
      onShow: (topic, app) => {
        topic.extrudepolygons.forEach((object) => {
          object.show();
        });
      },
      onHide: (topic, app) => {
        topic.extrudepolygons.forEach((object) => {
          object.hide();
        });
      },
      onRemove: () => {},
      lazy: false,
    });
    toogleShow();
  }, []);

  const toogleShow = () => {
    if (topic.current) {
      props.show ? topic.current.show() : topic.current.hide();
    }
  };

  React.useEffect(() => {
    if ((props.activeArea || props.activeArea == '') && topic.current)
      topic.current.activePolygon(props.activeArea);
  }, [props.activeArea]);

  React.useEffect(() => {
    toogleShow();
  }, [props.show]);

  React.useEffect(() => {
    if (props.city && topic.current) topic.current.addExtrudePolygon(props.city);
  }, [props.city]);

  React.useEffect(() => {
    if (props.refData && topic.current) topic.current.updateTooltip(props.refData);
  }, [props.refData]);

  return null;
}

export const CityTopic = withOneMap(CityTopicFunction);
