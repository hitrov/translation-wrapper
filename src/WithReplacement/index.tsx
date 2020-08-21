import React, { useReducer, useState } from "react";
import { initialState, reducer } from "../reducers";
import {
  resolveTranslation,
} from "../actions";
import { Select } from "../Select";
import { connect } from 'react-redux';
import { RootState } from "../reducers/redux";
import { setLanguage, SetLanguage } from '../reducers/language';

interface IProps {
  language: string;

  setLanguage(language: string): SetLanguage;
}

interface WithReplacementProps {
  translatableProps: {
    getHeader(): string;
    getContent(): string;
  }
}

export const wrapper = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P & WithReplacementProps & IProps) => {

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

    const language = props.language;

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
            // const setLanguageAction: SetLanguage = {
            //   type: SET_LANGUAGE,
            //   language: e.target.value,
            // };
            // dispatch(setLanguageAction);
            props.setLanguage(e.target.value);
          }}
        />
        {(showOriginal || !hasTranslation) && TranslateButton}
        {!showOriginal && hasTranslation && ShowOriginalButton}
      </>
    );
  };

type StateProps = Pick<IProps, | 'language'>;
type DispatchProps = Pick<IProps, | 'setLanguage'>;
type OwnProps = Omit<
  IProps,
  keyof StateProps | keyof DispatchProps
>;

const connector = connect<StateProps, DispatchProps, OwnProps, RootState>((state: RootState) => ({
  language: state.language,
}), {
  setLanguage,
});

export function withReplacement<T>(Component: React.ComponentType<T>) {
  return connector(wrapper<any>(Component));
}