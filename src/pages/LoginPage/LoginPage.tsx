import React, { useContext } from 'react';
import { PageWrapper, ContentWrapper, Title, LoginFormItem } from './style';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect, } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router'

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

function Login() {

  const location = useLocation<LocationState>();
  const history = useHistory();

  const onFinish = values => {
    const { from } = location.state || {
      from: { pathname: '/' },
    };
    history.replace(from.pathname);
  }

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
            <Input
              placeholder="请输入用户名"
              prefix={<UserOutlined />}
              size="large"
            />
          </LoginFormItem>
          <LoginFormItem
            label=""
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              placeholder="请输入密码"
              prefix={<LockOutlined />}
              size="large"
            />
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

export default function LoginPage() {
  if (false) {
    return <Redirect to={{ pathname: '/' }} />;
  } else {
    return <Login />;
  }
}
