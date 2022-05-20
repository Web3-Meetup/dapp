import Navbar from "~/components/Navbar";
import Topics from "./Topics";
import AddTopic from "./AddTopic";
import useMeetupContract from "~/hooks/useMeetupContract";
import useAccount from "~/hooks/useAccount";
import { fromWei } from "web3-utils";
import { useEffect } from "react";

const Content = () => {
  const { init, organizers, balance, error, withdrawBalance } =
    useMeetupContract();
  const { address } = useAccount();

  useEffect(() => {
    init();
  },[init])

  const isAnOrganizer = address && organizers.includes(address);
  return (
    <>
      { error && <div className="notification is-danger">{error}</div> }
      <Navbar />
      <div className="container mt-6">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title is-1">Cryptocose Meetup</h1>
            </div>
          </div>
          {isAnOrganizer && (
            <div className="level-right">
              <div className="level-item">
                <strong>{fromWei(balance.toString(), "ether")} MATIC</strong>
              </div>
              <div className="level-item">
                <button
                  className="button is-success ml-3"
                  onClick={withdrawBalance}
                >
                  Rimborsa organizzatori
                </button>
              </div>
            </div>
          )}
        </div>

        <h2 className="subtitle">
          Organizzatore:{" "}
          <span className="is-underlined">L'occhio di Horus DAO</span>
        </h2>
        <div className="content is-large">
          <div>
            <strong>Data:</strong> 15 Aprile 2022
          </div>
          <div>
            <strong>Ora:</strong> 18:00
          </div>
          <div>
            <strong>Partecipanti:</strong> 12
          </div>
        </div>
        <p className="mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae
          enim euismod, posuere lacus nec, ultrices nisl. Etiam metus odio,
          cursus sed accumsan vel, sagittis rhoncus ex. Sed non varius nulla.
          Duis quis consequat ante, ut semper tortor. Phasellus in ultricies
          nulla, vel posuere enim. Maecenas sagittis lobortis venenatis. Donec
          et gravida turpis. Donec tempor nisi eget sem faucibus sagittis.
          Pellentesque lobortis diam et enim rhoncus maximus. Pellentesque ut
          erat imperdiet, malesuada augue eget, laoreet diam.
        </p>
        <div className="columns mt-6">
          <div className="column is-three-fifths">
            <Topics />
          </div>
          <div className="column">
            <AddTopic />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
