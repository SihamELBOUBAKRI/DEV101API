import React, { useState } from "react";
import axios from "axios";
import List from "./List";

const Login = () => {
  const [cin,setcin]=useState("");
  const [password,setpassword]=useState("");
  const [userloged,setuserloged]=useState(false);
  const [token,settoken]=useState("");
  const [userInfo,setuserInfo]=useState({});

  const onloginclick=async (e)=>{

    e.preventDefault();
    try{
    const res=await axios.post("https://notes.devlop.tech/api/login",{cin,password})
    console.log(res)
    if(res.status==200){
      setuserloged(true)
      settoken(res.data.token)
      setuserInfo({
        userfirstname:res.data.user.first_name,
        userlastname:res.data.user.last_name,
      })
    }
  }
    catch(err){
      console.log("loging failed")
      setuserloged(false)
      console.log(userloged)
    }
    
  }

  
  return(
    <div>
     {userloged ?  (
        <List token={token} userInfo={userInfo}/>
      ):(
        <form action="">
          <input
            type="text"
            value={cin}
            onChange={(e) => setcin(e.target.value)}
            placeholder="CIN"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={onloginclick}>Login</button>
        </form>
      ) }
      
    </div>
  )
};

export default Login;