import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/IUser';

const UserSchema = new Schema<IUser>({
    lastName: { type: String, required: [true, "Фамилия обязательна"], trim: true, maxlength: [55, 'Не длиннее 55 символов'] },
    firstName: { type: String, required: [true, "Имя обязательно"], trim: true, maxlength: [55, 'Не длиннее 55 символов'] },
    middleName: { type: String, trim: true, maxlength: [55, 'Не длиннее 55 символов'] },
    birthDate: {
        type: Date,
        required: [true, 'Дата рождения обязательна'],
        validate: {
            validator: function(value: Date) {
                const minAgeDate = new Date();
                minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);
                return value <= minAgeDate;
            },
            message: 'Пользователь должен быть старше 13 лет'
        }
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Неверный формат email'],
    },
    password: {
        type: String,
        required: [true, 'Пароль обязателен'],
        minlength: [6, 'Пароль должен содержать минимум 6 символов']
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: 'Роль должна быть либо admin, либо user'
        },
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

UserSchema.virtual('fullName').get(function() {
    return this.middleName
        ? `${this.lastName} ${this.firstName} ${this.middleName}`
        : `${this.lastName} ${this.firstName}`;
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.__v;
    return user;
};

export const User = model<IUser>('User', UserSchema);