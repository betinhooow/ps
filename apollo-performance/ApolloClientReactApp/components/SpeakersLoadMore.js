import React from 'react';
import { useQuery, NetworkStatus } from '@apollo/client';
import { GET_SPEAKERS_CONCAT } from '../graphql/queries';

const SpeakersLoadMore = () => {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    GET_SPEAKERS_CONCAT,
    {
      variables: {
        afterCursor: "",
        limit: 4,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const loadingMoreSpeakers = networkStatus === NetworkStatus.fetchMore;

  if (loading && !loadingMoreSpeakers) {
    return <div className="col-sm6">Loading...</div>;
  }

  if (error === true) {
    return <div className="col-sm6">Error</div>;
  }
  const { datalist } = data.speakersConcat;
  const { hasNextPage, lastCursor } = data.speakersConcat.pageInfo;
  console.log(data)
  return (
    <div className="container show-fav mt-3">
      {datalist.map(({ id, first, last }) => {
        return (
          <div key={id} className="col-sm-12">
            {first} {last} ({id})
          </div>
        );
      })}

      {hasNextPage && (
        <button
          className="btn btn-primary mt-2"
          onClick={() => {
            console.log(lastCursor)
            fetchMore({
              variables: {
                afterCursor: lastCursor,
              },
            });
          }}
        >
          {loadingMoreSpeakers ? 'Loading...' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default SpeakersLoadMore;