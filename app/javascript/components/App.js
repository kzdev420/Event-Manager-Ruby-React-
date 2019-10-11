import React from 'react';
import { Route } from 'react-router-dom';

import './App.css'
import Editor from './Editor';
import { Alert } from '../helpers/notifications';

const App = () => (
    <div>
        <Route path="/events/:id?" component = { Editor }/>
        <Alert stack = { { limit: 3 } } />
    </div>
);

export default App;