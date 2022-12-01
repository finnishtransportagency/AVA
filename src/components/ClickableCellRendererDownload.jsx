import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getShortFileNameFromFullPath } from "../service/FileNameService";
import { getCurrentUrl } from "../service/UrlService";
import PropTypes from 'prop-types';
import { useFoldersData } from "../hooks/useFoldersData";

function isRootFolderOrBackButton(isFolder, fileName) {
  return isFolder || fileName === 'BackToParent';
}

const getDownloadButton = (params, t) => {

  const {
    tiedosto: fileName,
    onkohakemisto: isFolder,
  } = params

  if (isRootFolderOrBackButton(isFolder, fileName)) {
    return ''
  }

  let shortFileName = ''
  if (fileName !== '') {
    shortFileName = getShortFileNameFromFullPath(fileName);
  }

  let fileHref = `${getCurrentUrl()}/${fileName}`

  return <a href={ fileHref} download={shortFileName}> {t('download_file')} </a>;
}

export const Cell = props => {
  const indexHTML = useFoldersData(props);

  if (indexHTML !== null) {
    return (
      <span tabIndex='0' title={props.value}>
        -
      </span>
    );
  }

  return <ClickableCellRendererDownload {...props} />;
};

const ClickableCellRendererDownload = props => {
  const { t } = useTranslation();

  const DownloadButton = () => {
    if (props.value === 'BackToParent') {
      return ('');
    } else if (!props.data.onkohakemisto) {
      return (
        <span tabIndex='0' title={props.value}>
          {getDownloadButton(props.data, t)}
        </span>
      );
    }

    return (
      <span tabIndex='0' title={props.value}>
        {getDownloadButton(props.data, t)}
      </span>
    );
  };

  return <div className='data-wrapper'>{DownloadButton()}</div>;
};

ClickableCellRendererDownload.propTypes = {
    data: PropTypes.shape({
      tiedosto: PropTypes.string,
      size: PropTypes.any,
      lastmodified: PropTypes.string,
      onkohakemisto: PropTypes.bool
    }),
}

getDownloadButton.propTypes = {
    params: PropTypes.shape({
      tiedosto: PropTypes.string,
      size: PropTypes.any,
      lastmodified: PropTypes.string,
      onkohakemisto: PropTypes.bool
    }),
}

export default withRouter(Cell);