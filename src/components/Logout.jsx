import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Logout = ({ onLogout }) => { // Receive onLogout as a prop
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
    setToken(null);
    onLogout(); // Call the onLogout function passed via prop
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
