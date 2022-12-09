import { useEffect, useState } from "react";
import { config } from "../App";
import PropTypes from 'prop-types';

/**
 * @typedef {Object} aineisto
 * @property {String} tiedosto     - filepath.
 * @property {String} lastmodified - timestamp. Example (2022-09-14T11:20:23.000Z)
 * @property {Boolean} onkohakemisto - timestamp. Example (2022-09-14T11:20:23.000Z)
 */

/**
 *
 * @returns {aineisto[]}
 */
export const useFoldersData = props => {
  const [ indexHTML, setIndexHTML ] = useState(null);
  useEffect(() => {

    if (!props.value || props.data.value === 'BackToParent' || props.data.value === undefined) {
      return
    }

    fetch(`${ config.apiUrlFolders }/${ props.data.value }`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
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