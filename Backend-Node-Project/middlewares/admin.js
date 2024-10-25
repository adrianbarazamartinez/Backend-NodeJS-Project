// Used to check if the user is an admin before performing an action
export default function admin(req, res, next){
    if(req.user.role!=="admin"){
        return res.status(403).json({ message: "Acess Denied, you do not have permission to perform this action" });
    }

    next();
}