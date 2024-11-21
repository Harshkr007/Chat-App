import asyncHandler from "../utils/asyncHandler.js";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import ApiResponse from "../utils/ApiResponse.js";
import { logout } from "../../../client/src/store/userSlice.js";



const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '') || '';

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            logout: true
        });
    }
    const user = await getUserDetailsFromToken(token);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
});

export default authenticate;