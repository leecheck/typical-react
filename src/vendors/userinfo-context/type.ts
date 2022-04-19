import { IFUserLoginInfo } from 'vendors/bussiness-requests';
import { IFUserInfo } from 'vendors/types/userinfo-type';

export interface IFUserInfoContextType {
  userInfo: IFUserInfo | null;
  loginIn: (loginInfo: IFUserLoginInfo) => void;
  logOut: () => void;
  updateUserInfo: (info: Partial<IFUserInfo>) => void;
}
