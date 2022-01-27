import { useState } from "react";
import useMeetupContract from "~/hooks/useMeetupContract";
import { MAX_TOPICS_COUNT } from "~/utils/meetupContract";

const AddTopic = () => {
  const [topicMessage, setTopicMessage] = useState<string>("");
  const { topics, addTopic, isLoading } = useMeetupContract();

  const canSubmitANewTopic = topics.length < MAX_TOPICS_COUNT && !isLoading;

  return (
    <div className="card">
      <div className="card-content">
        <div className="content">
          <label className="label">
            Proponi un argomento o sostieni il meetup con un saluto!
          </label>
          <div className="content is-small mt-3">
            Il numero massimo di argomenti consentiti per questo meetup è{" "}
            <strong>{MAX_TOPICS_COUNT}</strong>, restano ancora{" "}
            <strong>{MAX_TOPICS_COUNT - topics.length}</strong> argomenti
            disponibili.<br /> Il costo per questa operazione è di <strong>0.5 Matic</strong>
          </div>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                disabled={!canSubmitANewTopic}
                className="input"
                type="text"
                placeholder="es: Vorrei parlare di Luna"
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
                Invia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTopic;
