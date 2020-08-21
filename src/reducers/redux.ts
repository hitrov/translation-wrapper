import { combineReducers } from 'redux';
import language from './language';

export interface RootState {
  language: string;
}

const reducer = combineReducers<RootState>({
  language,
});

export default reducer;
