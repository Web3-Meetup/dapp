import useAccount from "~/hooks/useAccount";
import useWeb3 from "~/hooks/useWeb3";
import { ReactComponent as Logo } from "./logo.svg";

const Navbar = () => {
  const { connectionStatus } = useWeb3();
  const {address } = useAccount();
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <Logo width={69} height={41} />
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
        </div>

        {connectionStatus === "CONNECTED" && <div className="navbar-end">
          <div className="navbar-item">
              <strong>Account:</strong> {address}
          </div>
        </div>
        }
      </div>
    </nav>
  );
};

export default Navbar;
