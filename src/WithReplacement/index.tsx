import React, { useReducer, useState } from "react";
import { initialState, reducer } from "../reducers";
import {
  resolveTranslation,
  SET_LANGUAGE,
  SetLanguage,
} from "../actions";
import { Select } from "../Select";

interface WithReplacementProps {
  translatableProps: {
    getHeader(): string;
    getContent(): string;
  }
}

export const withReplacement = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P & WithReplacementProps) => {

    const { translatableProps, ...rest } = props;
    const { getHeader, getContent } = translatableProps;
    const [ showOriginal, setShowOriginal ] = useState(true);

    let header = getHeader();
    let content = getContent();

    const [ state, dispatch ] = useReducer(reducer, {
      ...initialState,
      original: {
        header,
        content,
      },
    });

    const { language } = state;
    const hasTranslation = !!state.translated[language];

    const TranslateButton = (
      <button
        disabled={state.inProgress}
        onClick={() => resolveTranslation(
          state,
          hasTranslation,
          setShowOriginal,
          dispatch
        )}
      >
        Translate
      </button>
    );

    const ShowOriginalButton = (
      <button onClick={() => {
        setShowOriginal(true);
      }}>
        Show original
      </button>
    );

    if (hasTranslation && !showOriginal) {
      header = state.translated[language].header;
      content = state.translated[language].content;
    }

    return (
      <>
        <Component
          {...rest as P}
          translatedProps={{
            header,
            content,
          }}
        />
        {state.error && <div style={{ color: 'red' }}>{state.error}</div>}
        <Select
          language={language}
          onChange={e => {
            const setLanguageAction: SetLanguage = {
              type: SET_LANGUAGE,
              language: e.target.value,
            };
            dispatch(setLanguageAction);
          }}
        />
        {(showOriginal || !hasTranslation) && TranslateButton}
        {!showOriginal && hasTranslation && ShowOriginalButton}
      </>
    );
  };