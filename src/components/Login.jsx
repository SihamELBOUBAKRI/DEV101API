import React, { useState } from "react";
import axios from "axios";
import List from "./List";

const Login = ({ setIsConected }) => {
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({});
  const [response, setResponse] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const StoreData = async () => {
    try {
      const resp = await axios.post("https://notes.devlop.tech/api/login", {
        cin,
        password,
      });
      console.log("Login Response:", resp); // Log the entire response
      console.log("Token:", resp.data.token);

      if (resp.status === 200) {
        const token = resp.data.token; // Assuming the API returns a `token` field
        localStorage.setItem("token", token); // Save the token in localStorage
        setData({ cin, password });
        setIsConected(true);
        setIsLoggedIn(true); // Update the state to show the List component
      } else {
        console.log("Login failed");
      }
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setData({});
    setIsConected(false);
    setIsLoggedIn(false); // Reset the state to show the login form
  };

  return (
    <div>
      {!isLoggedIn ? (
        <form method="post" onSubmit={(e) => e.preventDefault()}>
          <label>cin:</label>
          <input
            type="text"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit" onClick={StoreData}>
            Login
          </button>
        </form>
      ) : (
        <div>
          <p>Welcome, {response.data.user.first_name}</p>
          <button onClick={logout}>Logout</button>
          {/* Pass the token to the List component */}
          <List token={localStorage.getItem("token")} />
        </div>
      )}
    </div>
  );
};

export default Login;
