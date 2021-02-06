import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Header from "./components/layouts/Header";
import ImageGrid from "./components/layouts/ImageGrid";
import Contributors from "./components/layouts/Contributors";

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
        <Switch>
          <Route path="/" exact component={ImageGrid} />
          <Route path="/contributors" component={Contributors} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
