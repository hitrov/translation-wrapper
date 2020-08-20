import React, { useEffect, useState } from 'react';
import './App.css';

const Hello = ({ header, content }: { header: string, content: string }) => (
  <div>
    <h1>{header}</h1>
    <p>{content}</p>
  </div>
);

interface WithLoadingProps {
  loading: boolean;
  getHeader(): string;
  getContent(): string;
}

function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return class WithLoading extends React.Component<P & WithLoadingProps> {
    render() {
      const { loading, getContent, getHeader, ...props } = this.props;

      const content = getContent();
      const header = getHeader();

      return (
        <>
          {loading && <div>loading...</div>}
          <Component
            content={content}
            header={header}
            {...props as P}
          />
        </>
      );
    }
  }
}

const HelloLoading = withLoading(Hello);

function App() {
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
  });

  const header = 'hello!';
  const content = 'and welcome';

  return (
    <div className="App">
      <HelloLoading
        header={header}
        content={content}
        getContent={() => content}
        getHeader={() => header}
        loading={loading}
      />
    </div>
  );
}

export default App;
