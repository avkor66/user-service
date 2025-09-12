import {IUser, IUserProfile} from "../interfaces/IUser";

export class ProfileService {

    static timeCorrect (time: number): string {
        return time < 10 ? '0' + time.toString() : time.toString();
    };

    static dateEditor(date: Date, flag: boolean): string {
        const newDate = `${ProfileService.timeCorrect(date.getDate())}.${ProfileService.timeCorrect(date.getMonth() + 1)}.${date.getFullYear()}`
        if (flag) {
            const newTime = `${ProfileService.timeCorrect(date.getHours())}:${ProfileService.timeCorrect(date.getMinutes() + 1)}:${ProfileService.timeCorrect(date.getSeconds())}`
            return newDate + ' ' + newTime;
        } else return newDate;
    }

    static userEditorForProfile(user: IUser): IUserProfile {
        return {
            fullName: `${user.lastName} ${user.firstName} ${user.middleName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName || '',
            birthDate: ProfileService.dateEditor(user.birthDate, false),
            email: user.email,
            role: user.role,
            isAdmin: user.role === 'admin',
            isActive: user.isActive,
            createdAt: ProfileService.dateEditor(user.createdAt, true),
            updatedAt: ProfileService.dateEditor(user.updatedAt, true)
        }
    }
}
