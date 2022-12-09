import { useTranslation } from "react-i18next";
import { config } from "../App";
import { useEffect, useState } from "react";

export const useGridRowData = folder => {
  const [rowData, setRowData] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    fetch(`${ config.apiUrlFolders }${ folder || config.defaultFolder }/`)
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
  }, [ folder, t ]);

  return {
    rowData,
    setRowData,
    fetchError,
    setFetchError
  }
};