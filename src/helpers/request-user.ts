import { Request } from "express"
import { User } from "modules/users/entities/user.entity"

export default interface RequestWithUser extends Request{
    user: User;
}
