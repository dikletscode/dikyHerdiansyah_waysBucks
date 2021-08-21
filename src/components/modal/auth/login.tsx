import { ChangeEvent, FC, FormEvent, useContext, useState } from "react";
import Input, { Submit } from "../../custom/components/input";
import { style } from "./form.style";
import { icon } from "../../assets/assetsRegister";
import { UserSignIn } from "../../types/auth";
import fetchData from "./validation/auth";
import AuthContext from "../../../context/context";
import { role } from "../../types/roleEnum";
import { Link } from "react-router-dom";
import { LoginProps } from "../../types/loginProps";

const Login: FC<LoginProps> = ({ isOpen, close, switchModal }) => {
  const [user, setUser] = useState<UserSignIn>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const { dispatch } = useContext(AuthContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((prevInput: typeof user) => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mockFetch = async () => {
      try {
        let data = await fetchData(user);
        localStorage.setItem("_basicInfo", JSON.stringify(data));
        if (data.role == role.SELLER) {
          dispatch({ type: "ADMIN_LOGIN_SUCCESS", payload: null });
        }
        if (data.role == role.BUYYER) {
          dispatch({ type: "BUYYER_LOGIN_SUCCESS", payload: null });
        }
        setMessage("login success,Happy Shopping");
        setUser({ email: "", password: "" });
      } catch (error) {
        if (error.status.code == 401) {
          setMessage("Not Authenticated");
        }
      }
    };
    mockFetch();
  };
  return (
    <>
      {isOpen ? (
        <div style={style.container}>
          <img src={icon.close} alt="" onClick={close} style={style.close} />
          <h1
            style={{
              alignSelf: "flex-start",
              color: "#BD0707",
              paddingLeft: "10px",
            }}
          >
            Login
          </h1>
          <form action="" style={style.formInput} onSubmit={submit}>
            <Input
              type="email"
              value={user.email}
              name="email"
              nameField="Email"
              change={handleChange}
            />
            <Input
              type="password"
              value={user.password}
              name="password"
              nameField="Password"
              change={handleChange}
            />
            <Submit value="Login" />
          </form>
          <p>{message}</p>
          <p>
            Already have an account ? Klik{" "}
            <span style={{ cursor: "pointer" }} onClick={switchModal}>
              Here
            </span>
          </p>{" "}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Login;