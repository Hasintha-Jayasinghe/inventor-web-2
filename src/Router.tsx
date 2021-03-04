import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ClubPage from './pages/Club';
import Clubs from './pages/Clubs';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const Router = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="/clubs" exact component={Clubs} />
      <Route path="/club/:id" exact component={ClubPage} />
    </Switch>
  );
};

export default Router;
