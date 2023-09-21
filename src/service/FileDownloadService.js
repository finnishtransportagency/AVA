import { config } from "../App";
import { getCurrentUrl } from "./UrlService";
import {isDev} from "./EnvService";

// get URL and retrieve asset from S3
// TODO: how is the link delivered?
export const fetchUrlAndOpenToNewTab = (fileName) => {
  fetch(`${config.apiUrlFolders}${fileName || config.defaultFolder}`, {
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
        // For local development purposes fetch URL from config.apiUrlFolders
        if (isDev()) {
            //return window.location.assign(fixedUrl);
            return window.open(fixedUrl, '_blank');
        }

        const pathname = new URL(fixedUrl).pathname;
        return window.open(`${getCurrentUrl()}${pathname}`, '_blank');
      }

      window.location.assign(url);
    })
    .catch(console.error);
};