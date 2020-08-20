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
}

function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return class WithLoading extends React.Component<P & WithLoadingProps> {
    render() {
      const { loading, ...props } = this.props;

      return (
        <>
          {loading && <div>loading...</div>}
          <Component {...props as P} />
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

  return (
    <div className="App">
      <HelloLoading header={'hello!'} content={'and welcome'} loading={loading} />
    </div>
  );
}

export default App;
