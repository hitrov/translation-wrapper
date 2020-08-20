import React, { useEffect, useState } from 'react';
import './App.css';

interface ContentProps {
  header: string;
  content: string;
  ReplaceButton?: React.ReactElement;
  translatedProps?: {
    header: string;
    content: string;
  }
}

function Content(props: ContentProps) {
  const { header, content, ReplaceButton, translatedProps } = props;

  return (
    <>
      <h1>{translatedProps && translatedProps.header || header}</h1>
      <p>{translatedProps && translatedProps.content || content}</p>
      {ReplaceButton}
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
    const [ header, setHeader ] = useState(getHeader());
    const [ content, setContent ] = useState(getContent());

    const ReplaceButton = (
      <button onClick={() => {
        setHeader('new header');
        setContent('replacement goes here');
      }}>
        Replace
      </button>
    );

    return (
      <Component
        {...rest as P}
        translatedProps={{
          header,
          content,
        }}
        ReplaceButton={ReplaceButton}
      />
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

export default App;
