import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { paginationDataVar } from '../graphql/apolloClient';

const PagingOffsetLimitControl = ({ lastPage }) => {
  const paginationData = useReactiveVar(paginationDataVar);
  const { currentPage } = paginationData;

  return (
    <div className="pagination">
      <a 
        onClick={() => {
          paginationDataVar({
            ...paginationData,
            currentPage: 0,
          });
        }} href="#" className="page-link" aria-label="Fisrt">
        <i className="fa fa-angle-double-left" aria-hidden="true"></i>
      </a>
      <a
        onClick={() => {
          if (currentPage > 0) {
            paginationDataVar({
              ...paginationData,
              currentPage: currentPage - 1,
            });
          }
        }} href="#" className="page-link" aria-label="Previous">
        <i className="fa fa-angle-left" aria-hidden="true"></i>
      </a>
      &nbsp;{paginationData.currentPage + 1}&nbsp;
      <a
        onClick={() => {
          if (currentPage < lastPage) {
            paginationDataVar({
              ...paginationData,
              currentPage: currentPage + 1,
            });
          }
        }}
        href="#"
        className="page-link"
        aria-label="Next"
      >
        <i className="fa fa-angle-right" aria-hidden="true"></i>
      </a>
      <a
        onClick={() => {
          paginationDataVar({
            ...paginationData,
            currentPage: lastPage,
          });
        }} href="#" className="page-link" aria-label="Last">
        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
      </a>
    </div>
  );
};

export default PagingOffsetLimitControl;
