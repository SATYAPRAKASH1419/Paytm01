import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center ">
    <div className="flex flex-col justify-center ">
      <div className="rounded-lg bg-white w-100 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />

        <InputBox onChange={e => {
          setFirstName(e.target.value);
        }} placeholder="John" label={"First Name"}  value={firstname}/>

        <InputBox onChange={e => {
          setLastName(e.target.value);
        }} placeholder="Doe" label={"Last Name"} value={lastname} />

        <InputBox onChange={e => {
          setUsername(e.target.value);
        }}placeholder="johdoe@gmail.com" label={"Email"}  value={username}/>

        <InputBox onChange={e => {
          setPassword(e.target.value);
        }} placeholder="123456" label={"Password"} value={password}/>

        <div className="pt-4">
         
          <Button label={"Sign up"} onClick={async () => {
            try {
                    const response = await axios.post(
                    "http://localhost:3000/api/v1/user/signup",
                    {
                        username,
                        firstname,
                        lastname,
                        password
                    },
                    {
                        headers: {
                        "Content-Type": "application/json"
                        }
                    }
                    );
                    localStorage.setItem("token", response.data.token);
                    navigate("/dashboard");
                } catch (error) {
                    console.error("Signup Error:", error);
                    alert("Signup failed. Check console for details.");
                }
                        }}
          />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}

export default Signup;