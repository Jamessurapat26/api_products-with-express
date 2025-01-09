const isAdmin = (req, res, next) => {
    const user = req.user;

    console.log(user.payload.role);
    if (user.payload.role == "admin") {
        next();
    } else {
        return res.status(403).send({
            message: "Permission denied"
        })
    }

}

const isUserorAdmin = (req, res, next) => {
    const user = req.user;

    console.log(user.payload.role);
    if (user.payload.role == "admin" || user.payload.role == "user") {
        next();
    } else {
        return res.status(403).send({
            message: "Permission denied"
        })
    }

}

module.exports = { isAdmin, isUserorAdmin };   