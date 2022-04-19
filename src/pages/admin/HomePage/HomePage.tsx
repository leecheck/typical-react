import React, { useContext, useMemo, useState } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { checkHasAuth, getFirstPath } from 'utils/auth-utils';
import { useHistory, useLocation } from 'react-router';

import LazyNotFoundPage from 'containers/NotFoundPage/Loadable';
import {
  HomePageWrapper,
  MainContentLayout,
  MainHeader,
  MainLayout,
  MainSider,
  MainBreadcrumb,
  MainContent,
  PageTitle,
  BigScreenEntry,
} from './style';
import { Layout, Menu, Breadcrumb } from 'antd';
import { IMenuDataItem, systemMenuData } from './';
import UserInfo from './components/UserInfo';
import { ConfigManager } from 'utils/Config';
import { UserInfoContext, EAuthCode } from 'vendors/userinfo-context';
import CheckAuthRoute from 'components/CheckAuthRoute';

import UserPage from '../user';

const { SubMenu } = Menu;
export interface IHomePageContext {
  renderExtraContent: (content: React.ReactNode) => void;
}
export const HomePageContext = React.createContext<IHomePageContext>({
  renderExtraContent: () => {},
});
export const pickConfigPathname = (url: string) => {
  const index = url.indexOf('/:');
  if (index === -1) return url;
  return url.substring(0, index - 1);
};
export default function HomePage() {
  const location = useLocation();
  const history = useHistory();
  const { userInfo } = useContext(UserInfoContext);

  const [pageExtraContent, setPageExtraContent] = useState<React.ReactNode>(null);
  const generateMatchMenuList = (menuItem: IMenuDataItem, arr: IMenuDataItem[] = []) => {
    if (location.pathname.includes(pickConfigPathname(menuItem.key))) {
      arr.push(menuItem);
    }
    if (menuItem.children) {
      menuItem.children.forEach((d) => {
        generateMatchMenuList(d, arr);
      });
    }
    return arr;
  };
  const matchMenuList = useMemo<IMenuDataItem[]>(() => {
    let arr: IMenuDataItem[] = [];
    systemMenuData.forEach((d) => {
      generateMatchMenuList(d, arr);
    });

    return arr;
  }, [location.pathname]);

  const matchKeys = useMemo<string[]>(() => {
    return matchMenuList.map((d) => d.key);
  }, [matchMenuList]);

  const renderCurrentPageTitle = useMemo(() => {
    if (matchMenuList[matchMenuList.length - 1]) {
      return <PageTitle>{matchMenuList[matchMenuList.length - 1].title}</PageTitle>;
    }
    return null;
  }, [matchMenuList]);
  const renderExtraContent = (content) => {
    setPageExtraContent(content);
  };
  return (
    <HomePageContext.Provider value={{ renderExtraContent }}>
      <HomePageWrapper>
        <MainLayout>
          <MainHeader content={ConfigManager.getAppConfig('systemName')}>
            {checkHasAuth(userInfo?.authModuleMap, []) && (
              <BigScreenEntry
                onClick={() => {
                  history.push('/overview');
                }}
              />
            )}
            <UserInfo />
          </MainHeader>
          <Layout>
            <MainSider>
              <Menu
                mode="inline"
                theme={'dark'}
                selectedKeys={matchKeys}
                defaultOpenKeys={matchKeys}
              >
                {systemMenuData.map((d) => {
                  if (checkHasAuth(userInfo?.authModuleMap, [])) {
                    return (
                      <SubMenu key={d.key} icon={d.icon} title={d.title}>
                        {d.children &&
                          d.children.map((dd) => {
                            if (checkHasAuth(userInfo?.authModuleMap, [])) {
                              return (
                                <Menu.Item key={dd.key} onClick={() => history.push(dd.key)}>
                                  {dd.title}
                                </Menu.Item>
                              );
                            } else {
                              return null;
                            }
                          })}
                      </SubMenu>
                    );
                  } else {
                    return null;
                  }
                })}
              </Menu>
            </MainSider>
            <MainContentLayout>
              <MainBreadcrumb
                style={{
                  margin: '10px 0',
                  pointerEvents: 'none',
                }}
              >
                {matchMenuList.map((d, i) => (
                  <Breadcrumb.Item key={d.key}>
                    {i === matchMenuList.length - 1 ? (
                      d.title
                    ) : (
                      <Link
                        to={d.key}
                        style={{
                          color: `rgba(255,255,255, ${0.65})`,
                        }}
                      >
                        {d.title}
                      </Link>
                    )}
                  </Breadcrumb.Item>
                ))}
              </MainBreadcrumb>
              {renderCurrentPageTitle}
              {pageExtraContent}
              <MainContent>
                <Switch>
                  <Route path="/admin" component={UserPage} />
                  {/* <CheckAuthRoute path={'/user'} auth={[]}>
                    <UserPage />
                  </CheckAuthRoute> */}

                  <Redirect
                    from={'/'}
                    to={getFirstPath([userInfo?.authModuleMap], systemMenuData)}
                  />
                  <Route>
                    <LazyNotFoundPage />
                  </Route>
                </Switch>
              </MainContent>
            </MainContentLayout>
          </Layout>
        </MainLayout>
      </HomePageWrapper>
    </HomePageContext.Provider>
  );
}
