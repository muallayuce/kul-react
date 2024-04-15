import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Logout = () => {
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
    debugger;
    setToken(null);
  };

    return (
      <div>
        {token && (
        <button className="button-flat" onClick={handleLogout}>
          Log Out
        </button>
      )}
      </div>
  );
};

export default Logout;
