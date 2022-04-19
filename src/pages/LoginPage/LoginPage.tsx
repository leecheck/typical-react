import React, { useContext } from 'react';
import { PageWrapper, ContentWrapper, Title, LoginFormItem } from './style';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router';
import LoginStateManager from 'utils/login-state';

import { FormComponentProps } from '@ant-design/compatible/lib/form';
import { withUserInfo, IFUserInfoContextType } from 'vendors/userinfo-context';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

type LocationState =
  | {
      from: { pathname: string };
    }
  | undefined
  | null;

interface LoginPagePropsType
  extends FormComponentProps,
    IFUserInfoContextType,
    RouteComponentProps<{}, StaticContext, LocationState> {}

function Login(props: LoginPagePropsType) {
  const location = useLocation<LocationState>();
  const history = useHistory();

  const dispatch = useDispatch();

  const onFinish = (values) => {
    const { from } = location.state || {
      from: { pathname: '/' },
    };
    dispatch({
      type: 'USER',
      payload: {
        name: 'yonghu',
      },
    });
    props.loginIn({ userInfo: {} });
    //history.replace(from.pathname);
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <Title>测试</Title>
        <Form {...formItemLayout} onFinish={onFinish} colon={false}>
          <LoginFormItem
            label=""
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" prefix={<UserOutlined />} size="large" />
          </LoginFormItem>
          <LoginFormItem
            label=""
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} size="large" />
          </LoginFormItem>
          <LoginFormItem>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </LoginFormItem>
        </Form>
      </ContentWrapper>
    </PageWrapper>
  );
}

function LoginPage(props: LoginPagePropsType): React.ReactElement {
  if (LoginStateManager.isLogin()) {
    const redirectPath = '/';
    const from = props.location.state?.from ?? { pathname: '/' };
    return <Redirect to={from} />;
  }
  return <Login {...props} />;
}

export default withUserInfo(LoginPage);
