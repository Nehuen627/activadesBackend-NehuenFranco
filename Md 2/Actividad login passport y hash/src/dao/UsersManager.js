import userModel from "./models/user.model.js";
import bcrypt from 'bcrypt';

export default class {
    static async addUser(data) {
        const saltRounds = 10;
        data.password = await bcrypt.hash(data.password, saltRounds);
        await userModel.create(data);
        return await userModel.findOne({email: data.email});
    }
    static async addGithubUser(data) {
        await userModel.create(data);
        return await userModel.findOne({email: data.email});
    }

    static async getUserData(email, password) {
        const user = await userModel.findOne({ email });
        if (!user) {
            return "Email or password invalid";
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            return user;
        } else {
            return "Email or password invalid";
        }
    }
    static async findEmail(email){
        const user = await userModel.findOne({ email });
        if (!user) {
            return null;
        } else {
            return user;
        }
    }
}
