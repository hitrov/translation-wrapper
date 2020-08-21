export const SET_LANGUAGE = 'SET_LANGUAGE';

export interface SetLanguage {
  type: typeof SET_LANGUAGE;
  language: string;
}

export const setLanguage = (language: string) => ({
  type: SET_LANGUAGE,
  language,
} as SetLanguage);

const language = (state = 'de', action: SetLanguage): string => {
  switch (action.type) {
    case SET_LANGUAGE:
      return action.language;
    default:
      return state;
  }
};

export default language;