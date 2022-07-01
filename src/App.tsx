import React from "react";
import "./App.scss";
import Meetup from "~/pages/Meetup";
import Loading from "~/components/Loading";
import useWeb3 from "./hooks/useWeb3";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";

function App() {
  const { isMetamaskAvailable, connectionStatus, connectToChain } = useWeb3();
 
  if (!isMetamaskAvailable) {
    return (
      <div className="notification is-danger">
        You need to install Metamask wallet to access this dApp
      </div>
    );
  }

  return (
    <div className="App">
      {connectionStatus === "WRONG_CHAIN" && 
        <div className="notification is-danger">
          You need to connect to Polygon to use this dApp
        </div>
      }
      
      {(connectionStatus === "NOT_CONNECTED" || connectionStatus === "WRONG_CHAIN")  && (
        <button className="button is-primary is-large centered" onClick={connectToChain}>
          Connect with Polygon
        </button>
      )}
      {connectionStatus === "PENDING" && <Loading />}
      {connectionStatus === "CONNECTED" && <Routes>
          <Route path=":meetupId" element={<Meetup />} />
          <Route
            path="*"
            element={
              <Home />
            }
          />
        </Routes>}
    </div>
  );
}

export default App;
