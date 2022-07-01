import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useState } from "react";
import useMeetupContract from "~/hooks/useMeetupContract";
import { useGetMeetupByIdQuery } from "~/services/meetup";
import { MAX_TOPICS_COUNT } from "~/utils/meetupContract";

interface Props {
  meetupId?: string;
}
const AddTopic = ({ meetupId }: Props) => {
  const [topicMessage, setTopicMessage] = useState<string>("");
  const { data } = useGetMeetupByIdQuery(meetupId || skipToken);
  const { topics, addTopic, isLoading } = useMeetupContract({
    contractAddress: data?.smartcontractAddress,
  });

  const canSubmitANewTopic = topics.length < MAX_TOPICS_COUNT && !isLoading;

  return (
    <div className="card">
      <div className="card-content">
        <div className="content">
          <label className="label">Do you want to ask something?</label>
          <div className="content is-small mt-3">
            The total number of questions for this meetup is{" "}
            <strong>{MAX_TOPICS_COUNT}</strong>, there are only{" "}
            <strong>{MAX_TOPICS_COUNT - topics.length}</strong> questions
            available.
            <br /> You need to pay for each question <strong>0.5 Matic</strong>
          </div>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                disabled={!canSubmitANewTopic}
                className="input"
                type="text"
                placeholder="es: I'd like to know what do you think about.."
                value={topicMessage}
                onChange={(e) => setTopicMessage(e.currentTarget.value)}
              />
            </div>
            <div className="control">
              <button
                disabled={!canSubmitANewTopic}
                type="button"
                className="button is-primary"
                onClick={() => addTopic(topicMessage)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTopic;
