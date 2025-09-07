import { User } from '../models/User.ts';
import { IUserCreate, IUserUpdate } from '../interfaces/IUser.ts';
import { Types } from 'mongoose';

export class UserService {
    static async createUser(userData: IUserCreate) {
        const user = new User(userData)
        return await user.save();
    }

    static async findByEmail(email: string) {
        return await User.findOne({ email: email.toLowerCase() });
    }

    static async findById(id: string) {
        return await User.findById(id);
    }

    static async getAllUsers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit),
            User.countDocuments()
        ]);

        return {
            users,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    static async updateUser(id: string, updateUserData: IUserUpdate) {
        return await User.findByIdAndUpdate(id, updateUserData, {new: true, runValidators: true});
    }

    static async deleteUser(id: string) {
        return await User.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );
    }

    static async activateUser(id: string) {
        return await User.findByIdAndUpdate(
            id,
            { $set: { isActive: true } },
            { new: true }
        );
    }

    static async inactivateUser(id: string) {
        return await User.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );
    }

    static async findByRole(role: 'admin' | 'user') {
        return await User.find({ role, isActive: true });
    }

    static async findActiveUsers() {
        return await User.find({ isActive: true });
    }

    static async findInactiveUsers() {
        return await User.find({ isActive: false });
    }

    static async isEmailExists(email: string, excludeUserId?: string) {
        const query: any = { email: email.toLowerCase() };
        if (excludeUserId) {
            query._id = { $ne: new Types.ObjectId(excludeUserId) };
        }
        return await User.exists(query);
    }
}