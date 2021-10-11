import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//Component
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/layout/profile-forms/CreateProfile';
import EditProfile from './components/layout/profile-forms/EditProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import ListProfile from './components/ListProfile/ListProfile';
import Profile from './components/profile/Profile';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import AddExperience from './components/layout/profile-forms/AddExperience';
import AddEducation from './components/layout/profile-forms/AddEducation';



if (localStorage.token) {
  setAuthToken(localStorage.token);
}


const App = () => {
  //if state updates it will keep running in constant loop
  useEffect(() => {
    store.dispatch(loadUser());
  }//,[] if want to run once
  )

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />

          <section className="container">
            <Alert />
            <Switch>
              {/* Switch itu digunain biar kalo misalnya pathnya /abe yang lain dengan path sebelum sama bakal ke render kaya /abe/login */}
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profiles" component={ListProfile} />
              <Route exact path="/profile/:id" component={Profile} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />
              <PrivateRoute exact path="/add-experience" component={AddExperience} />
              <PrivateRoute exact path="/add-education" component={AddEducation} />
            </Switch>
          </section>

        </Fragment>
      </Router>
    </Provider>
  )
};



export default App;
