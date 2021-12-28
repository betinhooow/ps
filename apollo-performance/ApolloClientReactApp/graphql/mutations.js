import { gql } from '@apollo/client';

export const TOGGLE_SPEAKERS_FAVORITE = gql`
mutation toggleSpeakerFavorite($speakerId: Int!){
  toggleSpeakerFavorite(speakerId: $speakerId){
    id,
    first,
    last,
    favorite
  }
}
`

export const DELETE_SPEAKERS = gql`
mutation deleteSpeaker($speakerId: Int!){
  deleteSpeaker(speakerId: $speakerId){
    id,
    first,
    last,
    favorite
  }
}
`

export const ADD_SPEAKERS = gql`
mutation addSpeaker($first: String!, $last: String!, $favorite: Boolean!){
  addSpeaker(speaker: {
    first: $first,
    last: $last,
    favorite: $favorite
  }){
    id,
    first,
    last,
    favorite
  }
}
`