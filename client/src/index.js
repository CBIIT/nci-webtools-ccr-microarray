import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { unregister } from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

unregister();
