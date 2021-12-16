/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from "react";  
import "./style-sessions.css";
import { Link } from "react-router-dom"
import { Formik, Field, Form } from "formik"
import { gql, useMutation, useQuery } from "@apollo/client";

const SESSION_INFO = gql`
  fragment SessionInfo on Session {
      id,
      title,
      room,
      day,
      description @include(if: $isDescription),
      startsAt,
      level, 
      speakers {
        id,
        name
      }
  }
`

const CREATE_SESSION = gql`
  mutation createSession($session: SessionInput!) {
    createSession(session: $session) {
      id,
      title,
      description,
      day,
      level
    }
  }
`

const ALL_SESSIONS = gql`
  query sessions($isDescription: Boolean!) {
    sessions {
      ...SessionInfo
    }
  }
  ${SESSION_INFO}
`

const SESSIONS = gql`
  query sessions($day: String!, $isDescription: Boolean!) {
    intro: sessions(day: $day, level: "Introductory and overview") {
      ...SessionInfo
    }
    intermediate: sessions(day: $day, level: "Intermediate") {
      ...SessionInfo
    }
    advanced: sessions(day: $day, level: "Advanced") {
      ...SessionInfo
    }
  }
  ${SESSION_INFO}
`

function AllSessionList() {
  const isDescription = true;
  const { loading, data, error } = useQuery(ALL_SESSIONS, {
    variables: { isDescription }
  });

  if (loading) return <p>Loading sessions...</p>
  if (error) return <p>Something went wrong...</p>

  return data.sessions.map(session => {
    return <SessionItem 
      key={session.id}
      session={{
        ...session
      }}
    />
  })
}

function SessionList ({ day }) {
  const isDescription = true;
  const { loading, data, error } = useQuery(SESSIONS, {
    variables: { day, isDescription }
  });

  if (loading) return <p>Loading sessions...</p>

  if (error) return <p>Something went wrong...</p>

  return [
    ...data.intro,
    ...data.intermediate,
    ...data.advanced
  ].map((session) => {
    return <SessionItem 
      key={session.id}
      session={{
        ...session
      }}
    />
  })
}

function SessionItem({ session }) {
  const { id, title, day, level, room, speakers, startsAt, description } = session;

  /* ---> Replace hard coded session values with data that you get back from GraphQL server here */
  return (
    <div key={id} className="col-xs-12 col-sm-6" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{title}</h3>
          <h5>{`Level: ${level}`}</h5>
        </div>
        <div className="panel-body">
          <h5>{`Day: ${day}`}</h5>
          <h5>{`Description: ${description}`}</h5>
          <h5>{`Room Number: ${room}`}</h5>
          <h5>{`Starts at: ${startsAt}`}</h5>
        </div>
        <div className="panel-footer">
          {
            speakers.map(({ id, name }) => {
              return <span key={id} style={{ padding: 2 }}>
                <Link className="btn btn-default btn-lg"
                to={`/conference/speaker/${id}`}>
                  View {name}'s profile 
                </Link>
              </span>
            })
          }
        </div>
      </div>
    </div>
  );
}

export function Sessions() {

  const [day, setDay] = useState("");
  return (
    <>
      <section className="banner">
        <div className="container">
        <div className="row" style={{ padding: 10 }}>	
            <Link	
              className="btn btn-lg center-block"	
              to={`/conference/sessions/new`}	
            >	
              Submit a Session!	
            </Link>	
          </div>
          <div className="row">
          <button type="button" onClick={() => setDay('All')} className="btn-oval">
              All Sessions
            </button >
            <button type="button" onClick={() => setDay('Wednesday')} className="btn-oval">
              Wednesday
            </button>
            <button type="button"  onClick={() => setDay('Thursday')} className="btn-oval">
              Thursday
            </button>
            <button type="button" onClick={() => setDay('Friday')} className="btn-oval">
              Friday
            </button >
          </div>
          { day !== 'All' && <SessionList day={day} />}
          { day === 'All' && <AllSessionList /> }
        </div>
      </section>
    </>
  );
}

export function SessionForm() {	
  const updateSessions = (cache, { data }) => {
    cache.modify({
      fields: {
        sessions(existingSessions = []) {
          const newSession = data.createSession;
          cache.writeQuery({
            query: ALL_SESSIONS,
            data: { newSession, ...existingSessions }
          })
        }
      }
    })
  }
  const [create, { called, error }] = useMutation(CREATE_SESSION, {
    update: updateSessions
  })

  if(called) return <p>Session Inserted!</p>
  if(error) return <p>Something went wrong!</p>

  return (	
    <div	
      style={{	
        width: "100%",	
        display: "flex",	
        alignContent: "center",	
        justifyContent: "center",	
        padding: 10,	
      }}	
    >	
      <Formik	
        initialValues={{	
          title: "",	
          description: "",	
          day: "",	
          level: "",	
        }}	
        onSubmit={async (values) => {
          await create({ variables: { session: values }})
        }}	
      >	
        {() => (	
          <Form style={{ width: "100%", maxWidth: 500 }}>	
            <h3 className="h3 mb-3 font-weight-normal">Submit a Session!</h3>	
            <div className="mb-3" style={{ paddingBottom: 5 }}>	
              <label htmlFor="inputTitle">Title</label>	
              <Field	
                id="inputTitle"	
                className="form-control"	
                required	
                autoFocus	
                name="title"	
              />	
            </div>	
            <div className="mb-3" style={{ paddingBottom: 5 }}>	
              <label htmlFor="inputDescription">Description</label>	
              <Field	
                type="textarea"	
                id="inputDescription"	
                className="form-control"	
                required	
                name="description"	
              />	
            </div>	
            <div className="mb-3" style={{ paddingBottom: 5 }}>	
              <label htmlFor="inputDay">Day</label>	
              <Field	
                name="day"	
                id="inputDay"	
                className="form-control"	
                required	
              />	
            </div>	
            <div className="mb-3" style={{ paddingBottom: 5 }}>	
              <label htmlFor="inputLevel">Level</label>	
              <Field	
                name="level"	
                id="inputLevel"	
                className="form-control"	
                required	
              />	
            </div>	
            <div style={{ justifyContent: "center", alignContent: "center" }}>
              <button className="btn btn-primary">Submit</button>	
            </div>
          </Form>	
        )}	
      </Formik>	
    </div>	
  );	
}

export function AddSession() {	
  return (	
    <>	
      <section className="banner">	
        <div className="container">	
          <div className="row">	
            <SessionForm />	
          </div>	
        </div>	
      </section>	
    </>	
  );	
}
