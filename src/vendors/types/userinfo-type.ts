// 用户权限身份类型
export enum EUserAuthorityType {
  Normal = 0, // 普通用户
  SuperUser = 1, // 超级管理员
}

export interface IFUserRoleInfo {
  id: string;
  name: string;
  //clientType: EClientType;
}

export interface IFUserInfo {
  id: string;
  name: string;
  account: string;
  password: string;
  organization: string;
  orgId: string;
  avatarUrl: string;
  cardNo: string; //身份证号
  policeNo: string; //警员编号
  phone: string; //手机号
  expiredTime: string; //失效时间
  level: EUserAuthorityType; // 权限身份

  // TODO: User Role info
  roleList: IFUserRoleInfo[];

  isSuperUser: boolean; // 是否超级管理员

  // v1.4.0添加
  creator: string; //创建人
  createTime: string; //创建时间
  areaList: string[]; //区域权限
  // areaLevel?: LevelType; // 区域权限级别
  // authModuleResourceCodeList: EModuleGroupType[]; // 已授权模块的resourceCode
}
