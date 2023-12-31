import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
import { HashLink as Link } from "react-router-hash-link";
import './styles/login.css'

const LOGIN_URL = "/auth";

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
    userRef.current.focus();
    }, []);

    useEffect(() => {
    setErrMsg("");
    }, [user, pwd]);

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }
        );
        console.log(JSON.stringify(response?.data));
        console.log(JSON.stringify(response));
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        const _id = response?.data?._id;
        setAuth({ user, pwd, roles, accessToken, _id });
        setUser("");
        setPwd("");
        setSuccess(true);
    } catch (err) {
        if (!err?.response) {
        setErrMsg("No Server Response");
        } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
        } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
        } else {
        setErrMsg("Login Failed");
        }
        errRef.current.focus();
    }
    };

    return (
    <>
        {success ? (
        <section id="login">
            <h1>You are logged in!</h1>
            <br />
            <p>
            <Link to = '/home'> Go Home </Link>
            </p>
        </section>
        ) : (
        <section id="login">
            <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
            >
            {" "}
            {errMsg}{" "}
            </p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
            <label htmlFor="username">
                Username:
                <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                />
            </label>

            <label htmlFor="password">
                Password:
                <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                />
            </label>
            <button>Sign In</button>
            </form>
            <p>
            Need an Account? <br />
            <span>
                <Link to = '/'>Register</Link>
            </span>
            </p>
        </section>
        )}
    </>
    );
};

export default Login;
