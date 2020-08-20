import React, { MouseEventHandler, useEffect, useState } from 'react';
import './App.css';

interface HelloProps {
  header: string;
  content: string;
  TranslateButton?: React.ReactElement;
}

class Hello extends React.PureComponent<HelloProps> {
// class Hello extends React.Component<HelloProps> {
  componentDidUpdate(prevProps: Readonly<HelloProps>) {
    console.log('componentDidUpdate', this.constructor.name);
    console.log('prevProps', prevProps, 'this.props', this.props);
  }

  render() {
    console.log('render Hello');

    const { header, content, TranslateButton } = this.props;

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
}

// function Hello(props: HelloProps) {
//   const { header, content, TranslateButton } = props;
//
//   console.log('render Hello', {
//     header,
//     content,
//   });
//
//   return (
//     <div>
//       <h1>{header}</h1>
//       <p>{content}</p>
//       <div>
//         {TranslateButton}
//       </div>
//     </div>
//   );
// }

interface WithLoadingProps {
  loading: boolean;

  getHeader(): string;
  getContent(): string;
}

interface WithLoadingState {
  header: string;
  content: string;
  counter: number;
}

const withLoading = <P extends object>(Component: React.ComponentType<P>) =>
  // class WithLoading extends React.PureComponent<P & WithLoadingProps, WithLoadingState> {
  class WithLoading extends React.Component<P & WithLoadingProps, WithLoadingState> {
    state: Readonly<WithLoadingState> = {
      header: '',
      content: '',
      counter: 0,
    };

    // constructor(props: P & WithLoadingProps) {
    //   super(props);
    //
    //   // this.onClick = this.onClick.bind(this);
    //   // this.onAddClick = this.onAddClick.bind(this);
    // }

    componentDidMount() {
      const { getContent, getHeader } = this.props;

      this.setState({
        header: getHeader(),
        content: getContent(),
      });
    }

    componentDidUpdate(prevProps: Readonly<P & WithLoadingProps>, prevState: Readonly<WithLoadingState>) {
      console.log('componentDidUpdate', this.constructor.name);
      console.log('prevProps', prevProps, 'this.props', this.props);
      console.log('prevState', prevState, 'this.state', this.state);
    }

    onAddClick = () => {
      this.setState({
        counter: this.state.counter + 1,
      })
    }

    onClick = () => {
      console.log('onClick');
      // debugger;
      this.setState({
        header: 'Теперь...',
        content: '...по-русски!',
      });
    };

    render() {
      const { loading, ...props } = this.props;

      const TranslateButton = (
        <ActionButton
          text={'Translate'}
          onClick={this.onClick}
        />
      );

      const { counter, header, content } = this.state;

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
            {...props as P}
          />

          <div>
            {counter}
            <button onClick={this.onAddClick}>Add</button>
          </div>
        </>
      );
    }
  };

const HelloLoading = withLoading(Hello);

function App() {
  const [ loading, setLoading ] = useState(true);
  const [ content, setContent ] = useState( 'Hello...');
  const [ header, setHeader ] = useState('...and welcome');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setHeader('Now this is...');
      setContent('...too late!');
    }, 200000);
  });

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

// const { loading, getContent, getHeader, ...props } = this.props;
// const [ content, setContent ] = useState(getContent());
// const [ header, setHeader ] = useState(getHeader());
//
// const onClick = () => {
//   setHeader('Теперь...');
//   setContent('...по-русски!');
// };
