import { useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { ADD_SPEAKERS } from '../graphql/mutations';
import { GET_SPEAKERS } from '../graphql/queries';

const Toolbar = () => {
  const apolloClient = useApolloClient();
  const [addSpeaker] = useMutation(ADD_SPEAKERS);

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [favorite, setFavorite] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    addSpeaker({
      variables: { first, last, favorite },
      //refetchQueries: [{query: GET_SPEAKERS}]
      update: (cache, { data: { addSpeaker }}) => {
        const { speakers } = cache.readQuery({
          query: GET_SPEAKERS
        })

        cache.writeQuery({
          query: GET_SPEAKERS,
          data: {
            speakers: {
              __typename: "SpeakerResults",
              datalist: [addSpeaker, ...speakers.datalist]
            }
          }
        })
      }
    })
    setFirst('');
    setLast('');
    setFavorite(false);
    setModal(!modal);
  };

  return (
    <section className="toolbar">
      <div className="container">
        <ul className="toolrow">
          <li>
            <div>
              <Button color="info" onClick={toggle}>
                <span>Insert Speaker</span>
              </Button>
              &nbsp;
              <Button color="info" onClick={() => {
                const { speakers } = apolloClient.cache.readQuery({
                  query: GET_SPEAKERS
                })
                apolloClient.cache.writeQuery({
                  query: GET_SPEAKERS,
                  data: {
                    speakers: {
                      __typename: "SpeakersResult",
                      datalist: [...speakers.datalist].sort((a,b) => b.id - a.id)
                    }
                  }
                })
              }}>
                <span>Sort Speakers By Id Descending</span>
              </Button>
              <Modal isOpen={modal} toggle={toggle}>
                <Form onSubmit={handleSubmit}>
                  <ModalHeader toggle={toggle}>
                    Insert Speaker Dialog
                  </ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label for="first">First Name</Label>{' '}
                      <Input
                        name="first"
                        onChange={(e) => setFirst(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="first">Last Name</Label>{' '}
                      <Input
                        name="first"
                        onChange={(e) => setLast(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          onChange={(e) => setFavorite(e.target.value === 'on')}
                        />{' '}
                        Favorite
                      </Label>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button type="submit">Save</Button>
                  </ModalFooter>
                </Form>
              </Modal>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Toolbar;