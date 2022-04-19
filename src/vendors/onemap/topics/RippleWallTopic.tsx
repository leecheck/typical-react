import * as THREE from 'three';
import * as maptalks from 'maptalks';
import React, { useContext, useRef } from 'react';
import { withOneMap, MapContext } from '../OneMap';
import { MapThing, IMapThingOption, BaseTopic, IBaseTopicOption, IMapApp } from '../lib/MapApp';
import { BaseObject } from 'maptalks.three';
import RippleWall from '../lib/RippleWall';

interface IRippleWallProps {
  show: boolean;
}
function RippleWallTopicFunction(props: IRippleWallProps) {
  const topic = useRef<BaseTopic | null>(null);

  const { ready, map, getTopic } = useContext(MapContext);
  const app = useContext(MapContext);
  React.useEffect(() => {
    topic.current = app.addThing({
      name: 'RippleWallTopic',
      onAdd: (topic, app) => {
        topic.groundWall = new RippleWall(
          [
            [120.45744374579661, 36.12699762343198],
            [120.4579467968822, 36.126786271681205],
            [120.45846781407798, 36.1261813652215],
            [120.45885408544727, 36.12545255601175],
            [120.45890798377788, 36.12513916595276],
            [120.45818035631478, 36.124643569794806],
            [120.45720120330891, 36.124198988202544],
            [120.45682391499471, 36.12422085293042],
            [120.45645560973563, 36.12462170518573],
            [120.45589866031945, 36.125314081490174],
            [120.45552137200525, 36.125816961469944],
            [120.45557527033586, 36.12599916355906],
            [120.45643764362543, 36.12654576726644],
            [120.45744374579661, 36.12699762343198],
            [120.4579567968822, 36.12679627168121],
          ],
          { height: 0, opacity: 1 },
          app.threeLayer,
        );
        app.threeLayer.addMesh(topic.groundWall);
        topic.groundWall2 = new RippleWall(
          [
            [121.65, 36.25],
            [121.65, 36.15],
            [121.55, 36.15],
            [121.55, 36.25],
            [121.6501, 36.2501],
          ],
          { height: 0, opacity: 1 },
          app.threeLayer,
        );
        app.threeLayer.addMesh(topic.groundWall2);
      },
      onShow: () => {},
      onHide: (topic, app) => {
        if (topic.groundWall) topic.groundWall.hide();
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
    toogleShow();
  }, [props.show]);

  return null;
}

export const RippleWallTopic = withOneMap(RippleWallTopicFunction);
