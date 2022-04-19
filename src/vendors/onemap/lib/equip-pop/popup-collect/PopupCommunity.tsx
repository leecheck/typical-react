/**
 *社区总览展示摄像头抓拍
 *
 */

import React from 'react';
import moment from 'moment';
import { Empty, Button, message } from 'antd';

import ModuleStyle from '../popup-collect/asset/community.module.scss';

interface IPopData {
  title: string;
  dataSet: IDataSet[];
}

interface IDataSet {
  name: string;
  value: string;
}

interface OwnProps {
  data: IPopData;
  onClose?: () => void;
}

const Popup = (props: OwnProps) => {
  const data = props.data;

  const onClose = () => {
    props.onClose && props.onClose();
  };

  return (
    <>
      <div className={ModuleStyle['community-wrap']}>
        <div className={ModuleStyle['pop-close']} onClick={onClose}>
          ✖
        </div>
        <div title={data.title} className={ModuleStyle['pop-title']}>
          {data.title}
        </div>

        {data.dataSet.map((data) => {
          return (
            <div className={ModuleStyle['info-item']}>
              <div className={ModuleStyle['item-title']}>{data.name}</div>
              <div className={ModuleStyle['item-content']}>{data.value}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Popup;
