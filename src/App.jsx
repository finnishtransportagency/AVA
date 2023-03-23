import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './components/Layouts/Footer';
import FoldersContainer from './components/FoldersContainer';
import Instructions from './components/InstructionList/Instructions';
import './App.scss';
import { env } from './env'

export const config = {
  defaultFolder: 'ava',
  //defaultFolder: '',
  apiUrlFolders:
    env.REACT_APP_FOLDERS_URL ||
    'https://ij1cvn8w2k.execute-api.eu-west-1.amazonaws.com/dev/tiedostot/', // dev-mock
  rowsPerPage: 30,
  mobileMaxClientWidth: 1400,
  apiUrlInstructions:
    env.REACT_APP_INST_URL ||
    'https://devapi.testivaylapilvi.fi/ava/ohjeluettelo',
  instructionsBaseUrl: 
    env.REACT_APP_S3_OHJEET_ENDPOINT ||
    'https://d3dqafoph52mqj.cloudfront.net/ava/Ohjeluettelo/',
  codeVersion: env.REACT_APP_CODE_VERSION || ''
};


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/ava/Ohjeluettelo'>
          <Instructions />
        </Route>
        <Route path='/:folder*/'>
          <FoldersContainer />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
