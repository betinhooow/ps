import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { useParams } from "react-router-dom";
import "./style-sessions.css";

const SPEAKER_INFO = gql`
  fragment SpeakerInfo on Speaker {
      id,
      bio,
      name,
      sessions {
        title,
        id
      }
  }
`

const SPEAKERS = gql`
  query speakers {
    speakers {
      ...SpeakerInfo
    }
  }

  ${SPEAKER_INFO}
`

const SPEAKER_BY_ID = gql`
  query speakers($id: ID!) {
    speakerById(id: $id) {
      ...SpeakerInfo
    }
  }

  ${SPEAKER_INFO}
`

const SpeakerList = () => {
  const { loading, error, data } = useQuery(SPEAKERS);

  if (error) return <p>Something went wrong</p>
  if (loading) return <p>Loading speakers...</p>

  /* ---> Replace hardcoded speaker values with data that you get back from GraphQL server here */
  const featured = false;

  return data.speakers.map(({ id, bio, name, sessions }) => {
    return <div
      key={id}
      className="col-xs-12 col-sm-6 col-md-6"
      style={{ padding: 5 }}
    >
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{`Speaker: ${name}`}</h3>
        </div>
        <div className="panel-body">
          <h5>{`Bio: ${bio}` }</h5>
        </div>
        <div className="panel-footer">
          <h4>Sessions</h4>
					{
            sessions.map((session) => {
              return <span key={session.id} style={{ padding: 2}}>
                <p>{session.title}</p>
              </span>
            })
					}
          <span>	
            <button	
              type="button"	
              className="btn btn-default btn-lg"	
              onClick={()=> {
                /* ---> Call useMutation's mutate function to mark speaker as featured */
              }}	
              >	
                <i	
                  className={`fa ${featured ? "fa-star" : "fa-star-o"}`}	
                  aria-hidden="true"	
                  style={{	
                    color: featured ? "gold" : undefined,	
                  }}	
                ></i>{" "}	
                Featured Speaker	
            </button>	
          </span>
        </div>
      </div>
    </div>
  });
};

const SpeakerDetails = () => {
  const { speaker_id } = useParams();
  console.log(speaker_id)
  const { loading, error, data } = useQuery(SPEAKER_BY_ID, {
    variables: { id: speaker_id }
  });

  if (error) return <p>Something went wrong</p>
  if (loading) return <p>Loading speakers...</p>

  const { id, name, bio, sessions } = data.speakerById;

  return (
    <div key={id} className="col-xs-12" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{name}</h3>
        </div>
        <div className="panel-body">
          <h5>{bio}</h5>
        </div>
        <div className="panel-footer">
          {sessions.map(session => {
            return <p key={session.id}>{session.title}</p>
          })}
        </div>
      </div>
    </div>
  );
};

export function Speaker() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerDetails />
        </div>
      </div>
    </>
  );
}


export function Speakers() {
  return (
    <>
      <div className="container">
        <div className="row">
          <SpeakerList />
        </div>
      </div>
    </>
  );
}

	
