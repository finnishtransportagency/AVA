import { useTranslation } from "react-i18next";
import { config } from "../App";
import { useEffect, useState } from "react";
import axios from "axios";

export const useGridRowData = folder => {
    const [rowData, setRowData] = useState(null);
    const [fetchError, setFetchError] = useState(false);
    const {t} = useTranslation();
    useEffect(() => {
        // Start both requests simultaneously
        Promise.all([
            axios.get(`${ config.apiUrlFolders }${ folder || config.defaultFolder }/`, {withCredentials: false}),
            axios.get(`${ config.tagsApiUrl }/v2/tags/public/tag/crud`).catch(error => {
                console.error("Failed to fetch tags:", error);
                return null; // Return null value indicating the request failed
            })
        ])
            .then(([folderResponse, tagsResponse]) => {
                const folderData = folderResponse.data;
                
                // If folder data is available, process it with the tags data
                if (folderData.aineisto) {
                    folderData.aineisto.forEach(row => {
                        row.tags = {};
                        // Process tags data only if it's available
                        if (tagsResponse) {
                            const tagsData = tagsResponse.data;
                            const tagData = tagsData.find(tag => tag.fileName === row.tiedosto);
                            if (tagData) {
                                row.tags = tagData;
                            }
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