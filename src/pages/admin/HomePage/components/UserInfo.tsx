import { Avatar, Dropdown, Menu, message } from 'antd';
import React, { useContext } from 'react';
import {
  UserInfoWrapper,
  UserAvatar,
  UserLogOut,
  PopoverContentItem,
  HeaderUserPopOver,
} from './style';
//import { logOut } from 'app/requests/auth-requests';
import { useHistory } from 'react-router';
import { ExportOutlined } from '@ant-design/icons';
import { UserInfoContext } from 'vendors/userinfo-context';
import { reduce } from 'lodash';

const UserInfo: React.FC = (props) => {
  const history = useHistory();
  const { userInfo } = useContext(UserInfoContext);

  const logOutBtn = () => {
    // logOut().then(res => {
    //   message.success('登出成功！');
    //   history.replace('/login');
    //   return;
    // });
  };

  const content = (
    <div>
      <PopoverContentItem
        onClick={() => {
          logOutBtn();
        }}
      >
        <ExportOutlined />
        退出登录
      </PopoverContentItem>
    </div>
  );

  return (
    <UserInfoWrapper>
      <UserAvatar />
      <UserLogOut>
        <HeaderUserPopOver content={content}>
          <div>
            <span>{userInfo?.name}</span>
          </div>
        </HeaderUserPopOver>
      </UserLogOut>
    </UserInfoWrapper>
  );
};
export default UserInfo;
