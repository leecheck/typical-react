import { lazyLoad } from 'utils/loadable';

export default lazyLoad(
  () => import('./HomePage'),
  (module) => module.default,
);
