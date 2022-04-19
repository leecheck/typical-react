import React from 'react';
import HomePage from './HomePage';
import { ReactNode } from 'react';
import { RobotManageIcon, SeniorManageIcon, HealthyManageIcon, VedioManageIcon } from './style';
import { EAuthCode } from 'vendors/userinfo-context';
export interface IMenuDataItem {
  title: string;
  key: string;
  children?: IMenuDataItem[];
  icon?: ReactNode;
  auth?: any;
}
export const systemMenuData: IMenuDataItem[] = [
  {
    title: '集控调度大脑',
    key: '/robot',
    icon: <RobotManageIcon />,
    auth: [EAuthCode.Centralized_control_dispatching],
    children: [
      {
        title: '机器人任务列表',
        key: '/robot/task',
        auth: [EAuthCode.Robot_task_list],
        children: [
          {
            title: '创建任务',
            key: '/robot/task/create',
          },
          {
            title: '修改任务',
            key: '/robot/task/edit/:id',
          },
        ],
      },
      {
        title: '机器人实时调度',
        key: '/robot/schedule',
        auth: [EAuthCode.Robot_real_time_scheduling],
      },
      {
        title: '客房服务记录',
        key: '/robot/roomservicerecords',
        auth: [EAuthCode.Room_service_records],
      },
      {
        title: '无人车管理',
        key: '/robot/drone',
        auth: [EAuthCode.Unmanned_vehicle_management],
      },
      {
        title: '消毒仓管理',
        key: '/robot/disinfection',
        auth: [EAuthCode.Disinfection_warehouse_management],
      },
      {
        title: '环境新冠',
        key: '/robot/environmental',
        auth: [EAuthCode.Environmental_new_crown],
      },
      {
        title: '机器人地图',
        key: '/robot/map',
        auth: [EAuthCode.robot_map],
      },
    ],
  },
  {
    title: '视频分析智眼',
    key: '/vedio',
    icon: <VedioManageIcon />,
    auth: [EAuthCode.Video_analysis_smart_eye],
    children: [
      {
        title: '实时分析',
        key: '/vedio/analyze',
        auth: [EAuthCode.real_time_analysis],
      },
      {
        title: '门磁告警',
        key: '/vedio/door',
        auth: [EAuthCode.Door_magnetic_alarm],
      },
    ],
  },
  {
    title: '健康检测中枢',
    key: '/healthy',
    icon: <HealthyManageIcon />,
    auth: [EAuthCode.Health_Detection_Center],
    children: [
      // {
      //   title: '核酸检测',
      //   key: '/healthy/nucleic',
      // },
      {
        title: '流调列表',
        key: '/healthy/flow',
        auth: [EAuthCode.Flow_modulation_list],
      },

      {
        title: '健康体征',
        key: '/healthy/physical',
        auth: [EAuthCode.Health_signs],
      },
      {
        title: '电梯监测',
        key: '/healthy/elevator',
        auth: [EAuthCode.Elevator_monitoring],
      },
      // {
      //   title: '空气净化',
      //   key: '/healthy/purificationair',
      //   auth: [EAuthCode.Air_purification],
      // },
      {
        title: '状态监测',
        key: '/healthy/statusmonitor',
        auth: [EAuthCode.Condition_monitoring],
      },
      {
        title: '高级健康包',
        key: '/healthy/healthyHigh',
        auth: [EAuthCode.senior_health],
      },
      {
        title: '孕妇健康',
        key: '/healthy/maternal',
        auth: [EAuthCode.Maternal_health],
      },
      {
        title: '人员健康',
        key: '/healthy/personPage',
        auth: [EAuthCode.person_health],
      },
      {
        title: '楼层视图',
        key: '/healthy/floorView',
        auth: [EAuthCode.floor_view],
        children: [
          {
            title: '健康详情',
            key: '/healthy/floorViewDetailPage',
            auth: [EAuthCode.floor_view],
          },
        ],
      },
    ],
  },

  {
    title: '高级管理',
    key: '/manage',
    auth: [EAuthCode.senior_management],
    icon: <SeniorManageIcon />,
    children: [
      {
        title: '账号管理',
        key: '/manage/account',
        auth: [EAuthCode.account_management],
      },
      {
        title: '角色管理',
        key: '/manage/role',
        auth: [EAuthCode.Role_management],
      },
      {
        title: '楼栋管理',
        key: '/manage/building',
        auth: [EAuthCode.building_management],
      },
    ],
  },
];
export default HomePage;
