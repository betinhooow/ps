
import Toolbar from '../components/Toolbar';
import { useQuery, useReactiveVar } from '@apollo/client';
import SpeakerItem from './SpeakerItem';
import { GET_SPEAKERS } from '../graphql/queries';
import { currentThemeVar, paginationDataVar } from '../graphql/apolloClient';

const SpeakerListItems = () => {
  const { currentPage, limit } = useReactiveVar(paginationDataVar);
  const { loading, error, data } = useQuery(GET_SPEAKERS, {
    variables: {
      offset: currentPage * limit,
      limit
    }
  });
  const currentTheme = useReactiveVar(currentThemeVar);

  if (loading === true) return <div className="col-sm6">Loading...</div>;

  if (error === true) return <div className="col-sm6">Error</div>;

  return (
    <>
      <Toolbar totalItemCount={data.speakers.pageInfo.totalItemCount} />
      <div className="container show-fav">
        <div className="row">
          <div className={currentTheme === "dark" ? "fav-list dark" : "fav-list"}>
            {data.speakers.datalist.map((speakerRec) => {
              return (
                <SpeakerItem speakerRec={speakerRec} />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpeakerListItems;