import React, { MouseEventHandler, useEffect, useState } from 'react';
import './App.css';

interface HelloProps {
  header: string;
  content: string;
}

const Hello = ({ header, content }: HelloProps) => (
  <div>
    <h1>{header}</h1>
    <p>{content}</p>
  </div>
);

interface ActionButtonProps {
  text: string;
  onClick: () => void;
}

const ActionButton = ({ onClick, text }: ActionButtonProps) => (
  <button onClick={onClick}>{text}</button>
);

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

function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return class WithLoading extends React.Component<P & WithLoadingProps, WithLoadingState> {
    state: Readonly<WithLoadingState> = {
      header: '',
      content: '',
      counter: 0,
    };

    constructor(props: P & WithLoadingProps) {
      super(props);

      this.onClick = this.onClick.bind(this);
      this.onAddClick = this.onAddClick.bind(this);
    }

    componentDidMount() {
      const { getContent, getHeader } = this.props;

      this.setState({
        header: getHeader(),
        content: getContent(),
      });
    }

    onAddClick() {
      this.setState({
        counter: this.state.counter + 1,
      })
    }

    onClick() {
      console.log('onClick');
      // debugger;
      this.setState({
        header: 'Теперь...',
        content: '...по-русски!',
      });
    };

    render() {
      const { loading, ...props } = this.props;
      // const { loading, getContent, getHeader, ...props } = this.props;
      // const [ content, setContent ] = useState(getContent());
      // const [ header, setHeader ] = useState(getHeader());
      //
      // const onClick = () => {
      //   setHeader('Теперь...');
      //   setContent('...по-русски!');
      // };

      return (
        <>
          {loading && <div>loading...</div>}
          <Component
            header={this.state.header}
            content={this.state.content}
            {...props as P}
          />
          <ActionButton
            text={'Translate'}
            onClick={this.onClick}
          />
          <div>
            {this.state.counter}
            <button onClick={this.onAddClick}>Add</button>
          </div>
        </>
      );
    }
  }
}

const HelloLoading = withLoading(Hello);

function App() {
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  });

  const header = 'Hello!..';
  const content = '...and welcome';

  return (
    <div className="App">
      <HelloLoading
        header={header}
        content={content}
        getContent={() => content}
        getHeader={() => header}
        loading={loading}
      />

      {/*<Hello*/}
      {/*  header={header}*/}
      {/*  content={content}*/}
      {/*/>*/}
    </div>
  );
}

export default App;
