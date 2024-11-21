import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";


const registerUser = asyncHandler(async (req, res) => {
    const { name, username, email, password, profile_pic } = req.body;

    if (!name || !username || !email || !password || !profile_pic) {
        throw new ApiError(400, "All fields are required");
    }

    const isUserExist = await User.findOne({ $or: [{ username }, { email }] });

    if (isUserExist) {
        throw new ApiError(400, "User already exist");
    }
    try {
        const user = await User.create({
            name,
            username,
            email,
            password,
            profile_pic,
        });

        if (!user) {
            throw new ApiError(400, "Failed to create user");
        }

        const { password: _, ...createdUser } = user.toObject();

        if (!createdUser) {
            throw new ApiError(400, "Failed to create user");
        }

        return res.status(201).json(
            new ApiResponse(200, "User sucessfully created", createdUser)
        )
    } catch (error) {
        console.log("Error in creating db instance : ",error);
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { emailorUserName, password } = req.body;

    if (!emailorUserName || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ 
        $or: [{ email: emailorUserName }, { username: emailorUserName }] 
    });

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
        throw new ApiError(400, "Invalid credentials");
    }

    const accessToken = await user.genrateAccessToken();

    const { password: _, ...userDataWithoutPassword } = user.toObject();
    const userData = { ...userDataWithoutPassword, accessToken };

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        })
        .json(new ApiResponse(200, "User logged in successfully", userData));
})

const updateUser = asyncHandler(async (req, res) => {
    const { name,username, password, profile_pic } = req.body;

    const user = req?.user;

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const existingUser = await User.findById(user._id);

    existingUser.username = username ? username : existingUser.username;
    existingUser.name = name ? name : existingUser.name;
    existingUser.profile_pic = profile_pic ? profile_pic : existingUser.profile_pic;
    existingUser.password = password ? password : existingUser.password;

    const updatedUser = await existingUser.save();

    const { password: _, ...userData } = updatedUser.toObject();

    return res.status(200).json(new ApiResponse(200, "User updated successfully", userData));
})

const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        })
        .json(new ApiResponse(200, "user logged out successfully", {}));
})

const userDetails = asyncHandler(async (req, res) => {
    const user = req?.user;
    const { password: _, ...userDataWithoutPassword } = user.toObject();
    const userData = {...userDataWithoutPassword, accessToken: (req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', ''))};
    return res.status(200).json(new ApiResponse(200, "User details fetched successfully", userData));
})

const searchUser = asyncHandler(async (req, res) => {
    try {
        const {search} = req.body;
        const query = new RegExp(search, 'i');
        const users = await User.find({
            $or: [
                { name: { $regex: query } },
                { email: { $regex: query } },
            ]})
            .select('-password');
            return res.status(200).json(new ApiResponse(200, "Users fetched successfully", users)); 
    } catch (error) {
        console.log("Error in searching user : ", error);
        new ApiError(500, "Error in searching user");
    }
})

export {
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    userDetails,
    searchUser
};
