import axios from 'axios';
import React from 'react'
import { useDispatch } from 'react-redux';
import { setAccesstoken } from '../store/userSlice';
import { useNavigate,Link } from 'react-router-dom';
import toast from "react-hot-toast";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    emailorUserName:"",
    password: "",
  });


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`;
  
    try {
      const response = await axios.post(URL, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      toast.success(response.data.message || "Login Successfull!");
      
      dispatch(setAccesstoken(response?.data?.data?.accessToken));
      localStorage.setItem("accessToken", response?.data?.data?.accessToken);

      setData({
        emailorUserName:"",
        password: "",
      });
      navigate("/");

    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred!";
      toast.error(errorMessage);
      console.log("Error:", error);
    }
  };

  return (
    <div className="mt-s flex justify-center items-center h-screen">
      <div className="bg-white w-full max-w-md mx:2 rounded overflow-hidden p-6 m-auto md:mx-auto">
        <h3 className='text-center font-semibold'>Welcome to Chat App</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="emailorUserName">Username:</label>
            <input
              type="text"
              id="emailorUserName"
              name="emailorUserName"
              placeholder="Enter your username Or Email:"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.emailorUserName}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
         
          <button
            type="submit"
            className="bg-primary px-4 py-1 hover:bg-secondary text-white rounded mt-2 font-bold leading-relaxed tracking-wide "
          >
            Login
          </button>
        </form>
        <p className='m-4 text-right font-light italic hover:text-primary'><Link to='/forgot-password' >Forgot Password...</Link></p>
        <p className="text-center mt-2">
          Are you a new User?Please{" "}
          <Link
            className="text-secondary font-semibold hover:text-primary hover:underline"
            to={"/register"}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login