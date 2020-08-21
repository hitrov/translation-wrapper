import React from 'react';
import './App.css';
import { Content } from "./Content";
import { withReplacement } from "./WithReplacement";
import { TranslatableContent } from "./actions";

const ContentWithReplacement = withReplacement(Content);

const content: TranslatableContent[] = [
  {
    header: 'one',
    content: 'lorem1',
  },
  {
    header: 'two',
    content: 'lorem2',
  },
  {
    header: 'three',
    content: 'lorem3',
  },
];

function App() {
  return (
    <>
      {content.map(({ header, content }) => (
        <ContentWithReplacement
          key={header}
          header={header}
          content={content}
          translatableProps={{
            getContent: () => content,
            getHeader: () => header,
          }}
        />
      ))}
    </>
  );
}

export default App;
