import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import LeafletMap from './Components/LeafletMap'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <LeafletMap />,
    document.getElementById('root'));
registerServiceWorker();
