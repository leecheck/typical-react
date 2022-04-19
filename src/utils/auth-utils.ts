import { systemMenuData } from 'pages/admin/HomePage';
import { UserInfoContext, EAuthCode, IAuthModuleMap } from 'vendors/userinfo-context';
import { useContext } from 'react';

/**
 * 检查是否拥有权限
 * @param authOwned 用户拥有的权限
 * @param authNeed 调用处需要的权限码
 * @param mode 检查模式，"every" | "some"，"every"表示所有需要的权限码都要命中，反之"some"则只要命中搞一个即可，默认"some"
 */
export function checkHasAuth(
  authOwned: IAuthModuleMap = {},
  authNeed: EAuthCode[] = [],
  mode: 'some' | 'every' = 'some',
) {
  if (authNeed.length) {
    if (mode === 'some') {
      for (const code of authNeed) {
        // 有一个命中就终止
        if (authOwned[code]) {
          return true;
        }
      }
      return false;
    } else {
      for (const code of authNeed) {
        // 全部命中
        if (!authOwned[code]) {
          return false;
        }
      }
      return true;
    }
  } else {
    // 没有authNeed或者authNeed===[]，就认为不需要权限
    return true;
  }
}

/**
 * 从已排序routes中找到第一个有权限的url，没有找到就“/403”
 * @param authOwned
 * @param routes
 * @returns
 */
export function getFirstPath(
  authOwned: IAuthModuleMap = {},
  routes: Array<{
    key: string;
    auth?: EAuthCode[];
    [key: string]: any;
    path?: string;
  }>,
) {
  if (routes.length) {
    for (const route of routes) {
      if (!route.auth) {
        // 不需要权限
        return route.key;
      } else {
        for (const auth of route.auth) {
          if (authOwned[auth]) {
            return route.key;
          }
        }
      }
    }
  }
  return '/403';
}

/**
 * 从已排序routes中找到第一个有权限的二级菜单
 */
export function getFirstUrl(path, first) {
  let url = '';
  let arr: any = [];
  systemMenuData.map((v, k) => {
    if (path === v.key) {
      v.children &&
        v.children.map((w) => {
          first?.[v.auth[0]].childList.map((a, b) => {
            if (w.title === a.menuName) {
              arr.push(w);
              return;
            }
            return;
          });
        });
      url = arr?.[0].key;
    }
  });
  return url;
}
