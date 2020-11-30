import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewGuitar from "./containers/NewGuitar";
import EditGuitar from "./containers/EditGuitar";
import Settings from "./containers/Settings";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import MyGuitars from "./containers/MyGuitars";
import ResetPassword from "./containers/ResetPassword";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/login/reset">
        <ResetPassword />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/newguitar">
        <NewGuitar />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/myguitars">
        <MyGuitars />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/guitars/:id">
        <EditGuitar />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/settings">
        <Settings />
      </AuthenticatedRoute>
      <NotFound />
    </Switch>
  );
}
