import * as styledComponents from 'styled-components';
/* eslint-disable @typescript-eslint/indent */
// theme.ts
// your theme variables
export interface IThemeInterface {
  primary: string;
  componentBackground: string;
  componentBackgroundSecondary: string;
}

export const theme = {
  default: {
    primary: '#fff',
    componentBackground: '#fff',
    componentBackgroundSecondary: '#fff',
  },
};
const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<IThemeInterface>;

export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
/* eslint-enable @typescript-eslint/indent */
