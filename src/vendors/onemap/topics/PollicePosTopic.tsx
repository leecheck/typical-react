import * as maptalks from 'maptalks';
import React, { useContext, useRef } from 'react';
import { withOneMap, MapContext } from '../OneMap';
import { MapThing, IMapThingOption, BaseTopic, IBaseTopicOption, IMapApp } from '../lib/MapApp';
import icon from '../asset/icons/PolicePos.svg';
import moment from 'moment';

export interface IPolicePos {
  userId?: string;
  name: string;
  deviceId?: number;
  latitude: number;
  longitude: number;
  stime: string | number;
}
interface IPollicPosTopicProps {
  data: IPolicePos[];
  show: boolean;
}
function PollicePosTopicFunction(props: IPollicPosTopicProps) {
  const topicKey = 'PollicPosTopic';

  const topic = useRef<BaseTopic | null>(null);

  const app = useContext(MapContext);
  React.useEffect(() => {
    topic.current = app.addBaseTopic({
      name: 'PollicPosTopic',
      onPrepare: (topic: BaseTopic, app: IMapApp) => {
        topic.clear = () => {
          topic.layer.clear();
        };

        topic.render = () => {
          props.data.forEach((pos) => {
            if (pos.longitude && pos.latitude) {
              pos.timeCN = pos.stime ? moment(pos.stime).format('MM-DD HH:mm') : '';
              let marker = new maptalks.Marker([pos.longitude, pos.latitude], {});
              marker.setProperties(pos);
              marker.setSymbol([
                {
                  markerFile: icon,
                  markerDy: 0,
                },
                {
                  textName: '{name}',
                  textSize: {
                    stops: [
                      [10, 0],
                      [11, 12],
                    ],
                  },
                  textFill: '#fff',
                  textHaloFill: '#101010',
                  textHaloRadius: 1,
                  textHorizontalAlignment: 'middle',
                  textWeight: 400,
                  textDy: 8,
                },
                {
                  textName: '{timeCN}',
                  textSize: {
                    stops: [
                      [10, 0],
                      [11, 12],
                    ],
                  },
                  textFill: '#fff',
                  textHaloFill: '#101010',
                  textHaloRadius: 1,
                  textHorizontalAlignment: 'middle',
                  textWeight: 400,
                  textDy: 20,
                },
              ]);

              topic.layer.addGeometry(marker);
            }
          });
        };
      },
      onAdd: (topic: BaseTopic, app: IMapApp) => {},
      onShow: (topic: BaseTopic, app: IMapApp) => {
        topic.current?.layer.clear();
        topic.render();
      },
      onHide: () => {
        topic.current?.layer.clear();
      },
      onRemove: () => {},
      lazy: false,
    });
  }, []);

  const toogleShow = () => {
    if (topic.current) {
      props.show ? topic.current.show() : topic.current.hide();
    }
  };

  React.useEffect(() => {
    toogleShow();
  }, [props.show]);

  React.useEffect(() => {
    if (props.data && props.data.length > 0 && topic.current?.visible) {
      topic.current.render();
    }
  }, [props.data]);

  return null;
}

export const PollicePosTopic = withOneMap(PollicePosTopicFunction);
