import { RouterState } from 'react-router-redux';

export interface ApplicationState {
  readonly ROUTER: RouterState;
  readonly USER: any;
}
