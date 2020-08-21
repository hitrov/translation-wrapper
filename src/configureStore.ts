import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import reducer, { RootState } from './reducers/redux';

const configureStore = () => {
  const middlewares: Middleware[] = [];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger({
      diff: true,
    }));
  }

  return createStore(
    reducer,
    {},
    applyMiddleware(...middlewares)
  ) as Store<RootState>;
};

export default configureStore;
