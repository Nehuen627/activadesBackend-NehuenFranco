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
    static async updateData(dataToUpdate, data, uid) {
        try {
            let user = await userModel.findById(uid);
    
            if (dataToUpdate === "email") {    
                const existingUser = await userModel.findOne({ email: data });
    
                if (existingUser && existingUser._id.toString() !== uid) {
                    throw new Exception("The email cannot be used");
                }
    
                user.email = data;
                await user.save();    
                return user;
            } else if (dataToUpdate === "password") {
                const saltRounds = 10;
                data = await bcrypt.hash(data, saltRounds);
                user.password = data;
                await user.save();    
                return user;
            }
        } catch (error) {
            console.error("Error updating data:", error);
            throw error; 
        }
    }
    
    static async findUserByGithubId (gitId) {
        const user = await userModel.findOne({githubId : gitId})
        if(!user) {
            return null;
        }
        else{
            return user;
        }
        }
}
