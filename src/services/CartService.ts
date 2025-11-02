import {Cart} from '../models/Cart.js';
import {ICart} from "../interfaces/ICart.js";

export class CartService {
    static async createCart(cartData: ICart) {
        const cart = new Cart(cartData);
        try {
            const saved = await cart.save();
            return saved;
        } catch (error: any) {
            console.error('Mongoose save error:', error);

            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((e: any) => e.message);
                console.error('Validation errors:', messages);
            }

            throw error;
        }
    }
    // static async findById(id: string) {
    //     return await User.findById(id);
    // }
    static async getAllCarts() {
        return await Cart.find();
    }
    // static async updateUser(id: string, updateUserData: IUserUpdate) {
    //     return await User.findByIdAndUpdate(id, updateUserData, {new: true, runValidators: false});
    // }
    // static async deleteUser(id: string) {
    //     return await User.findByIdAndUpdate(
    //         id,
    //         { $set: { isActive: false } },
    //         { new: true }
    //     );
    // }
    // static async activateUser(id: string) {
    //     return await User.findByIdAndUpdate(
    //         id,
    //         { $set: { isActive: true } },
    //         { new: true }
    //     );
    // }
    // static async inactivateUser(id: string) {
    //     return await User.findByIdAndUpdate(
    //         id,
    //         { $set: { isActive: false } },
    //         { new: true }
    //     );
    // }
    // static async isEmailExists(email: string, excludeUserId?: string) {
    //     const query: any = { email: email.toLowerCase() };
    //     if (excludeUserId) {
    //         query._id = { $ne: new Types.ObjectId(excludeUserId) };
    //     }
    //     return await User.exists(query);
    // }
    // static usersEditorForAdmin(user: IUser): IUsersAdmin {
    //     return {
    //         fullName: `${user.lastName} ${user.firstName} ${user.middleName}`,
    //         email: user.email,
    //         role: user.role,
    //         isActive: user.isActive,
    //         id: user._id as string
    //     }
    // }
}