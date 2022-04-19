import { lazyLoad } from 'utils/loadable';

export default lazyLoad(
  () => import('./NotFoundPage'),
  (module) => module.default,
);
