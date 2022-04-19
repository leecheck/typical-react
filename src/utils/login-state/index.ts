/**
 * 本地登录状态管理，框架无关，不用redux可能更加合适
 */
import * as Cookie from 'js-cookie';

/**
 * 设置登录状态
 * @param {string} token  token的值
 * @param {boolean} [isRemember=true] 是否记住
 * @param {string} [expires=7] 过期时间，仅当isRemember时有效
 */
function setLoginState(token: string, isRemember: boolean = true, expires: number = 7) {
  // 存放在localStorage中
  localStorage.setItem('keep-login', JSON.stringify(isRemember));

  if (isRemember) {
    // 存放在cookie里边
    const options: Cookie.CookieAttributes = {
      path: '/',
      domain: window.location.hostname,
      expires,
    };
    Cookie.set('auth-token', token, options);
  } else {
    // 不保持登录则则放在session Storage里边
    sessionStorage.setItem('auth-token', token);
  }
}

/**
 * 清空登录状态
 */
function clearLoginState(): void {
  const option = {
    path: '/',
  };
  Cookie.remove('auth-token', option);
  localStorage.removeItem('keep-login');
  sessionStorage.removeItem('auth-token');
}

/**
 * 是否保持登录
 * @returns {boolean} true则表示保持登录
 */
function isKeepLogin(): boolean {
  const isRemember = localStorage.getItem('keep-login');
  if (!isRemember) {
    return false;
  }
  try {
    // @ts-ignore
    const result = JSON.parse(isRemember);
    return !!result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * 是否已登录(本地判断)
 * @returns {boolean} true表明已登录
 */
function isLogin(): boolean {
  if (isKeepLogin()) {
    return Boolean(Cookie.get('auth-token'));
  }
  return Boolean(sessionStorage.getItem('auth-token'));
}

/**
 * 获取纯token
 * @returns {string} token
 */
function getToken(): string {
  if (isKeepLogin()) {
    return `${Cookie.get('auth-token')}`;
  }
  return sessionStorage.getItem('auth-token') || '';
}

const LocalLoginStateManager = {
  setLoginState,
  clearLoginState,
  isKeepLogin,
  isLogin,
  getToken,
};

export default LocalLoginStateManager;
