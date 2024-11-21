import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const getUserDetailsFromToken = async (token) => {
    try {
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password");
        return user;
    } catch (error) {
        return null;
    }
};

export default getUserDetailsFromToken;