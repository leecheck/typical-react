import { UserInfoContext, EAuthCode } from 'vendors/userinfo-context';
import * as React from 'react';
import { useContext } from 'react';
import { Route, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';
import { checkHasAuth } from 'utils/auth-utils';
import LocalLoginStateManager from 'utils/login-state';

interface IProps extends RouteProps {
  auth: EAuthCode[]; // 该路由需要的权限码，空数组表示不需要权限控制
}

const CheckAuthRoute = (props: IProps) => {
  const { children, auth, ...rest } = props;
  const { userInfo } = useContext(UserInfoContext);

  return (
    <Route
      {...rest}
      render={(rprops: RouteComponentProps) =>
        LocalLoginStateManager.isLogin() ? (
          // 若已登录，但暂无用户信息，需要等到用户信息更新后鉴权，在这之前空白等待
          userInfo ? (
            checkHasAuth(userInfo.authModuleMap, auth) ? (
              children
            ) : (
              <Redirect to="/403" />
            )
          ) : null
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default CheckAuthRoute;
