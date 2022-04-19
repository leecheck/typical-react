import * as maptalks from 'maptalks';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import { ICameraInfo } from 'app-vendors/types';
import PopupContent from './popup-collect/PopupContent';

import configureStore from 'store/configureStore';
import { calendarFormat } from 'moment';
const initialState = {};
export const store = configureStore(initialState);

interface IPopOpt {
  eventsPropagation?: boolean;
  draggable: boolean;
  animation: string;
  content?: any;
  dx?: number;
  dy?: number;
  contentWidth?: number;
  contentHeight?: number;
  guideLine1len?: number;
  guideLine1top?: number;
  guideLine2top?: number;
  lineColor?: string;
  bgColor?: string;
  contentdx?: number;
}

interface IPopFrame {
  width: number;
  height: number;
}

interface IPopData {
  popType: string;
  equip: ICameraInfo;
}

export default class Popup {
  /**
   * 计算偏移
   * @param {*} map
   */
  private map;
  public popData: IPopData;
  private popMarker: any;
  public opt: IPopOpt;

  constructor(map: any, opt: IPopOpt) {
    this.map = map;
    this.popData = {
      popType: '',
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

  setFrame(width: number, height: number) {
    this.opt.contentWidth = width;
    this.opt.contentHeight = height;
    this.calcOffset();
  }

  calcOffset() {
    this.opt.contentdx = this.opt.guideLine1top! + this.opt.guideLine1len! * Math.cos(Math.PI / 4);
    //this.opt.dx = this.opt.contentWidth / 2 - 5;
    this.opt.dy = -(
      this.opt.guideLine1top! +
      (this.opt.guideLine1len! * Math.cos(Math.PI / 4) + 5)
    );
  }

  popClose() {
    this.popMarker ? this.popMarker.hide() : 0;
  }

  checkClose(type: string) {
    if (this.popData.popType.includes(type)) {
      this.popClose();
    }
  }

  popShow(lonlat: any, popData: IPopData, frame: IPopFrame) {
    let that = this;
    let opt = this.opt;
    if (frame) {
      this.setFrame(frame.width, frame.height);
    }
    this.popData = popData;
    let divElement = document.getElementById('markerPopup');
    if (!divElement) {
      divElement = document.createElement('div');
      divElement.setAttribute('id', 'markerPopup');
    }
    ReactDOM.render(
      <Provider store={store}>
        <React.Fragment>
          <div className={'pop-guideline'} style={{ position: 'absolute', left: '0', top: '0' }}>
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '50px',
                height: '1px',
                width: `${opt.guideLine1len}px`,
                transform: 'rotate(-45deg)',
                borderTop: `2px ${opt.lineColor} solid`,
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                left: '42px',
                top: `${opt.guideLine2top}px`,
                height: `1px`,
                width: `35px`,
                borderTop: `2px #00daf8 solid`,
              }}
            ></div>
          </div>
          <div
            className={'mtk-pop-content'}
            style={{
              position: 'absolute',
              left: `${opt.contentdx}px`,
              width: `${opt.contentWidth}px`,
              height: `${opt.contentHeight}px`,
            }}
          >
            <PopupContent popType={popData.popType} popData={popData}></PopupContent>
            <div
              style={{ position: 'absolute', right: '10px', top: '10px' }}
              onClick={() => that.popClose()}
            >
              ✖
            </div>
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
