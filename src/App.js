import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Loadable from 'react-loadable';
import Container from './views/Container';
import Home from './views/home';

import './App.css';
import './assets/fonts/iconfont.css';

const Loading = ({ isLoading, error }) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle the error state
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  }

  else {
    return null;
  }
};

const Trade = Loadable({
  loader: () => import("./views/trade"),
  loading: Loading
});

const Signin = Loadable({
  loader: () => import("./views/signin"),
  loading: Loading
});

const Register = Loadable({
  loader: () => import("./views/register"),
  loading: Loading
});

const Reset = Loadable({
  loader: () => import("./views/reset"),
  loading: Loading
});

const ResetPassword = Loadable({
  loader: () => import("./views/reset/Password"),
  loading: Loading
});

const User = Loadable({
  loader: () => import("./views/user"),
  loading: Loading
});

const Authentication = Loadable({
  loader: () => import("./views/authentication"),
  loading: Loading
});

const C2c = Loadable({
  loader: () => import("./views/c2c"),
  loading: Loading
});

const App = () => (
  <Router>
    <Container>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/trade" component={Trade} />
        <Route path="/signin" component={Signin} />
        <Route path="/register" component={Register} />
        <Route path="/reset" component={Reset} />
        <Route path="/resetPassword" component={ResetPassword} />
        <Route path="/user" component={User} />
        <Route path="/authentication" component={Authentication} />
        <Route path="/c2c" component={C2c} />
      </Switch>
    </Container>
  </Router>
);

export default App;