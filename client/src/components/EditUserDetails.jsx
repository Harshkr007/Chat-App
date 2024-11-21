import React, { useEffect, useState } from "react";
import uploadFile from "../helper/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import Avatar from "./Avatar";
import toast from "react-hot-toast";

function EditUserDetails({ onClose, user }) {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });

  const uploadPhotoRef = React.useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => {
      return {
        ...prev,
        ...user,
      };
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const response = await uploadFile(file);
    console.log(response);

    setData((prev) => {
      return {
        ...prev,
        profile_pic: response?.secure_url,
      };
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/update`;
          const token = localStorage.getItem('accessToken');
        
          // Ensure we're sending the correct profile_pic URL
          const updateData = {
              ...data,
              profile_pic: data.profile_pic || user.profile_pic // Fallback to existing profile pic
          };

          const response = await axios.put(
              URL,
              updateData,
              {
                  withCredentials: true,
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                  }
              }
          );

          if (response.data.success) {
              dispatch(setUser(response.data.data));
              toast.success("Profile updated successfully");
              onClose();
          }
      } catch (error) {
          console.log('Update Error:', error.response?.data || error);
          toast.error(error?.response?.data?.message || "Update failed");
      }
  };  

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();

    uploadPhotoRef.current.click();
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl m-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-secondary mb-1">Profile Details</h2>
      <p className="text-sm text-gray-600 mb-4">Edit Your Profile Information</p>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={handleOnChange}
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <div className="font-medium text-gray-700 mb-2">Photo:</div>
          <div className="flex items-center gap-4">
            <Avatar
              width={48}
              heigth={48}
              imageUrl={data.profile_pic}
              name={data.name}
              className="rounded-full"
            />
            <label htmlFor="profile_pic">
              <button
                className="text-secondary hover:text-primary font-medium transition-colors"
                onClick={handleOpenUploadPhoto}
              >
                Change Photo
              </button>
              <input
                type="file"
                className="hidden"
                id="profile_pic"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
            </label>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 my-2"></div>

        <div className="flex gap-3 justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}

export default EditUserDetails;
