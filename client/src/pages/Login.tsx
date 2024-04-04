import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../utils/auth.ts";

function Login() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: String,
    password: String,
  });

  const formHandler = async (event) => {
    event.preventDefault();
    try {
      //   console.log(formState);
      const response = await fetch(`/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
        }),
      });
      const result = await response.json();
      if (result.message === "Logged in!") {
        Auth.login(result.token);
        navigate("/home");
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle form change and update formState
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return Auth.loggedIn() === false ? (
    <div className="container">
      <div className="row">
        <div className="col mt-4 mb-3">
          <h1 className="text-center">
            Login or Create an Account to Get Started!
          </h1>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-lg-6 mt-2 mx-auto">
          <form onSubmit={formHandler}>
            <div className="form-floating my-3">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="name@example.com"
                onChange={handleChange}
              />
              <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="text-center">
              <button className="btn btn-primary py-2 px-4 my-5" type="submit">
                Login
              </button>
            </div>
            <div className="text-center">
              <p>
                New Here? Click here to <Link to={"/signup"}>sign up!</Link>{" "}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center mt-5">
      <p>Already Logged In!</p>
      <button>
        <Link to={"/"}>Go to home</Link>
      </button>
    </div>
  );
}

export default Login;
