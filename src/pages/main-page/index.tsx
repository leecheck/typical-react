import React, { useContext } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getUser } from 'reducers/selectors';
import { MtkMap } from 'vendors/onemap/OneMap';

import { PollicePosTopic } from 'vendors/onemap/topics/PollicePosTopic';

export interface IProps {}

function MainPage(props: IProps) {
  const user = useSelector(getUser);

  const data = [
    {
      longitude: 120.44544473818506,
      latitude: 36.07765271052194,
      name: '徐家麦岛228',
    },
  ];

  //return <div> 当前登录状态 {user && user.user ? user.user.name : '未登录'}</div>;
  return (
    <MtkMap styles={{ background: '#9cbad2' }} className="map">
      {() => {
        return (
          <>
            <PollicePosTopic data={data} show={true}></PollicePosTopic>
          </>
        );
      }}
    </MtkMap>
  );
}

export default MainPage;
