import styled from 'styled-components/macro';
import { Form } from 'antd';

import bgimg from './assets/imgs/bg.svg';

export const PageWrapper = styled.div`
  height: 100vh;
  background: url(${bgimg}) no-repeat center / cover;
  position: relative;
`;

export const ContentWrapper = styled.div`
  width: 480px;
  height: 480px;
  background-color: #fff;
  position: absolute;
  left: 200px;
  top: calc((100% - 480px) / 2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 24px;
  color: #242733;
  margin-bottom: 40px;
`;

export const LoginFormItem = styled(Form.Item)`
  width: 320px;
  margin-bottom: 32px;
  .ant-input-affix-wrapper {
    height: 48px;
    border: none;
    border-bottom: 1px solid #e6e6ee;
  }
  .ant-btn-primary {
    width: 100%;
    height: 48px;
    border: none;
    font-size: 18px;
    margin-top: 32px;
  }
  .ant-input-affix-wrapper-lg {
    padding: 6.5px 0;
    font-size: 20px;
  }
  .ant-input-prefix {
    margin-right: 16px;
  }
`;
