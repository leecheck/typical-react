import React, { useContext, useState } from 'react';
import { UserInfoContext, IFUserInfoContextType } from 'vendors/userinfo-context';
import { Route, BrowserRouter, withRouter, RouteComponentProps } from 'react-router-dom';
import { StaticContext, Switch, useHistory, useLocation } from 'react-router';

import { IFUserLoginInfo } from 'vendors/bussiness-requests';
import LoginStateManager from 'utils/login-state';
import { IFUserInfo } from 'vendors/types/userinfo-type';

import { MainWrapper } from './style';

import LoginPage from 'pages/LoginPage/Loadable';
import MainPage from 'pages/main-page';

import AdminPage from 'pages/admin/HomePage/HomePage';

type LocationState =
  | {
      from?: H.Location;
    }
  | undefined;

interface IProps extends RouteComponentProps<{}, StaticContext, LocationState> {}

function Main(props: IProps) {
  const [userInfo, setUserInfo] = useState(null);

  const history = useHistory();

  const login = (loginInfo: IFUserLoginInfo): void => {
    //const from = props.location.state?.from ?? { pathname: 'main' };

    history.push('/');

    setUserInfo(loginInfo.userInfo);
  };

  const logOut = (): void => {
    // 登出
    // UserAuthRequests.logOut()
    //   .then(() => {
    //     // do nothing;
    //     LoginStateManager.clearLoginState();
    //     props.history.replace('/login');
    //     setUserInfo(null);
    //     return undefined;
    //   })
    //   .catch((error: Error) => {
    //     // eslint-disable-next-line no-console
    //     console.error(error);
    //     LoginStateManager.clearLoginState();
    //     if (!(error instanceof UnAuthorizedError)) {
    //       //
    //       props.history.replace('/login');
    //     }
    //     setUserInfo(null);
    //   });
  };

  const updateUserInfo = (info: Partial<IFUserInfo>) => {
    if (userInfo) {
      setUserInfo({
        ...userInfo,
        ...info,
      });
    } else {
      setUserInfo(info);
    }
  };

  const provider: IFUserInfoContextType = {
    userInfo: userInfo,
    loginIn: login,
    logOut: logOut,
    updateUserInfo: updateUserInfo,
  };

  return (
    <UserInfoContext.Provider value={provider}>
      <MainWrapper>
        <Switch>
          <Route path="/login" exact={true} component={LoginPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/" component={MainPage} />
        </Switch>
      </MainWrapper>
    </UserInfoContext.Provider>
  );
}

export default Main;
