import { getFileUrl } from '../utils/FileURLUtil'; // Replace with actual utility functions

// Mock the window.location.assign and window.open functions
window.open = jest.fn();

describe('AVAPALJU-256: Changing/Not changing the domain accordingly when fetching file url', () => {
    it('Should return a URL for the file with domain unchanged', () => {
        // Mock the isDev function to return false
        const fileName = 'ava/somepath';
        const isDev = false;
        const url = "https://ainestot.testivaylapilvi.fi";

        getFileUrl(fileName, isDev, url);

        // Expect that window.open was called with the modified URL using getCurrentUrl
        expect(window.open).toHaveBeenCalledWith('https://ainestot.testivaylapilvi.fi/ava/somepath', '_blank');
    });

    it('Should return a URL for the file with domain changed because of developoment mode', () => {
        // Mock the isDev function to return false
        const fileName = 'ava/somepath';
        const isDev = true;
        const url = "http://localhost:3000";

        getFileUrl(fileName, isDev, url);

        // Expect that window.open was called with the modified URL using getCurrentUrl
        expect(window.open).toHaveBeenCalledWith('https://avatest.testivaylapilvi.fi/ava/somepath', '_blank');
    });
});