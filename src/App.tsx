import React, { MouseEventHandler, useEffect, useState } from 'react';
import './App.css';

interface HelloProps {
  header: string;
  content: string;
  TranslateButton?: React.ReactElement;
}

// class Hello extends React.PureComponent<HelloProps> {
// // class Hello extends React.Component<HelloProps> {
//   componentDidUpdate(prevProps: Readonly<HelloProps>) {
//     console.log('componentDidUpdate', this.constructor.name);
//     console.log('prevProps', prevProps, 'this.props', this.props);
//   }
//
//   render() {
//     console.log('render Hello');
//
//     const { header, content, TranslateButton } = this.props;
//
//     return (
//       <div>
//         <h1>{header}</h1>
//         <p>{content}</p>
//         <div>
//           {TranslateButton}
//         </div>
//       </div>
//     );
//   }
// }

function Hello(props: HelloProps) {
  const { header, content, TranslateButton } = props;

  console.log('render Hello', {
    header,
    content,
  });

  return (
    <div>
      <h1>{header}</h1>
      <p>{content}</p>
      <div>
        {TranslateButton}
      </div>
    </div>
  );
}

interface WithLoadingProps {
  loading: boolean;

  getHeader(): string;
  getContent(): string;
}

const withLoading = <P extends object>(Component: React.ComponentType<P>) =>
  (props: P & WithLoadingProps) => {

    const { loading, getContent, getHeader, ...rest } = props;
    const [ header, setHeader ] = useState(getHeader());
    const [ content, setContent ] = useState(getContent());
    const [ counter, setCounter ] = useState(0);

    const onAddClick = () => {
      setCounter(counter + 1);
    }

    const onClick = () => {
      console.log('onClick');
      // debugger;
      setHeader('Теперь...');
      setContent('...по-русски!');
    };

    const TranslateButton = (
      <ActionButton
        text={'Translate'}
        onClick={onClick}
      />
    );

    console.log('render WithLoading', {
      header,
      content,
    });

    return (
      <>
        <div>header: {header}</div>
        <div>content: {content}</div>

        {loading && <div>loading...</div>}
        <Component
          header={header}
          content={content}
          TranslateButton={TranslateButton}
          {...rest as P}
        />

        <div>
          {counter}
          <button onClick={onAddClick}>Add</button>
        </div>
      </>
    );
  };

const HelloLoading = withLoading(Hello);

function App() {
  const [ loading, setLoading ] = useState(true);
  const [ content, setContent ] = useState( 'Hello...');
  const [ header, setHeader ] = useState('...and welcome');

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //     setHeader('Now this is...');
  //     setContent('...too late!');
  //   }, 5000);
  // });

  console.log('render App', {
    header,
    content,
  });

  return (
    <div className="App">
      <HelloLoading
        header={header}
        content={content}
        getHeader={() => header}
        getContent={() => content}
        loading={loading}
      />

      {/*<Hello*/}
      {/*  header={header}*/}
      {/*  content={content}*/}
      {/*/>*/}
    </div>
  );
}

interface ActionButtonProps {
  text: string;
  onClick: () => void;
}

const ActionButton = ({ onClick, text }: ActionButtonProps) => (
  <button onClick={onClick}>
    {text}
  </button>
);

export default App;
