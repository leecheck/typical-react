import * as maptalks from 'maptalks';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import { IFDeviceInfo } from 'app-vendors/types';
import PopUp from './popup-collect/Popup';

import configureStore from 'store/configureStore';
const initialState = {};
export const store = configureStore(initialState);

interface IEquipPopOpt {
  key?: string; // 区分多类弹窗
  eventsPropagation?: boolean;
  draggable: boolean;
  dx: number;
  dy: number;
  animation: string;
  content?: any;
  contentWidth?: number;
  contentHeight?: number;
  guideLine1len?: number;
  guideLine1top?: number;
  guideLine2top?: number;
  lineColor?: string;
  bgColor?: string;
  contentdx?: number;
}

interface IPopData {
  type: string;
  data: any;
}

export default class Popup {
  /**
   * 计算偏移
   * @param {*} map
   */
  private map;
  public key;
  public popData: IPopData;
  private popMarker: any;
  public opt: IEquipPopOpt;

  constructor(
    map: any,
    opt: IEquipPopOpt = {
      key: '',
      draggable: false,
      dx: 0,
      dy: 0,
      animation: 'fade',
      contentWidth: 600,
      contentHeight: 400,
    },
  ) {
    this.key = opt.key;
    this.map = map;
    this.popData = {
      type: '',
    } as IPopData;
    this.opt = opt;

    this.popMarker = undefined;
    this.map.closePop = () => {
      this.popClose();
    };

    this.opt.contentWidth = opt.contentWidth || 600;
    this.opt.contentHeight = opt.contentHeight || 400;

    this.opt.guideLine1len = 50;
    this.opt.guideLine1top = 50;
    this.opt.guideLine2top = 32;
    this.calcOffset();

    this.opt.lineColor = '#00daf8';
    this.opt.bgColor = '#02003D';
  }

  calcOffset() {
    this.opt.contentdx = this.opt.guideLine1top! + this.opt.guideLine1len! * Math.cos(Math.PI / 4);
    //this.opt.dx = this.opt.contentWidth / 2 - 5;
    this.opt.dy = -(this.opt.guideLine1top + (this.opt.guideLine1len! * Math.cos(Math.PI / 4) + 5));
  }

  popClose() {
    this.popMarker ? this.popMarker.hide() : 0;
    this.onClose && this.onClose();
  }

  checkClose(type: string) {
    if (this.popData.type.includes(type)) {
      this.popClose();
    }
  }

  onItemClick(key: string, data) {}

  popShow(lonlat: any, popData: IPopData) {
    let that = this;
    let opt = this.opt;
    this.popData = popData;
    let divElement = document.getElementById('markerPopup' + that.key);
    if (!divElement) {
      divElement = document.createElement('div');
      divElement.setAttribute('id', 'markerPopup' + that.key);
    }
    ReactDOM.render(
      <Provider store={store}>
        <React.Fragment>
          <div className={'mtk-pop-camera'} style={{ position: 'absolute', left: `10px` }}>
            <PopUp
              onItemClick={that.onItemClick}
              onClose={() => {
                that.popClose();
              }}
              data={popData.data}
            ></PopUp>
          </div>
        </React.Fragment>
      </Provider>,
      divElement,
    );
    this.opt.content = divElement;
    if (!this.popMarker) {
      this.popMarker = new maptalks.ui.UIMarker(lonlat, this.opt).addTo(this.map);
      this.popMarker.on('click', (e) => {});
    } else {
      this.popMarker.setOptions(this.opt);
      this.popMarker.setCoordinates(new maptalks.Coordinate(lonlat));
    }
    if (!this.popMarker.isVisible()) {
      this.popMarker.show();
    }
  }
}
