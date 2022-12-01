import { useEffect, useState } from "react";
import { config } from "../App";
import PropTypes from 'prop-types';

export const useFoldersData = props => {
  const [ indexHTML, setIndexHTML ] = useState(null);

  useEffect(() => {
    fetch(`${ config.apiUrlFolders }/${ props.value }`)
      .then(res => res.json())
      .then(data => {
        const index = data?.aineisto?.find(row =>
          row.tiedosto.includes('index.html')
        );

        if (!index) {
          return;
        }

        fetch(`${ config.apiUrlFolders }/${ index.tiedosto }`)
          .then(res => res.json())
          .then(data => setIndexHTML(data.url))
      });
  }, [ indexHTML, props ]);
  return indexHTML;
};

useFoldersData.propTypes = {
  props: PropTypes.shape({
    value: PropTypes.string
  }),
}