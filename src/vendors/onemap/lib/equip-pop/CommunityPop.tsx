import * as maptalks from 'maptalks';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import LanguageProvider from 'app-containers/language-provider';
import { translationMessages } from 'app/i18n';
import { IFDeviceInfo } from 'app-vendors/types';
import PopUp from './popup-collect/PopupCommunity';

import history from 'utils/history';
import configureStore from 'app/configure-store';
const initialState = {};
export const store = configureStore(initialState, history);

interface IEquipPopOpt {
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
  public popData: IPopData;
  private popMarker: any;
  public opt: IEquipPopOpt;

  constructor(
    map: any,
    opt: IEquipPopOpt = {
      draggable: false,
      dx: 0,
      dy: 0,
      animation: 'fade',
      contentWidth: 600,
      contentHeight: 400,
    },
  ) {
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
  }

  checkClose(type: string) {
    if (this.popData.type.includes(type)) {
      this.popClose();
    }
  }

  popShow(lonlat: any, popData: IPopData) {
    let that = this;
    let opt = this.opt;
    this.popData = popData;
    let divElement = document.getElementById('markerPopup');
    if (!divElement) {
      divElement = document.createElement('div');
      divElement.setAttribute('id', 'markerPopup');
    }
    ReactDOM.render(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <React.Fragment>
            <div className={'pop-guideline'} style={{ position: 'absolute', left: '0', top: '0' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '66px',
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
                  top: `49px`,
                  height: `1px`,
                  width: `43px`,
                  borderTop: `2px #00daf8 solid`,
                }}
              ></div>
            </div>
            <div
              className={'mtk-pop-camera'}
              style={{ position: 'absolute', left: `${opt.contentdx}px` }}
            >
              <PopUp
                onClose={() => {
                  that.popClose();
                }}
                data={popData.data}
              ></PopUp>
            </div>
          </React.Fragment>
        </LanguageProvider>
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
