import Loading from 'components/Loading/index';
import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./LoginPage'),
  loading: Loading
});
