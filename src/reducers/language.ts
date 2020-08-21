export const SET_LANGUAGE = 'SET_LANGUAGE';

export interface SetLanguage {
  type: typeof SET_LANGUAGE;
  language: string;
}

const language = (state = 'en', action: SetLanguage): string => {
  switch (action.type) {
    case SET_LANGUAGE:
      return action.language;
    default:
      return state;
  }
};

export default language;