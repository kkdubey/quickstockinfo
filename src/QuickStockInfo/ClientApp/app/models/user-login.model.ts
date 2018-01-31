// ======================================
// Author: Komal Dubey
// Email:  kkdubey12@gmail.com
// 
// 

// ======================================

export class UserLogin {
    constructor(email?: string, password?: string, rememberMe?: boolean) {
        this.email = email;
        this.password = password;
        this.rememberMe = rememberMe;
    }

    email: string;
    password: string;
    rememberMe: boolean;
}