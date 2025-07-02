import jwt from "jsonwebtoken"
import errorHandler from "../error/customError.js";

const verifyToken = (req, res, next) => {
    try {
        const jwtToken = req.cookies.token;
        if (!jwtToken || jwtToken === undefined) next(errorHandler(401, "UnAuthenticated ! Login to continue !"));
        const result = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (!result) next(errorHandler(404, "Login Again ! Token Expired !"));

        const userTokenPayload = jwt.decode(jwtToken);

        // append userId from token
        req.userId = userTokenPayload.userId;

        next();
    } catch (error) {
        console.log(error.message)
        next(error);
    }
}

export default verifyToken;