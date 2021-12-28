
import Toolbar from '../components/Toolbar';
import { useQuery } from '@apollo/client';
import SpeakerItem from './SpeakerItem';
import { GET_SPEAKERS } from '../graphql/queries';

const SpeakerListItems = () => {
  const { loading, error, data } = useQuery(GET_SPEAKERS);

  if (loading === true) return <div className="col-sm6">Loading...</div>;

  if (error === true) return <div className="col-sm6">Error</div>;

  return (
    <>
      <Toolbar />
      <div className="container show-fav">
        <div className="row">
          <div className="fav-list">
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