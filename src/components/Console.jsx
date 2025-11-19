import "./styles/console.css";

const Console = ({ data }) => {
  return (
    <div className={`console-container ${data.error ? "error" : ""}`}>
      {data.logs.length
        ? data.logs.map((val, i) => <p key={i}>{val}</p>)
        : "Console"}
    </div>
  );
};

export default Console;