import { IFUserInfo, EUserAuthorityType } from 'vendors/types/userinfo-type';

// 用户角色信息
export interface IBUserRoleInfo {
  userId: string;
  roleId: string;
  roleName: string;
  roleCnName: string;
  type?: number;
  orgId?: number;
  authority: string;
  //clientType: EClientType;
}

// 用户信息
export interface IBUserInfo {
  createTime: string; // YYYY-HH-MM HH:mm:ss
  updateTime: string;
  id: string;
  name: string;
  account: string;
  password: string;
  organization: string;
  orgId: string;
  imageUrl?: string;
  startTime: string;
  endTime: string;
  roleList: IBUserRoleInfo[];
  cardNo?: string;
  policeNo?: string;
  phone?: string;
  expiredTime?: string;
  email?: string;
  remark?: string;
  creator?: string;
  type?: number;
  status?: number;
  expired?: number;
  loginTimes?: number;
  deletedFlg: 0 | 1;
  orgType: string;
  level: EUserAuthorityType; // 权限身份
  areaList?: string[]; // 请求用户列表时有这个字段
  userAreaList?: Array<{ areaId: number; id: number; level: LevelType }>; // 登录或获取已登录用户信息有这个字段
}

// 用户全部的资料
export interface IBUserDetailInfo {
  userVo: IBUserInfo;
  // userRoleInfo: IBUserRoleInfo[];
  // operationList: OperatorType[];
}

// 登录态类型
export interface IFLoginState {
  token: string;
  tokenType: string;
  expires: number; // 单位秒
  // 新增深海 社区token
  community_token: string;
  deapsea_token: string;
  areaIds: string;
  polices: string;
}

// 登录接口返回的data类型（提供给业务层的）
export interface IFUserLoginInfo {
  loginState: IFLoginState;
  userInfo: IFUserInfo;
}
