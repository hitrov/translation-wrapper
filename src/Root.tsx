import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import App from "./App";

interface IProps {
  store: Store;
}

const Root = ({store}: IProps) => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
