/**
 *社区总览展示摄像头抓拍
 *
 */

import React from 'react';
import moment from 'moment';
import { Empty, Button, message } from 'antd';
import { UserOutlined, PhoneFilled, ClockCircleFilled, BankFilled } from '@ant-design/icons';

import ModuleStyle from '../popup-collect/asset/department.module.scss';

interface IPopData {
  title: string;
  type: string;
  online?: boolean;
  name?: string;
  stationName?: string;
  phone?: number;
  time?: string;
  dataSet: IDataSet[];
  rawData: {
    [propName: string]: any;
  };
}

interface IDataSet {
  name: string;
  value: string;
  type?: 'link' | 'text' | 'btn' | 'detail';
}

enum Color {
  重点单位 = '#f54336eb',
  片区 = '#FF8B50eb',
  警务通 = '#4C83FFeb',
  小区 = '#6e6700eb',
}

interface OwnProps {
  data: IPopData;
  onItemClick: (
    key: string,
    data: {
      [propName: string]: any;
    },
  ) => void;
  onClose?: () => void;
}

const Popup = (props: OwnProps) => {
  const data = props.data;

  const onClose = () => {
    props.onClose && props.onClose();
  };

  const onItemClick = (key: string) => {
    props.onItemClick && props.onItemClick(key, data.rawData);
  };

  let themeColor = '#fff';

  const type: string = data.type;

  switch (type) {
    case '片区':
      themeColor = Color.片区;
      break;
    case '警务通':
      themeColor = Color.警务通;
      break;
    case '重点单位':
      themeColor = Color.重点单位;
      break;
    case '小区':
      themeColor = Color.小区;
      break;
    default:
      break;
  }

  return (
    <>
      <div className={ModuleStyle['community-wrap']} style={{ background: `${themeColor}` }}>
        <div
          className={ModuleStyle['wrap-point']}
          style={{ borderRight: `10px solid ${themeColor}` }}
        ></div>
        <div className={ModuleStyle['pop-close']} onClick={onClose}>
          ✕
        </div>
        {(type == '片区' || type == '重点单位' || type == '小区') && (
          <div className={ModuleStyle['pop-title']}>{data.title}</div>
        )}

        {type == '警务通' && (
          <div className={ModuleStyle['pop-title']}>
            {data.title}{' '}
            <i
              className={ModuleStyle['legend-item-circle']}
              style={{
                backgroundColor: data.online ? '#03FDCA' : '#a9b9b6',
              }}
            ></i>
            {data.online ? '在线' : '离线'}
          </div>
        )}

        {(type == '片区' || type == '重点单位' || type == '小区') &&
          data.dataSet.map((data) => {
            if (data.type == 'btn') {
              return (
                <div className={ModuleStyle['info-item']}>
                  <div
                    onClick={() => {
                      onItemClick(data.name);
                    }}
                    className={`${ModuleStyle['item-content']} ${ModuleStyle['item-content-link']}`}
                  >
                    {data.value}
                  </div>
                </div>
              );
            }
            if (data.type == 'detail') {
              return (
                <div className={ModuleStyle['info-item']}>
                  <div className={ModuleStyle['item-title']}>{data.name}</div>
                  <div
                    onClick={() => {
                      onItemClick(data.name);
                    }}
                    className={`${ModuleStyle['item-content']} ${ModuleStyle['item-detail']} `}
                    title={data.value}
                  >
                    {data.value}
                  </div>
                </div>
              );
            }
            return (
              <div className={ModuleStyle['info-item']}>
                <div className={ModuleStyle['item-title']}>{data.name}</div>
                <div
                  onClick={() => {
                    onItemClick(data.name);
                  }}
                  className={`${ModuleStyle['item-content']} ${
                    data.type == 'link' ? ModuleStyle['item-content-link'] : ''
                  }`}
                >
                  {data.value}
                </div>
              </div>
            );
          })}

        {type == '警务通' && (
          <>
            <div className={ModuleStyle['info-item']}>
              <div className={ModuleStyle['item-content']}>
                <UserOutlined style={{ marginRight: '4px' }} />
                {data.name}
              </div>
            </div>
            <div className={ModuleStyle['info-item']}>
              <div className={ModuleStyle['item-content']}>
                <BankFilled style={{ marginRight: '4px' }} />
                {data.stationName}
              </div>
            </div>
            <div className={ModuleStyle['info-item']}>
              <div className={ModuleStyle['item-content']}>
                <PhoneFilled style={{ marginRight: '4px' }} />
                {data.phone}
              </div>
            </div>
            <div className={ModuleStyle['info-item']}>
              <div className={ModuleStyle['item-content']}>
                <ClockCircleFilled style={{ marginRight: '4px' }} />
                {data.time}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Popup;
