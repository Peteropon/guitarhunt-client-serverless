import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewAuction from "./containers/NewAuction";
import OngoingAuctions from "./containers/OngoingAuctions";
import EditAuction from "./containers/EditAuction";
import Settings from "./containers/Settings";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/auctions/new">
        <NewAuction />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/auctions/:id">
        <EditAuction />
      </AuthenticatedRoute>
      <UnauthenticatedRoute exact path="/ongoing">
        <OngoingAuctions />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/settings">
        <Settings />
      </AuthenticatedRoute>
      <NotFound />
    </Switch>
  );
}
