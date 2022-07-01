import Navbar from "~/components/Navbar";
import { useGetMeetupsQuery } from "~/services/meetup"

export const Home = () => {
  const { data } = useGetMeetupsQuery();
  return (
    <>
    <Navbar />
    <main style={{ padding: "1rem" }}>
      {data?.map((meetup) => (
        <article className="message is-dark">
        <div className="message-body">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
              {meetup.title}
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <a href={`/${meetup.id}`}>
                View
                </a>
              </div>
            </div>
          </div>
        
        </div>
      </article>
      ))}
    </main>
    </>
  )
}