import UserModel from "../models/UserModel.js";

// /getContact/:userName
const getContact = async (req, res, next) => {
    try {
        const { userName } = req.body;
        const currUserId = req.userId;

        let searchedUsers;
        if (userName === "" || userName === undefined) {
            searchedUsers = await UserModel.find({ _id: { $ne: currUserId } });
        }
        else {
            searchedUsers = await UserModel.find({
                $and: [
                    { _id: { $ne: currUserId } },
                    {
                        $or: [
                            { firstName: { $regex: new RegExp('^' + userName, 'i') } },
                            { lastName: { $regex: new RegExp('^' + userName, 'i') } },
                            { email: { $regex: new RegExp('^' + userName, 'i') } }
                        ]
                    }
                ]
            })
        }

        // remove password
        searchedUsers = searchedUsers.map((user) => {
            const { password: hashedPassword, ...restDetails } = user._doc;
            return restDetails;
        })

        return res.status(200).json({
            success: true,
            message: "Required Contacts Fetched !",
            searchedContacts: searchedUsers
        })
    } catch (error) {
        next(error)
    }
}




export { getContact }