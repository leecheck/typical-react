import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { BaseObject } from 'maptalks.three';
import flvjs from 'flv.js';

let OPTIONS = {
  elevation: 0,
  color: '#0099FF',
  opacity: 0.5,
  center: [120, 36],
};

export default class VideoPlane extends BaseObject {
  /**
   * 构造方法
   * @param {*} poly [[lon,lat],[lon,lat]] 连续的线 需要用来构造polygon 简单图形未做复杂扣除等处理
   * @param {*} options
   * @param {*} layer
   */
  constructor(pg, options, layer) {
    options = maptalks.Util.extend({}, OPTIONS, options, { layer, pg });
    super();
    this._initOptions(options);
    const video = document.createElement('video');
    // video.src = "/1.mp4";
    // video.muted = true;
    // video.loop = true;
    // video.play();

    this.flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url: 'http://192.168.13.33:7080/live/6.flv',
    });
    this.flvPlayer.attachMediaElement(video);
    this.flvPlayer.load();
    //this.flvPlayer.play();
    let material = new THREE.MeshBasicMaterial({ map: new THREE.VideoTexture(video) });
    const z = options.elevation || 0;
    pg.rotateX(Math.PI / 2);
    this._createMesh(pg, material);
    const center = options.center;
    const realPos = layer.coordinateToVector3(center, z);
    this.getObject3d().position.copy(realPos);
  }

  play() {
    if (this.flvPlayer) this.flvPlayer.play();
  }

  _animation() {}
}
