module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuari.rol)) {
            return res.status(403).json({ message: "Accés prohibit" });
        }
        next();
    };
};
