import React, { createContext, ComponentType, FC, ReactElement, useEffect, useState } from 'react';
import { ThreeLayer } from 'maptalks.three';
import * as maptalks from 'maptalks';
import isFunction from 'lodash/isFunction';
import {
  MapProps,
  MapOptions,
  zoomControlOpt,
  overviewControlOpt,
  IMapApp,
  OneMap,
} from './lib/MapApp';
require('./mtk.scss');

export const MapContext = createContext<IMapApp>(OneMap.default());

export function withOneMap<IProps>(Component: ComponentType<IProps>): React.FC<IProps> {
  function MapContextClass(props: IProps): ReactElement<IProps> {
    return (
      <MapContext.Consumer>
        {(context: IMapApp) => {
          return <Component {...props}></Component>;
        }}
      </MapContext.Consumer>
    );
  }

  MapContextClass.defaultProps = Component.defaultProps;

  return MapContextClass;
}

MtkMap.defaultProps = {
  baseMapStyles: [{}],
  options: {
    center: [120.555, 36.198],
    zoom: 10,
  },
};

export function MtkMap(props: MapProps) {
  let mapElement: HTMLElement = document.createElement('div');
  let defaultApp = OneMap.default();
  const [app, setApp] = useState<IMapApp>(defaultApp);
  const initMap = () => {
    let app = new OneMap(mapElement, props.options, {
      topicStatusChange: () => {},
      onMouseMove: (evt) => {},
      onReady: () => {
        setApp(app);
      },
    });
  };

  useEffect(() => {
    initMap();
    return () => {};
  }, []);

  useEffect(() => {
    if (app.ready) {
      app.setBaseLayer(props.baseLayer);
    }
    return () => {};
  }, [props.baseLayer]);

  return (
    <MapContext.Provider value={app}>
      <div
        className={`mtk-map ${props.className}`}
        style={props.styles ? { ...props.styles } : {}}
        ref={(map) => {
          if (map) {
            mapElement = map;
          }
        }}
      >
        {app.ready && isFunction(props.children) ? props.children(app) : props.children}
      </div>
    </MapContext.Provider>
  );
}
