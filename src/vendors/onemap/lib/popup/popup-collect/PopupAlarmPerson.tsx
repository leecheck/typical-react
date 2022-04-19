import React from 'react';
import Style from './asset/styles/index.module.scss';

interface Iprops {
  type: string;
  [propName: string]: any;
}
function PopupAlarmPerson(props: Iprops) {
  return <div className={Style['alaem-person']}></div>;
}

export default PopupAlarmPerson;
