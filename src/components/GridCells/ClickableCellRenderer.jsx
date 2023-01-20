import React from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFoldersData } from "../../hooks/useFoldersData";
import {
  getParentPath,
  getShortFileNameFromFullPath,
  getShortFolderNameFromFullPath
} from "../../service/FilePathService";
import { fetchUrlAndOpenToNewTab } from "../../service/FileDownloadService";
import { getBackButtonOrFolderOrFileIcon } from "../Icon/GetFolderOrFileIcon";

export const Cell = props => {
  const indexHTML = useFoldersData(props);
  const { t } = useTranslation();

  // check index.htm. Must be under next folder not futher
  //if (indexHTML !== null) {
  if (indexHTML !== null && indexHTML.includes(props.value + 'index.htm')) {
    return (
      <a href={ indexHTML } target='_blank' rel='noreferrer'>
        <i
          className='fas fa-file ava-list-icon'
          role='img'
          aria-label={ t('file') }
        />
        { props.value.replace('ava', '') }
      </a>
    );
  }

  return <ClickableCellRenderer { ...props } />;
};

function isInstructionsFolder(props) {
  return props.data.onkohakemisto &&
    typeof props.value === 'string' &&
    props.value.toLowerCase().indexOf('Ohjeluettelo') >= 0;
}

const ClickableCellRenderer = props => {
  const { folder } = useParams();

  const GetLink = () => {
    const { t } = useTranslation();
    const parentPath = getParentPath(folder);

    if (props.value === 'BackToParent') {
      return (
        <Link to={ parentPath || '/' } title={ t('back') }>
          { getBackButtonOrFolderOrFileIcon(props.value, props.data.onkohakemisto) } { t('back') }
        </Link>
      );
    } else if (isInstructionsFolder(props)) {
      // if folder name is 'Ohjeluettelo', navigate to ohjeluettelo
      return (
        <Link to='/ava/Ohjeluettelo' title={ props.value }>
          { getBackButtonOrFolderOrFileIcon(props.value, props.data.onkohakemisto) }
          { props.value.replace('ava', '') }
        </Link>
      );
    } else if (!props.data.onkohakemisto) {
      return (
        <span
          className='ava-file-link'
          role='link'
          tabIndex='0'
          onClick={ () => fetchUrlAndOpenToNewTab(props.value) }
          title={ props.value }
        >
          { getBackButtonOrFolderOrFileIcon(props.value, props.data.onkohakemisto) }
          { getShortFileNameFromFullPath(props.value.replace('ava', '').replace('index.html', '')) }
        </span>
      );
    }
    return (
      <Link to={ `/${ props.value.substring(0, props.value.length - 1) || '' }` } title={ props.value }>
        { getBackButtonOrFolderOrFileIcon(props.value, props.data.onkohakemisto) }
        { getShortFolderNameFromFullPath(props.value.replace('ava', '')) }
      </Link>
    );
  };

  return <div className='data-wrapper'>{ GetLink() }</div>;
};

export default withRouter(Cell);