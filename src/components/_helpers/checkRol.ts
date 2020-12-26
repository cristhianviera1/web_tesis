export interface tokenValues {
    email: string,
    _id: string,
    phone: string,
    devicesToken: string,
    type: string,
    roles: string
}

export const allowedRoles = ['admin', 'branch_admin'];
export type allowedRolesType = 'admin' | 'branch_admin';

export enum allowedRolesEnum {
    ADMIN = 'admin',
    BRANCH_ADMIN = 'branch_admin',
}

export const verifyRoleAndRedirect = (token: tokenValues): boolean => {
    return allowedRoles.includes(token.roles);
}
