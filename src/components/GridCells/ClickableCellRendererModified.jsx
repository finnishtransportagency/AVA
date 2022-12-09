import React from 'react';
import { withRouter } from 'react-router-dom';
import { useFoldersData } from "../../hooks/useFoldersData";
import { getModifiedDate } from "../../service/DateService";

export const Cell = props => {
  const indexHTML = useFoldersData(props);

  if (indexHTML !== null) {
    return (
      <span tabIndex='0' title={props.value}>
        -
      </span>
    );
  }

  return <ClickableCellRendererModified {...props} />;
};

const ClickableCellRendererModified = props => {

  const GetLink = () => {

    if (props.value === 'BackToParent') {
      return ('');
    } else if (!props.data.onkohakemisto) {
      return (
        <span tabIndex='0' title={props.value}>
          {getModifiedDate(props.data.lastmodified)}
        </span>
      );
    }
    return (
      <span tabIndex='0' title={props.value}>
        {getModifiedDate(props.data.lastmodified)}
      </span>
    );
  };

  return <div className='data-wrapper'>{GetLink()}</div>;
};

export default withRouter(Cell);