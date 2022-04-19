import * as maptalks from 'maptalks';
import React, { useContext, useRef } from 'react';
import { withOneMap, MapContext } from '../OneMap';
import { MapThing, IMapThingOption, BaseTopic, IBaseTopicOption, IMapApp } from '../lib/MapApp';

interface IMapfly {
  plot: IPlotCollect;
}

interface IPlotCollect {
  during: number;
  zoom: number;
  pitch: number;
  timeout: number;
  center: number;
  [propName: string]: any;
}
function MapflyFunction(props: IMapfly) {
  const topic = useRef<BaseTopic | null>(null);

  const app = useContext(MapContext);

  React.useEffect(() => {
    setTimeout(() => {
      app.map.animateTo(
        props.plot,
        {
          duration: props.plot.during || 3000,
          easing: 'out',
        },
        function (frame) {
          if (frame.state.playState === 'finished') {
            console.log('animation finished');
          }
        },
      );
    }, props.plot.timeout || 3000);
  }, [props.plot]);

  return null;
}

export const MapflyTopic = withOneMap(MapflyFunction);
