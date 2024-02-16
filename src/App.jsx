import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './components/Layouts/Footer';
import FoldersContainer from './components/FoldersContainer';
import Instructions from './components/notUsed/InstructionList/Instructions';
import './App.scss';
import { env } from './env'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const config = {
  defaultFolder: 'ava',
  //defaultFolder: '',
  apiUrlFolders:
    env.REACT_APP_FOLDERS_URL ||
    'https://apiavatest.testivaylapilvi.fi/v2/ava/hakemisto/', // dev-mock
  tagsApiUrl:
    env.REACT_APP_TAGS_URL || '',
  rowsPerPage: 30,
  mobileMaxClientWidth: 1400,
  apiUrlInstructions:
    env.REACT_APP_INST_URL ||
    'https://apiavatest.testivaylapilvi.fi/v2/ava/ohjeluettelo',
  instructionsBaseUrl: 
    env.REACT_APP_S3_OHJEET_ENDPOINT ||
    'https://apiavatest.testivaylapilvi.fi/v2/ava/ava/Ohjeluettelo/',
  codeVersion: env.REACT_APP_CODE_VERSION || ''
};


const App = () => {
  return (
    <Router>
      <Switch>
        <Route path='/:folder*/'>
          <FoldersContainer />
        </Route>
      </Switch>
      <ToastContainer />
      <Footer />
    </Router>
  );
};

export default App;
