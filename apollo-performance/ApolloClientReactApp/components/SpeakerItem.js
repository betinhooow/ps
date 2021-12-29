import { useMutation, useReactiveVar } from '@apollo/client';
import React from 'react';
import { checkBoxListVar, paginationDataVar } from '../graphql/apolloClient';
import { DELETE_SPEAKERS, TOGGLE_SPEAKERS_FAVORITE } from '../graphql/mutations';
import { GET_SPEAKERS } from '../graphql/queries';

const SpeakerItem = ({ speakerRec }) => {
  const { id, first, last, favorite, fullName, checkBoxColumn } = speakerRec;
  const [toggle] = useMutation(TOGGLE_SPEAKERS_FAVORITE);
  const [deleteSpeaker] = useMutation(DELETE_SPEAKERS);

  const { currentPage, limit, offset } = useReactiveVar(paginationDataVar);
  const selectedSpeakersIds = useReactiveVar(checkBoxListVar);

  return (
    <div className="favbox" key={id}>
      <div className="fav-clm col-sm-7">
        <span className={
          checkBoxColumn ? "fa fa-check-square-o" : "fa fa-square-o"
        }
        onClick={() => {
          checkBoxListVar(
            checkBoxColumn
              ? selectedSpeakersIds.filter((rec) => {
                return rec != id
              })
              : selectedSpeakersIds ?
                [...selectedSpeakersIds, id]
              : [id]
          )
        }}></span>
        <h4>
          {fullName} ({id})
        </h4>
      </div>
      <div className="fav-clm col-sm-5">
        <div className="action">
          <span onClick={() => toggle({
            variables: {
              speakerId: parseInt(id)
            },
            optimisticResponse: {
              __typename: "Mutation",
              toggleSpeakerFavorite: {
                id, first, last, favorite: !favorite,
                __typename: "Speaker"
              }
            }
            })}>
            <div
              className={
                favorite === true
                  ? 'fa fa-star orange'
                  : 'fa fa-star-o orange'
              }
            />
            &nbsp;&nbsp; Favorite
          </span>
          <span onClick={() => {
            deleteSpeaker({
              variables: {speakerId: parseInt(id)},
              //refetchQueries: [{query: GET_SPEAKERS}]
              optimisticResponse: {
                typename: "__mutation",
                deleteSpeaker: {
                  id, first, last, favorite,
                  __typename: "Speaker"
                }
              },
              update: (cache, { data: { deleteSpeaker }}) => {
                const { speakers } = cache.readQuery({
                  query: GET_SPEAKERS,
                  variables: {
                    offset,
                    limit
                  }
                })
                cache.writeQuery({
                  query: GET_SPEAKERS,
                  variables: {
                    offset,
                    limit
                  },
                  data: {
                    speakers: {
                      __typename: "SpeakerResults",
                      datalist: speakers.datalist.filter(speaker => speaker.id != deleteSpeaker.id),
                      pageInfo: {
                        __typename: "PageInfo",
                        totalItemCount: 0
                      }
                    }
                  }
                })
              }
            })
          }}>
            <i className='fa fa-trash red'></i> Delete
          </span>
        </div>
      </div>
    </div>
  )
}

export default SpeakerItem;