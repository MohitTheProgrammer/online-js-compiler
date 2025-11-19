import "./styles/userAvtar.css"

const UserAvtar = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="user">
      <div className="avatar">{initial}</div>
      <span className="username">{name}</span>
    </div>
  );
};

export default UserAvtar;
