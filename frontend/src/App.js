import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Header from "./components/layouts/Header";
import ImageGrid from "./components/pages/ImageGrid";
import Contributors from "./components/pages/Contributors";
import ScrollToTopButton from "./components/layouts/ScrollToTopButton";
import Page404 from "./components/pages/Page404";

function App() {
  const [showFormModal, setshowFormModal] = useState(false);

  return (
    <Router>
      <div className="App">
        {/* Header */}
        <Header
          showFormModal={showFormModal}
          setshowFormModal={setshowFormModal}
        />
        <ScrollToTopButton scrollStepInPx="50" delayInMs="2" />
        <Switch>
          <Route path="/" exact component={ImageGrid} />
          <Route path="/contributors" component={Contributors} />
          <Route path="" component={Page404} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
