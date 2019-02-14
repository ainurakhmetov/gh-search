import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import TopicPage from './pages/TopicPage';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={SearchPage} exact />
      <Route path="/:topic" component={TopicPage} />
    </Switch>
  </BrowserRouter>
);

export default App;
