import { ApolloProvider } from '@apollo/client';
import { useApollo } from './../graphql/apolloClient';

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo();

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps}></Component>
    </ApolloProvider>
  );
}
