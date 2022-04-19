import * as maptalks from 'maptalks';
import * as THREE from 'three';
import { ThreeLayer } from 'maptalks.three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SkyLayer from './SkyLayer';
import Popup from './popup/Popup';
import { getMtkConfig } from './config';

export interface MapProps {
  className?: string;
  styles?: object;
  options?: MapOptions;
  children?: any;
  onMouseMove?(evt): void;
  onReady?(): void;
  topicStatusChange?(topic): void;
}

export interface MapOptions {
  center?: number[];
  zoom?: number;
  baseColor?: string; // 地图空白时的颜色
  maxExtent?: boolean | [];
  maxZoom?: number;
  minZoom?: number;
  bearing?: number;
  pitch?: number;
  zoomControl?: false | zoomControlOpt;
  scale?: boolean | object;
  overviewControl?: false | overviewControlOpt;
  mousePos?: boolean | object;
  mask?: boolean | object;
  spatialReference?: object | null;
  sky?: boolean;
  fog?: null | number[];
  topicStatusChange?: void;
}

export interface zoomControlOpt {
  position: number[];
}

export interface overviewControlOpt {
  position: number[];
}

export interface IMapApp {
  map: maptalks.Map | null;
  threeLayer: ThreeLayer | null;
  vecLayer: null | maptalks.VectorLayer;
  ready: boolean;
  topics: {};
  getTopic(key): any;
  setBaseLayer(layer): void;
  addThing(opt: object): MapThing;
  addBaseTopic(opt: object): BaseTopic;
  topicStatusChange(topic): any;
  [x: string]: any;
}

export class OneMap implements IMapApp {
  [x: string]: any;
  public map: null | maptalks.Map = null;
  public threeLayer: null | ThreeLayer = null;
  public vecLayer: null | maptalks.VectorLayer = null;
  public ready = false;
  public topics = {};
  public onReady;

  static default() {
    return {
      map: null,
      threeLayer: null,
      vecLayer: null,
      ready: false,
      topics: {},
      setBaseLayer: (layer) => {},
      getTopic: (key) => {},
      topicStatusChange: (topic) => {},
      locate: () => {},
      addThing: () => {},
      addBaseTopic: (opt) => {},
      hideTopics: () => {},
      toggleTopic: () => {},
    };
  }

  constructor(
    element,
    {
      center = [122.079, 37.588],
      baseColor = '#9cbad2',
      zoom = 12,
      maxZoom,
      minZoom,
      bearing = 0,
      pitch,
      zoomControl = false,
      scale,
      maxExtent = false,
      overviewControl,
      mousePos = true,
      mask = false,
      spatialReference,
      sky = true,
      fog = [233, 233, 233],
    }: MapOptions,
    { topicStatusChange, onMouseMove, onReady }: MapProps,
  ) {
    let mapConfig = (this.mapConfig = getMtkConfig());
    center = mapConfig.mapCenter || center;
    zoom = mapConfig.mapDefaultZoom || zoom;
    maxZoom = mapConfig.maxZoom || maxZoom;
    minZoom = mapConfig.minZoom || minZoom;
    let that = this;
    if (!element) {
      return;
    }
    let map = (this.map = new maptalks.Map(element, {
      center: center,
      zoom: zoom,
      bearing: bearing,
      maxZoom: maxZoom ? maxZoom : zoom + 6,
      minZoom: minZoom ? minZoom : 2,
      fogColor: fog,
      attribution: '',
    }));
    if (pitch) map.setPitch(pitch);

    this.baseView = {
      center: center,
      zoom: zoom,
      bearing: bearing,
    };

    if (zoomControl) {
      zoomControl.position = zoomControl.position || {
        bottom: '0',
        right: '0',
      };
      map.addControl(
        new maptalks.control.Zoom({
          position: zoomControl.position,
        }),
      );
    }

    if (scale) {
      map.addControl(new maptalks.control.Scale(scale));
    }

    if (spatialReference) {
      map.setSpatialReference(spatialReference);
    }

    if (overviewControl) {
      overviewControl.position = overviewControl.position || {
        bottom: '0',
        right: '0',
      };
      map.addControl(
        new maptalks.control.Overview({
          maximize: false,
          size: [210, 140],
          position: overviewControl.position,
        }),
      );
    }

    if (maxExtent) {
      if (maxExtent instanceof Array) {
        map.setMaxExtent(maxExtent);
      } else {
        map.setMaxExtent(map.getExtent());
      }
    }

    if (topicStatusChange && typeof topicStatusChange == 'function') {
      this.topicStatusChange = topicStatusChange;
    }

    map.on('mousemove', function (evt) {
      if (onMouseMove && typeof onMouseMove == 'function') {
        onMouseMove(evt);
      }
    });

    const baseLayerKey = mapConfig['activeBaselayerConfig'];
    setBaseLayer(baseLayerKey, map);

    this.distanceTool = new maptalks.DistanceTool().addTo(map);
    this.distanceTool.disable();
    this.areaTool = new maptalks.AreaTool().addTo(map);
    this.areaTool.disable();

    this.areaTool.on('drawend', function (param) {});

    this.topics = {};

    let test = Promise.resolve('test');

    Promise.all([test, this.initThreeLayer()])
      .then(([test, threeLayer]) => {
        if (onReady && typeof onReady == 'function') {
          this.ready = true;
          onReady();
        }
      })
      .catch((err) => {});

    map.on('click', (evt) => {
      this.popup.checkClose('');
    });

    this.popup = new Popup(map, {
      eventsPropagation: false,
      draggable: false,
      animation: 'fade',
    });

    if (sky) {
      const skyLayer = new SkyLayer('sky', {
        zIndex: -Infinity,
      });
      map.addLayer(skyLayer);
    }

    this.vecLayer = this.newVectorLayer('base-vecLayer');
  }

  resetView() {
    this.map.setView(this.baseView);
  }

  initThreeLayer() {
    this.gltfLoader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      let threeLayer = (this.threeLayer = new ThreeLayer('three'));
      ThreeLayer.prototype.coordinateToXYZ = function (coordinate, height = 0) {
        const z = this.distanceToVector3(height, height).x;
        return this.coordinateToVector3(coordinate, z);
      };
      // ThreeLayer.prototype.toText = function (coordinate, options) {
      //     return new TextSprite(coordinate, options, this);
      // }
      threeLayer.prepareToDraw = function (gl, scene, camera) {
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 10, 10).normalize();
        scene.add(new THREE.AmbientLight('#fff'));
        scene.add(light);
        resolve(threeLayer);
      };
      this.threeLayer.config('animation', true);
      this.threeLayer.addTo(this.map);
    });
  }

  locate(center, zoom) {
    this.map.animateTo({
      center: center,
      zoom: zoom,
    });
  }

  setBaseLayer(layer) {
    setBaseLayer(layer, this.map);
  }

  /**
   * 加载对象（广义）的统一框架
   * @param {} param0
   */
  addThing({ name, onPrepare, onAdd, onShow, onHide, onRemove, onZoomend, lazy = true }) {
    return new MapThing(this, {
      name,
      onPrepare,
      onAdd,
      onShow,
      onHide,
      onRemove,
      onZoomend,
      lazy,
    });
  }

  /**
   * 加载基础专题图
   * @param {} param0
   */
  addBaseTopic({ name, onPrepare, onAdd, onShow, onHide, onRemove, onZoomend, lazy = true }) {
    return new BaseTopic(this, {
      name,
      onPrepare,
      onAdd,
      onShow,
      onHide,
      onRemove,
      onZoomend,
      lazy,
    });
  }

  addTopic(topic) {
    this.topics[topic.name] = topic;
  }

  topicStatusChange(topic) {}

  //隐藏所有专题图
  hideTopics() {
    if (this.popup) {
      this.popup.popClose();
    }
    for (let key in this.topics) {
      this.topics[key].hide();
    }
  }

  getTopic(key) {
    return this.topics[key];
  }

  //切换图层显隐
  toggleTopic(name, flag) {
    if (!this.topics.hasOwnProperty(name)) {
      return {
        success: false,
        info: '未注册的图层：' + name,
      };
    }
    if (flag) {
      this.TopicLayerHistory.push(name);
      this.topics[name].show();
    } else {
      this.topics[name].hide();
    }
    return {
      success: true,
      info: '',
    };
  }

  newVectorLayer(id: string, opt: undefined | {}) {
    return newVectorLayer(id, this.map, opt);
  }

  setBaseLayerStyle(style: string) {
    this.map.getBaseLayer().setOptions({
      cssFilter: style,
    });
  }
}

export const setBaseLayer = (layerKey, map) => {
  let mapConfig = getMtkConfig();
  switch (layerKey) {
    case 'baidu':
      map.setSpatialReference({
        projection: 'baidu',
      });
      const BaiduLayerConfig = mapConfig[mapConfig['activeBaselayerConfig']];
      map.setBaseLayer(new maptalks.TileLayer('base-baidu', BaiduLayerConfig));
      break;
    case 'qds.sd':
      map.setSpatialReference({
        projection: 'EPSG:4326',
      });
      const QDSLayerConfig = mapConfig[mapConfig['activeBaselayerConfig']];
      map.setBaseLayer(new maptalks.TileLayer('base-qds.sd', QDSLayerConfig));
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

export const newVectorLayer = (id, map, opt: undefined | {}) => {
  return new maptalks.VectorLayer(id, opt || {}).addTo(map);
};

export interface IMapThingOption {
  name: string;
  onPrepare?(thing: MapThing, app: any): void;
  onAdd(thing: MapThing, app: any): void;
  onShow(thing: MapThing, app: any): void;
  onHide(thing: MapThing, app: any): void;
  onRemove(thing: MapThing, app: any): void;
  onZoomend?: void;
  lazy: boolean;
}

export class MapThing {
  [x: string]: any;
  public name = '';
  public visible = false;
  public lazy = false;
  public init = false;
  private app = null;
  public statusChange = () => {};
  public show;
  public hide;
  public remove;

  constructor(app, opt: IMapThingOption) {
    this.app = app;
    if (!opt.name) {
      console.error('未提供专题层命名');
      return;
    }
    this.name = opt.name;
    if (!app) {
      console.error(`未提供专题层context-${opt.name}`);
      return;
    }
    if (!(opt.onAdd && typeof opt.onAdd == 'function')) {
      console.error('未定义' + opt.name + '-onadd方法');
      return;
    }
    if (!(opt.onShow && typeof opt.onShow == 'function')) {
      console.error('未定义' + opt.name + '-onShow方法');
      return;
    }
    if (!(typeof opt.onHide == 'function')) {
      console.error('未定义' + opt.name + '-onHide方法');
      return;
    }

    this.statusChange = () => {
      app.topicStatusChange(this);
    };

    if (opt.onPrepare && typeof opt.onPrepare == 'function') {
      opt.onPrepare(this, app);
    }

    this.show = () => {
      if (!this.init && !this.lazy) {
        this.init = true;
        opt.onAdd(this, app);
      }
      opt.onShow(this, app);
      this.visible = true;
      this.statusChange();
    };

    this.hide = () => {
      opt.onHide(this, app);
      this.visible = false;
      this.statusChange();
      if (app.popup) app.popup.checkClose(this.name);
    };

    this.remove = () => {
      if (opt.onRemove && typeof opt.onRemove == 'function') opt.onRemove(this, app);
      delete app.topics[this.name];
    };
    app.addTopic(this);
  }
}

export interface IBaseTopicOption {
  name: string;
  onPrepare?(thing: BaseTopicThing, app: any): void;
  onAdd(thing: BaseTopicThing, app: any): void;
  onShow?(thing: BaseTopicThing, app: any): void;
  onHide?(thing: BaseTopicThing, app: any): void;
  onRemove?(thing: BaseTopicThing, app: any): void;
  onZoomend?: void;
  lazy: boolean;
}

export class BaseTopic {
  [x: string]: any;
  public name = '';
  public visible = false;
  public lazy = false;
  public init = false;
  private app = null;
  public statusChange = () => {};
  public show;
  public hide;
  public remove;
  public layer;

  constructor(app, opt: IBaseTopicOption) {
    this.app = app;
    if (!opt.name) {
      console.error('未提供专题层命名');
      return;
    }
    this.name = opt.name;
    this.layer = new maptalks.VectorLayer(this.name).addTo(app.map).hide();
    if (!app) {
      console.error(`未提供专题层context-${opt.name}`);
      return;
    }
    if (!(opt.onAdd && typeof opt.onAdd == 'function')) {
      console.error('未定义' + opt.name + '-onadd方法');
      return;
    }

    this.statusChange = () => {
      app.topicStatusChange(this);
    };

    if (opt.onPrepare && typeof opt.onPrepare == 'function') {
      opt.onPrepare(this, app);
    }

    this.show = () => {
      if (!this.init && !this.lazy) {
        opt.onAdd(this, app);
        this.init = true;
      }
      this.layer.show();
      this.layer.bringToFront();
      if (opt.onShow && typeof opt.onShow == 'function') opt.onShow(this, app);
      this.visible = true;
      this.statusChange();
    };

    this.hide = () => {
      this.layer.hide();
      if (opt.onHide && typeof opt.onHide == 'function') opt.onHide(this, app);
      this.visible = false;
      this.statusChange();
      if (app.popup) app.popup.checkClose(this.name);
    };

    this.remove = () => {
      app.map.remove(this.layer);
      if (opt.onRemove && typeof opt.onRemove == 'function') opt.onRemove(this, app);
      delete app.topics[this.name];
    };

    app.addTopic(this);

    return this;
  }
}
