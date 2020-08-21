import { State } from "../reducers";

export const TRANSLATION_REQUEST = 'TRANSLATION_REQUEST';
export const TRANSLATION_SUCCESS = 'TRANSLATION_SUCCESS';
export const TRANSLATION_FAILURE = 'TRANSLATION_FAILURE';

export interface TranslationRequest {
  type: typeof TRANSLATION_REQUEST;
  language: string;
}

export interface TranslationSuccess {
  type: typeof TRANSLATION_SUCCESS;
  translated: TranslatableContent;
  language: string;
}

export interface TranslationFailure {
  type: typeof TRANSLATION_FAILURE;
  error: string;
}

export const resolveTranslation = (
  state: State,
  language: string,
  hasTranslation: boolean,
  setShowOriginal: (value: boolean) => void,
  dispatch: (action: Action) => void
) => {
  if (hasTranslation) {
    setShowOriginal(false);
    return;
  }

  const action: TranslationRequest = {
    type: TRANSLATION_REQUEST,
    language,
  };
  dispatch(action);

  let resolveAction: TranslationSuccess | TranslationFailure;
  if (Math.random() <= .7) {
    resolveAction = {
      type: TRANSLATION_SUCCESS,
      translated: {
        header: `[${language}] = ${state.original.header}`,
        content: `[${language}] = ${state.original.content}`,
      },
    } as TranslationSuccess;
  } else {
    resolveAction = {
      type: TRANSLATION_FAILURE,
      error: 'Something went wrong.',
    } as TranslationFailure;
  }

  setTimeout(() => {
    dispatch(resolveAction);
    if (resolveAction.type === TRANSLATION_SUCCESS) {
      setShowOriginal(false);
    } else {
      setShowOriginal(true);
    }
  }, 1000);
};

export interface TranslatableContent {
  header: string;
  content: string;
}

export type Action = TranslationRequest | TranslationSuccess | TranslationFailure;