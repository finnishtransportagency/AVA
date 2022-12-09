import React, { Fragment } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FoldersList from './Grid/FoldersList';
import Header from './Layouts/Header';
import Breadcrumb from './Breadcrumb';
import { useTitle } from "../hooks/useTitle";
import { useGridRowData } from "../hooks/useGridRowData";

const FoldersContainer = () => {
  let { folder } = useParams();
  const { t } = useTranslation();
  const title = useTitle(folder);
  const { rowData, fetchError } = useGridRowData(folder);

  return (
    <Fragment>
      <Header/>
      <div className='page-wrapper'>
        <div className='content-area'>
          <h1 tabIndex='-1' id='content'>
            { title }
          </h1>
          <p tabIndex='-1'>
            { t('about_open_data') }:{ ' ' }
            <a
              tabIndex='0'
              href='http://vayla.fi/avoindata'
              target='_blank'
              rel='noreferrer'
            >
              { t('about_open_data_url') }
            </a>
          </p>
          <p tabIndex='-1'>
            { t('about_open_contact_text') }:{ ' ' }
            <a
              tabIndex='0'
              href={ `mailto:${ t('about_open_contact_email') }` }
              rel='noreferrer'
            >
              { t('about_open_contact_email') }
            </a>
          </p>
        </div>
        <Breadcrumb/>
      </div>
      <FoldersList rowData={ rowData } fetchError={ fetchError }/>
    </Fragment>
  );
};

export default withRouter(FoldersContainer);
