import React, { Fragment, useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FoldersList from './FoldersList';
import { config } from '../App';
import Header from './Header';
import Breadcrumb from './Breadcrumb';

const FoldersContainer = () => {
  let { folder } = useParams();
  const [rowData, setRowData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const { t } = useTranslation();
  const [title, setTitle] = useState('');

  useEffect(() => {
    var title = `${folder ?? t('heading')}`;
    if(title === 'ava') {
      title = `${t('heading')}`;
    }
    title = title.replace('ava','');

    document.title = title;

    setTitle(title);
    fetch(`${config.apiUrlFolders}${folder || config.defaultFolder}/`)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(jsonRes => {
        if (jsonRes.aineisto) {
          setRowData(jsonRes.aineisto);
        } else {
          throw Error('Malformed response');
        }
      })
      .catch(error => {
        console.log(error);
        setFetchError(true);
        setRowData([]);
      });
  }, [folder, t]);

  return (
    <Fragment>
      <Header />
      <div className='page-wrapper'>
        <div className='content-area'>
          <h1 tabIndex='-1' id='content'>
            {title}
          </h1>
          <p tabIndex='-1'>
            {t('about_open_data')}:{' '}
            <a
              tabIndex='0'
              href='http://vayla.fi/avoindata'
              target='_blank'
              rel='noreferrer'
            >
              {t('about_open_data_url')}
            </a>
          </p>
          <p tabIndex='-1'>
            {t('about_open_contact_text')}:{' '}
            <a
              tabIndex='0'
              href={`mailto:${t('about_open_contact_email')}`}
              rel='noreferrer'
            >
              {t('about_open_contact_email')}
            </a>
          </p>
        </div>
        <Breadcrumb />
      </div>
      <FoldersList rowData={rowData} fetchError={fetchError} />
    </Fragment>
  );
};

export default withRouter(FoldersContainer);
