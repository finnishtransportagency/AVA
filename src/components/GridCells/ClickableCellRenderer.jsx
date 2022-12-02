import React from 'react';
import { withRouter, Link, useParams } from 'react-router-dom';
import { config } from '../../App';
import { useTranslation } from 'react-i18next';
import { getParentPath } from '../../helpers';
import { useFoldersData } from "../../hooks/useFoldersData";
import { getShortFileNameFromFullPath, getShortFolderNameFromFullPath } from "../../service/FileNameService";

export const Cell = props => {
  const indexHTML = useFoldersData(props);
  const { t } = useTranslation();

  // check index.htm. Must be under next folder not futher
  //if (indexHTML !== null) {
  if (indexHTML !== null && indexHTML.includes(props.value + 'index.htm') ) {
    return (
      <a href={indexHTML} target='_blank' rel='noreferrer'>
        <i
          className='fas fa-file ava-list-icon'
          role='img'
          aria-label={t('file')}
        />
        {props.value.replace('ava','')}
      </a>
    );
  }

  return <ClickableCellRenderer {...props} />;
};

const ClickableCellRenderer = props => {
  const { folder } = useParams();
  // get URL and retrieve asset from S3
  // TODO: how is the link delivered?
  const fetchFile = () => {
    fetch(`${config.apiUrlFolders}${props.value || config.defaultFolder}`, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(({ url }) => {
        if (!url) {
          throw Error('URL missing from response');
        }

        // Dirty fix until the backend is fixed
        if (!url.split('/ava/').length - 1) {
          const fixedUrl = url.replace('ava/', '/ava/');
          //return window.location.assign(fixedUrl);
          return window.open(fixedUrl, '_blank');
        }

        window.location.assign(url);
      })
      .catch(console.error);
  };

  const GetIcon = () => {
    const { t } = useTranslation();
    if (props.value === 'BackToParent') {
      return <i className='fas fa-arrow-left ava-list-icon' role='img' />;
    } else if (props.data.onkohakemisto) {
      return (
        <i
          className='fas fa-folder-open ava-list-icon'
          role='img'
          aria-label={t('folder')}
        />
      );
    }
    return (
      <i
        className='fas fa-file ava-list-icon'
        role='img'
        aria-label={t('file')}
      />
    );
  };

  const GetBaseIcon = (value) => {
    const { t } = useTranslation();
    if (props.value === 'BackToParent') {
      return <i className='fas fa-arrow-left ava-list-icon' role='img' />;
    } else if (props.data.onkohakemisto) {
      return (
        <i
          className='fas fa-folder-open ava-list-icon'
          role='img'
          aria-label={t('folder')}
        />
      );
    }
    return (
      <i
        className='fas fa-file ava-list-icon'
        role='img'
        aria-label={t('file')}
      />
    );
  };


  const GetLink = () => {
    const { t } = useTranslation();
    const parentPath = getParentPath(folder);

    if (props.value === 'BackToParent') {
      return (
        <Link to={parentPath || '/'} title={t('back')}>
          {GetIcon()} {t('back')}
        </Link>
      );
    } else if (
      typeof props.value === 'string' &&
      props.value.toLowerCase().indexOf('Ohjeluettelo') >= 0
    ) {
      // if folder name is 'Ohjeluettelo', navigate to ohjeluettelo
      return (
        <Link to='/ava/Ohjeluettelo' title={props.value}>
          {GetIcon()}
          {props.value.replace('ava','')}
        </Link>
      );
    } else if (!props.data.onkohakemisto) {
      return (
        <span
          className='ava-file-link'
          role='link'
          tabIndex='0'
          onClick={fetchFile}
          title={props.value}
        >
          {GetIcon()}
          {getShortFileNameFromFullPath(props.value.replace('ava','').replace('index.html',''))}
        </span>

      );
    }
    return (
      <Link to={`/${props.value.substring(0, props.value.length - 1) || ''}`} title={props.value}>
        {GetIcon()}
        {getShortFolderNameFromFullPath(props.value.replace('ava',''))}
      </Link>
    );
  };

  return <div className='data-wrapper'>{GetLink()}</div>;
};

export default withRouter(Cell);