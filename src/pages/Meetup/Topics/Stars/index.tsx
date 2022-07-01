interface Props {
  count: number;
}

const Stars = ({ count }: Props) => {
  return <>{Array.from(Array(count)).map((_, index) => <span key={index}>&#128525;</span>)}</>
};

export default Stars;
