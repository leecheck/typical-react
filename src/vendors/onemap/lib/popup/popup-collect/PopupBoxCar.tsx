import React from 'react';
import Style from './asset/styles/index.module.scss';

interface Iprops {
  popType: string;
  styles: { [propName: string]: any };
  [propName: string]: any;
}
function PopupContent(props: Iprops) {
  const { image, plateNum, color, type, brandName, time, addr } = props;
  const { bgColor, borderColor } = props.styles;

  return (
    <div className={Style['popup-box-car']}>
      <div
        className={Style['monitor-box']}
        style={{ background: `${bgColor}`, border: `1px solid ${borderColor}` }}
      >
        <div
          className={Style['vertical-line']}
          style={{ borderLeft: `1px solid ${borderColor}` }}
        ></div>
        <div
          className={Style['cross-line']}
          style={{ borderTop: `1px solid ${borderColor}` }}
        ></div>
        <div className={Style['monitor-info']}>
          <div className={Style['monitor-title']}>车辆告警</div>
          <div className={Style['pic-line']}>
            <div className={Style['car-pic-wrap']}>
              <img className={Style['car-pic']} src={image} />
            </div>
            <div className={Style['middle-wrap-car']}>
              <div className={Style['info-name']}>{plateNum || '未知'}</div>
              <div className={Style['info-color']}>颜色：{color || '未知'}</div>
              <div className={Style['info-type']}>车型：{type || '未知'}</div>
              <div className={Style['info-type']} title={brandName || '未知'}></div>
            </div>
          </div>
          <div className={Style['time-and-addr-car']}>
            <div className={Style['car-time']}>{time}</div>
            <div>{addr}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupContent;
