import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ClubPage from './pages/Club';
import ClubCommittee from './pages/ClubCommittee';
import Clubs from './pages/Clubs';
import Home from './pages/Home';
import Login from './pages/Login';
import ManageClub from './pages/ManageClub';
import Register from './pages/Register';
import RegisterClub from './pages/RegisterClub';

const Router = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="/clubs" exact component={Clubs} />
      <Route path="/club/:id" exact component={ClubPage} />
      <Route path="/clubs/register" exact component={RegisterClub} />
      <Route path="/clubs/manage/:clubId" exact component={ManageClub} />
      <Route
        path="/clubs/manage/:clubId/committee"
        exact
        component={ClubCommittee}
      />
    </Switch>
  );
};

export default Router;
