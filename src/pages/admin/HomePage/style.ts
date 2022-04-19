import styled from 'styled-components/macro';
import SeniorManageSvg from './images/高级管理.svg';
import RobotManageSvg from './images/集控调度大脑.svg';
import HealthyManageSvg from './images/健康检测中枢.svg';
import VedioManageSvg from './images/视频分析智眼.svg';
import LogoImage from './images/LOGO@3x.png';
import BigSreenIcon from './images/icon.svg';

import { Layout, Menu, Breadcrumb } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export const MenuIcon = styled.i`
  display: inline-block;
  background-repeat: no-repeat;
  background-size: cover;
  width: 14px;
  height: 14px;
  position: relative;
  top: 3px;
  margin-right: 24px;
`;
export const SeniorManageIcon = styled(MenuIcon)`
  background-image: url(${SeniorManageSvg});
`;
export const RobotManageIcon = styled(MenuIcon)`
  background-image: url(${RobotManageSvg});
`;
export const HealthyManageIcon = styled(MenuIcon)`
  background-image: url(${HealthyManageSvg});
`;
export const VedioManageIcon = styled(MenuIcon)`
  background-image: url(${VedioManageSvg});
`;
export const HomePageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;
export const MainLayout = styled(Layout)`
  height: 100%;
`;
export const MainHeader = styled(Header)<{ content: string }>`
  height: 64px;
  background-color: #121722;
  /* background-image: url(${LogoImage}); */
  background-size: 180px 34px;
  background-repeat: no-repeat;
  background-position: 23px center;
  position: relative;
  :before {
    content: ${(props) => `"${props.content}"`};
    display: inline-block;
    font-size: 26px;
    color: #fff;
    font-weight: bold;
    padding-left: 10px;
    margin-top: 5px;
    margin-left: -46px;
    line-height: 56px;
  }
`;
export const MainSider = styled(Sider)`
  background: #212633;
  width: 240px;
  padding: 13px 11px;
  overflow: auto;
  .ant-menu-sub,
  .ant-menu {
    background-color: transparent !important;
  }
  .ant-menu-item-only-child {
    padding-left: 62px !important;
    border-radius: 8px;
    height: 48px !important;
    line-height: 48px !important;
  }
  .ant-menu-submenu-title {
    padding-left: 5px !important;
    i {
      margin-right: 10px;
    }
  }
  .ant-menu-item {
    padding-left: 38px !important;
    height: 40px !important;
    line-height: 40px !important;
  }
`;
export const MainContentLayout = styled(Content)`
  background-color: #181d29;
  padding: 0px 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 23px;
`;
export const MainContent = styled(Content)`
  flex: 1;
  overflow: auto;
  color: rgba(255, 255, 255, 0.85);
  background: #2b313f;
  border-radius: 8px;
  padding: 16px;
  overflow-x: hidden;
`;
export const PageTitle = styled.div`
  width: 100%;
  height: 50px;
  font-size: 24px;
  color: #ffffff;
  font-weight: 500;
  display: flex;
  align-items: center;
`;
export const MainBreadcrumb = styled(Breadcrumb)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  .ant-breadcrumb-separator {
    color: rgba(255, 255, 255, 0.65);
  }
  &.ant-breadcrumb > span:last-child {
    color: rgba(255, 255, 255, 1);
  }
`;

export const BigScreenEntry = styled.div`
  height: 24px;
  width: 24px;
  background: url(${BigSreenIcon}) no-repeat center / cover;
  float: right;
  position: relative;
  top: 20px;
  right: 110px;
  cursor: pointer;
`;
