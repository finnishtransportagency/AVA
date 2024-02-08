import { useTranslation } from "react-i18next";
import { config } from "../App";
import { useEffect, useState } from "react";
import axios from "axios";

export const useGridRowData = folder => {
  const [rowData, setRowData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const { t } = useTranslation();
    useEffect(() => {
        // Start both requests simultaneously
        Promise.all([
            axios.get(`${config.apiUrlFolders}${folder || config.defaultFolder}/`, { withCredentials: false }),
            axios.get(`${config.tagsApiUrl}/v2/tags/public/tag/crud`)
        ])
            .then(([folderResponse, tagsResponse]) => {
                const folderData = folderResponse.data;
                const tagsData = tagsResponse.data;
                
                // If folder data is available, process it with the tags data
                if (folderData.aineisto) {
                    folderData.aineisto.forEach(row => {
                        row.tags = {};
                        const tagData = tagsData.find(tag => tag.fileName === row.tiedosto);
                        if (tagData) {
                            row.tags = tagData;
                        }
                    });
                    // Set the processed data
                    setRowData(folderData.aineisto);
                } else {
                    // Handle malformed response
                    throw Error('Malformed response');
                }
            })
            .catch(error => {
                // Handle any error from either request
                console.error(error);
                setFetchError(true);
                setRowData([]);
            });
    }, [folder, t]);

  return {
    rowData,
    setRowData,
    fetchError,
    setFetchError
  }
};