import React from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import uploadFile from "../helper/uploadFile";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    name: "",
    email: "",
    username: "",
    password: "",
    profile_pic: "",
  });

  const [uploadPhoto, setUploadPhoto] = React.useState(null);

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const response = await uploadFile(file);
    console.log(response);

    setUploadPhoto(file);

    setData((preve) => {
      return {
        ...preve,
        profile_pic: response?.secure_url,
      };
    });
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
  };

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

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`;

    try {
      const response = await axios.post(URL, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful!");
        setData({
          name: "",
          email: "",
          username: "",
          password: "",
          profile_pic: "",
        });
        setUploadPhoto(null);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred!";
      toast.error(errorMessage);
      console.log("Error:", error);
    }
  };

  return (
    <div className="mt-s">
      <div className="bg-white w-full max-w-md mx:2 rounded overflow-hidden p-6 mt-5 md:mx-auto">
        <h3 className="text-center font-bold">Welcome to Chat App</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="input">Name:</label>
            <input
              type="text"
              id="input"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.username}
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
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ecllipsis line-clamp-1">
                  {uploadPhoto ? uploadPhoto.name : "Upload profile photo:"}
                </p>
                {uploadPhoto && (
                  <button
                    className="text-lg ml-2 hover:text-red-500"
                    onClick={handleClearUploadPhoto}
                    type="button"
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary px-4 py-1 hover:bg-secondary text-white rounded mt-2 font-bold leading-relaxed tracking-wide "
          >
            Register
          </button>
        </form>
        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link
            className="text-secondary font-semibold hover:text-primary hover:underline"
            to={"/login"}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
