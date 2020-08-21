import {
  Action,
  SET_LANGUAGE,
  TranslatableContent,
  TRANSLATION_FAILURE,
  TRANSLATION_REQUEST,
  TRANSLATION_SUCCESS
} from "../actions";

export interface State {
  original: TranslatableContent;
  translated: {
    [language: string]: TranslatableContent;
  };
  inProgress: boolean;
  error: string;
  language: string;
}

export const initialState: Omit<State, 'original'> = {
  translated: {},
  inProgress: false,
  error: '',
  language: 'en',
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    case TRANSLATION_REQUEST:
      return {
        ...state,
        inProgress: true,
        error: '',
      };
    case TRANSLATION_SUCCESS:
      return {
        ...state,
        inProgress: false,
        translated: {
          ...state.translated,
          [state.language]: action.translated,
        },
      };
    case TRANSLATION_FAILURE:
      return {
        ...state,
        inProgress: false,
        error: action.error,
      };
    default:
      return state;
  }
};