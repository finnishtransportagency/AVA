import { config } from "../../../App";
export const getFileUrl = (fileName, isDev, currentUrl) => {
    //Fetching mocked api prefix and constructing url
    const prefix = "https://avatest.testivaylapilvi.fi";
    let baseUrl= `${prefix}${fileName}`;

    console.log("Constructed baseUrl " + baseUrl);

    //if prefix doesn't contain ending / in the domain (Mocking the situation in FileDownloadService
    if (!(baseUrl.split("/ava/").length - 1)) {
        console.log("domain split accordingly because of missing trailing slash in it")
        baseUrl = baseUrl.replace('ava/', '/ava/');
    }
    // For local development purposes use mocked prefix
    if (isDev) {
        console.log("Development mode true")
        console.log("URL : " + baseUrl);
        return window.open(baseUrl, '_blank');
    }

    const pathname = new URL(baseUrl).pathname;
    console.log("URL : " + `${currentUrl}${pathname}`);

    return window.open(`${currentUrl}${pathname}`, '_blank');
    }


