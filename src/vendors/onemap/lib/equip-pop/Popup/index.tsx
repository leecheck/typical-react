import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import history from 'app/utils/history';
import configureStore from 'app/configure-store';
const initialState = {};
export const store = configureStore(initialState, history);

export function getPopupContent(Component, className, props = {}) {
  const content = document.createElement('div');
  content.className = className || 'own-popup';
  ReactDOM.render(
    <Provider store={store}>
      <Component {...props} />
    </Provider>,
    content,
  );
  return content;
}
