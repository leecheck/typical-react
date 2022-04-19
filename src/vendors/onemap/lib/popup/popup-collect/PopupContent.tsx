import React from 'react';

import PopupBoxCar from './PopupBoxCar';

interface Iprops {
  popType: string;
  [propName: string]: any;
}
function PopupContent(props: Iprops) {
  const PopupBoxCarStyles = {
    bgColor: '#333',
    borderColor: '#fff',
  };

  const PopupBoxCardatas = {
    image: '',
    plateNum: 'aaa',
    color: 'aaa',
    type: 'aaa',
    brandName: 'aa',
    time: 'aaa',
    addr: 'aaa',
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {(props.popType == '' || props.type == 'test') && <div>test popup</div>}
      {props.popType == 'PopupBoxCar' && (
        <PopupBoxCar
          popType={props.popType}
          styles={PopupBoxCarStyles}
          {...PopupBoxCardatas}
        ></PopupBoxCar>
      )}
    </div>
  );
}

export default PopupContent;
