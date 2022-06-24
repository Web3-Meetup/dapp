import Navbar from "~/components/Navbar";
import Topics from "./Topics";
import AddTopic from "./AddTopic";
import useMeetupContract from "~/hooks/useMeetupContract";
import useAccount from "~/hooks/useAccount";
import { fromWei } from "web3-utils";
import { useEffect } from "react";
import { useGetMeetupByIdQuery } from "~/services/meetup";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import Loading from "../Loading";
import { formatDate } from "~/utils/date";
import Markdown from "markdown-to-jsx";

const Content = () => {
  // es: VugnTotPu_FVnqMidcLZyqmgp1kK-YIN3LodmM430UQ
  const { meetupId } = useParams();

  const { data } = useGetMeetupByIdQuery(meetupId || skipToken);

  const { organizers, balance, error, withdrawBalance } = useMeetupContract({
    contractAddress: data?.smartcontractAddress,
  });

  const { address } = useAccount();

  const isAnOrganizer = address && organizers.includes(address);

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      {error && <div className="notification is-danger">{error}</div>}
      {isAnOrganizer && (
        <div className="notification is-success">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <p className="subtitle is-5">
                  Welcome <strong>Organizer</strong>!
                </p>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <strong className="is-size-3">{fromWei(balance.toString(), "ether")}</strong> MATIC
              </div>
              <div className="level-item">
                <button className="button ml-3" onClick={withdrawBalance}>
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Navbar />
      <div className="container mt-6">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title is-1">{data.title}</h1>
            </div>
          </div>
        </div>

        <h2 className="subtitle">
          Organization:{" "}
          <span className="is-underlined">L'occhio di Horus DAO</span>
        </h2>
        <div className="content is-large">
          <div>
            <strong>Date:</strong> {formatDate(data.date, "PPPP")}
          </div>
          <div>
            <strong>Time:</strong> {formatDate(data.date, "p")}
          </div>
          <div>
            <strong>Attenders:</strong> TBD
          </div>
        </div>
        <p className="mt-2">
          <Markdown>{data.desc}</Markdown>
        </p>
        <div className="columns mt-6">
          <div className="column is-three-fifths">
            <Topics meetupId={meetupId} />
          </div>
          <div className="column">
            <AddTopic meetupId={meetupId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
