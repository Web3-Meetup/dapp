import cn from "classnames/bind";
import useAccount from "~/hooks/useAccount";
import useMeetupContract from "~/hooks/useMeetupContract";
import styles from "./index.module.scss";
import Stars from "./Stars";

const cx = cn.bind(styles);

const Topics = () => {
  const { topics, likeTopic, isLoading } = useMeetupContract();
  const { address } = useAccount();

  // sort topics with the one proposed by current user first and then the others ordered by number of likes
  const sortedTopics = topics.map((topic, index) => ({...topic, index })).sort((topicA, topicB) =>
    (topicA.likes < topicB.likes && topicA.user !== address) ? 1 : -1
  );

  return (
    <div className="content">
      {isLoading ? (
        <p>In attesa...</p>
      ) : (
        <div>
          {sortedTopics?.map((topic) => (
            <article className={cx("message",{"is-success": address !== topic.user, "is-link": address === topic.user})} key={topic.index}>
              <div className="message-body">
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <div>
                        {topic.message}
                        <small className={cx("topic_user", "has-text-dark")}>
                          ({topic.user})
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <Stars count={topic.likes} />
                      <button
                        disabled={address === topic.user}
                        className="button is-small ml-3"
                        onClick={() => likeTopic(topic.index)}
                      >
                        Like
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {sortedTopics.length === 0 && <div>Nessun argomento inserito</div>}
        </div>
      )}
    </div>
  );
};

export default Topics;
