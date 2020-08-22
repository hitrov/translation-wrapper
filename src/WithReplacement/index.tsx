import React, { useReducer, useState } from "react";
import { initialState, reducer } from "../reducers";
import { resolveTranslation, } from "../actions";
import { Select } from "../Select";
import { connect } from 'react-redux';
import { RootState } from "../reducers/redux";
import { setLanguage, SetLanguage, } from '../reducers/language';
import { Diff } from 'utility-types';

interface InjectedProps {
  language: string;

  setLanguage(language: string): SetLanguage;
}

export interface WithReplacementProps {
  translatableProps?: {
    getHeader(): string;
    getContent(): string;
  }
}

export const withReplacement = <BaseProps extends WithReplacementProps>
(Component: React.ComponentType<BaseProps>) => {

  const mapStateToProps = (state: RootState) => ({
    language: state.language,
  });

  const dispatchProps = {
    setLanguage: (language: string) => setLanguage(language),
  };

  type PropsFromRedux = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
    // here you can extend ConnectedHoc with new props
    // overrideCount?: number;
  };

  const Hoc = (props: PropsFromRedux & WithReplacementProps) => {

    const { translatableProps, language, setLanguage, ...rest } = props;

    const [ showOriginal, setShowOriginal ] = useState(true);

    let header = '';
    let content = '';
    if (translatableProps) {
      const { getHeader, getContent } = translatableProps;
      header = getHeader();
      content = getContent();
    }

    const [ state, dispatch ] = useReducer(reducer, {
      ...initialState,
      original: {
        header,
        content,
      },
    });

    const hasTranslation = !!state.translated[language];

    const TranslateButton = (
      <button
        disabled={state.inProgress}
        onClick={() => resolveTranslation(
          state,
          language,
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
          {...rest as BaseProps}
          translatedProps={{
            header,
            content,
          }}
        />
        {state.error && <div style={{ color: 'red' }}>{state.error}</div>}
        <Select
          language={language}
          onChange={e => {
            setLanguage(e.target.value);
          }}
        />
        {(showOriginal || !hasTranslation) && TranslateButton}
        {!showOriginal && hasTranslation && ShowOriginalButton}
      </>
    );
  };

  return connect<ReturnType<typeof mapStateToProps>,
    typeof dispatchProps, // use "undefined" if NOT using dispatchProps
    Diff<BaseProps, InjectedProps>,
    RootState>(
    mapStateToProps,
    dispatchProps
  )(Hoc);
};
