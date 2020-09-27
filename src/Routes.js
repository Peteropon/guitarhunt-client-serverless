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

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/auctions/new">
        <NewAuction />
      </Route>
      <Route exact path="/auctions/:id">
        <EditAuction />
      </Route>
      <Route exact path="/ongoing">
        <OngoingAuctions />
      </Route>
      <Route exact path="/settings">
        <Settings />
      </Route>
      <NotFound />
    </Switch>
  );
}
