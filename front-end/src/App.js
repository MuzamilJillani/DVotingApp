import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarTop from "./Navbar";
import CreateVote from "./CreateVote";
import Votes from "./Votes";
import { useState, useEffect } from "react";
import { connect, getContract } from "./connect";

function App() {
  const [connected, setConnected] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) {
        handleInit();
      } else setConnected(false);
    });
  }, []);

  const handleInit = () => {
    setConnected(true);
    getContract().then(({ signer, contract }) => {
      if (contract) {
        signer.getAddress().then((address) => {
          contract.members(address).then((result) => setIsMember(result));
        });
      }
      setContract(contract);
    });
  };

  const connectCallback = async () => {
    const { contract } = await connect();
    setContract(contract);
    console.log(contract);
    if (contract) {
      setConnected(true);
    }
  };

  const becomeMember = async () => {
    if (!contract) {
      alert("please connect to metamask");
    }

    await contract
      .join()
      .then(() => {
        alert("joined");
        setIsMember(true);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <Router>
      <NavbarTop
        connect={connectCallback}
        connected={connected}
        isMember={isMember}
        becomeMember={becomeMember}
      />
      <div className="container">
        <Routes>
          <Route path="votes" element={<Votes contract={contract} />} />
          <Route
            path="create-vote"
            element={<CreateVote contract={contract} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
