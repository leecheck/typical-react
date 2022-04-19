import styled from 'styled-components/macro';
import AvatarIcon from '../images/用户.svg';
import { Popover } from 'antd';

export const UserInfoWrapper = styled.div`
  float: right;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 113px;
  height: 26.67px;
  position: absolute;
  top: 50%;
  margin-top: -13.38px;
  right: 23px;
`;
export const UserAvatar = styled.div<{ avatarUrl?: string }>`
  width: 26.67px;
  height: 26.67px;
  background-image: url(${(props) => props.avatarUrl || AvatarIcon});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
`;
export const UserNameWrapper = styled.div`
  width: 72px;
  color: #888a94;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const UserLogOut = styled.div`
  width: 90px;
  color: #888a94;
  text-align: left;
  padding-left: 20px;
  .ant-dropdown {
    background: transparent;
    width: 120px;
  }
`;

export const HeaderUserPopOver = styled(Popover)`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #888a94;
  width: 120px;
  .ant-avatar {
    background-color: #a1a7bd;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }
`;

export const PopoverContentItem = styled.div`
  display: flex;
  align-items: center;
  color: #a1a7bd;
  cursor: pointer;
  .anticon {
    margin-right: 12px;
  }
`;
