/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Subtract } from 'utility-types';
import { IFUserInfoContextType } from './type';

export enum EAuthCode {
  integrated_platform = 'integrated_platform', // 机器人智慧调度平台

  Centralized_control_dispatching = 'Centralized_control_dispatching', // 集控调度大脑
  Unmanned_vehicle_management = 'Unmanned_vehicle_management', // 无人车管理
  Robot_real_time_scheduling = 'Robot_real_time_scheduling', // 机器人实时调度
  Robot_task_list = 'Robot_task_list', // 机器人任务列表
  Disinfection_warehouse_management = 'Disinfection_warehouse_management', // 消毒仓管理
  Room_service_records = 'Room_service_records', // 客房服务记录
  Environmental_new_crown = 'Environmental_new_crown', // 环境新冠
  robot_map = 'robot_map', // 机器人地图

  Video_analysis_smart_eye = 'Video_analysis_smart_eye', // 视频分析智眼
  real_time_analysis = 'real_time_analysis', // 实时分析
  Door_magnetic_alarm = 'Door_magnetic_alarm', // 门磁告警

  Health_Detection_Center = 'Health_Detection_Center', // 健康检测中枢
  Flow_modulation_list = 'Flow_modulation_list', // 流调列表
  Health_signs = 'Health_signs', // 健康体征
  Elevator_monitoring = 'Elevator_monitoring', // 电梯监测
  Air_purification = 'Air_purification', // 空气净化
  Condition_monitoring = 'Condition_monitoring', // 状态监测
  senior_health = 'senior_health', // 高级健康包
  Maternal_health = 'Maternal_health', //孕妇健康
  person_health = 'person_health', //人员健康
  //TODO
  floor_view = 'person_health', //楼层视图

  senior_management = 'senior_management', // 高级管理
  account_management = 'account_management', // 账号管理
  Role_management = 'Role_management', // 角色管理
  building_management = 'Building_management', // 楼栋管理

  data_board = 'data_board', // 数据看板
}

export interface IBModuleTreeNode {
  menuId: number;
  menuName: string;
  resourceCode: EAuthCode; // 同前端对接中唯一不变的标识符
  childList?: Array<IBModuleTreeNode>;
}

// 用户拥有的模块权限，key为EAuthCode，value为后台返回数据中的moduleNode
export type IAuthModuleMap = {
  [authCode in EAuthCode]?: IBModuleTreeNode;
};

function noop(): void {}

const defaultUserContext: IFUserInfoContextType = {
  userInfo: null,
  loginIn: noop,
  logOut: noop,
  updateUserInfo: noop,
};

const UserInfoContext = React.createContext<IFUserInfoContextType>(defaultUserContext);

function withUserInfo<P extends IFUserInfoContextType>(Component: React.ComponentType<P>) {
  return function UserInfoComponent(props: Subtract<P, IFUserInfoContextType>) {
    return (
      <UserInfoContext.Consumer>
        {({ userInfo, loginIn, logOut, updateUserInfo }) => (
          <Component
            {...(props as P)}
            loginIn={loginIn}
            logOut={logOut}
            userInfo={userInfo}
            updateUserInfo={updateUserInfo}
          />
        )}
      </UserInfoContext.Consumer>
    );
  };
}

export { withUserInfo, UserInfoContext };
/* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
