import React, { useReducer, useState } from 'react';
import './App.css';

interface ContentProps {
  header: string;
  content: string;
  translatedProps?: {
    header: string;
    content: string;
  }
}

function Content(props: ContentProps) {
  const { header, content, translatedProps } = props;

  return (
    <>
      <h1>{translatedProps && translatedProps.header || header}</h1>
      <p>{translatedProps && translatedProps.content || content}</p>
    </>
  );
}

interface WithReplacementProps {
  translatableProps: {
    getHeader(): string;
    getContent(): string;
  }
}

const withReplacement = <P extends object>(Component: React.ComponentType<P>) =>
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
      <button onClick={() => {
        if (hasTranslation) {
          setShowOriginal(false);
          return;
        }

        const action: TranslationRequest = {
          type: TRANSLATION_REQUEST,
          language,
        };
        dispatch(action);

        const successAction: TranslationSuccess = {
          type: TRANSLATION_SUCCESS,
          translated: {
            header: `[${language}] = ${state.original.header}`,
            content: `[${language}] = ${state.original.content}`,
          },
        };

        setTimeout(() => {
          dispatch(successAction);
          setShowOriginal(false);
        }, 1000);
      }}>
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

    console.log('state', state);

    return (
      <>
        {state.inProgress && <div>loading...</div>}
        <Component
          {...rest as P}
          translatedProps={{
            header,
            content,
          }}
        />
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
        {!hasTranslation && TranslateButton}
        {ShowOriginalButton}
      </>
    );
  };

const ContentWithReplacement = withReplacement(Content);

function App() {
  const header = 'hello';
  const content = 'original content';

  return (
    <ContentWithReplacement
      header={header}
      content={content}
      translatableProps={{
        getContent: () => content,
        getHeader: () => header,
      }}
    />
  );
}

interface TranslatableContent {
  header: string;
  content: string;
}

const initialState: Omit<State, 'original'> = {
  translated: {},
  inProgress: false,
  error: '',
  language: 'en',
};

const TRANSLATION_REQUEST = 'TRANSLATION_REQUEST';
const TRANSLATION_SUCCESS = 'TRANSLATION_SUCCESS';
const TRANSLATION_FAILURE = 'TRANSLATION_FAILURE';
const SET_LANGUAGE = 'SET_LANGUAGE';

interface TranslationRequest {
  type: typeof TRANSLATION_REQUEST;
  language: string;
}

interface TranslationSuccess {
  type: typeof TRANSLATION_SUCCESS;
  translated: TranslatableContent;
}

interface TranslationFailure {
  type: typeof TRANSLATION_FAILURE;
  error: string;
}

interface SetLanguage {
  type: typeof SET_LANGUAGE;
  language: string;
}

type Action = TranslationRequest | TranslationSuccess | TranslationFailure | SetLanguage;

interface State {
  original: TranslatableContent;
  translated: {
    [language: string]: TranslatableContent;
  };
  inProgress: boolean;
  error: string;
  language: string;
}

const reducer = (state: State, action: Action): State => {
  console.log('prev state', state, 'action', action);

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

const Select = ({ language, onChange }: { language: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <select value={language} onChange={onChange}>
    <option value="en">EN</option>
    <option value="ru">RU</option>
    <option value="de">DE</option>
  </select>
);

export default App;
