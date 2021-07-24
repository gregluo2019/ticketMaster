export class VpGuestAuthRequest {

    public static GUEST_TYPE_SHARED_VIEW: string = 'shared-view';

    constructor(data: any = {}) {
        Object.assign(this, data);
    }
    guestType: string;
    guestToken: string; 
}

export class VpAuthRequest {
    constructor(data: any = {}) {
        Object.assign(this, data);
    }
    email: string;
    password: string;
    grant_type: string = 'password';
}

export class VpAuthResponse {
    constructor(data: any = {}) {
        Object.assign(this, data);
    }
    token: string;
}

export class VpJwt {
    access_token: string;
    userId: string;    
    userEmail: string;
    userRoles: VpUserRoles;
    expires: number;

    // token_type: string;
    // expires_in: number;
    // issued: Date;

    public get isValid(): boolean {
        let valid = false;
        // is it a valid value
        if (this.access_token !== null && this.access_token !== undefined && this.access_token.length > 0)
        {
            if (typeof this.expires === 'undefined') {
                // never expires
                valid = true;
            }
            else {
                // has the token expired
                const current_time = new Date().getTime() / 1000;
                if (current_time < this.expires) { 
                    valid = true;
                }
            }
        }
        return valid;
    }
    
}

export class VpUserRoles extends Array<string> {
    hasAllowedRole(allowedRoles: Array<string>): boolean {

        let allowed = false;
        if (allowedRoles && allowedRoles.length > 0) {
            for (const role of this) {
                if (allowedRoles.indexOf(role.toLocaleLowerCase()) > -1) {
                    allowed = true;
                    break;
                }
            }
        }
        else {
            allowed = true;
        }
        return allowed;
    }
}

