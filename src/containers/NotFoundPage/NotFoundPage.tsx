import React from 'react';
import styled from 'styled-components/macro';

export default function NotFoundPage() {
  return (
    <>
      <Wrapper>
        <Title>
          4
          <span role="img" aria-label="Crying Face">
            😢
          </span>
          4
        </Title>
        <P>页面未找到</P>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  color: black;
  font-size: 60px;

  span {
    font-size: 60px;
  }
`;

const P = styled.p`
  font-size: 24px;
`;
