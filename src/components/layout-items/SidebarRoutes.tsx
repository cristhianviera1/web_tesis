import React, { FunctionComponent, useMemo } from 'react';
import { IdcardOutlined } from '@ant-design/icons';
import { Menu } from "antd";

export interface SidebarRoutes {
    roles: AppRole[];
}

export type AppRole = "admin" | "branch_admin" | "client" | "brigadista";
/*
const SidebarRoutes: FunctionComponent<SidebarRoutes> = ({ roles }) => {
    const route =""
}
*/


export default SidebarRoutes;

export interface Route {
    name: string;
    icon: any;
    routeUrl: string;
    role?: string[];
}

export enum AppRoles {
    ADMIN = 'admin',
    BRANCH_ADMIN = 'branch_admin',
    CLIENT = 'client',
    BRIGADISTA = 'brigadista',
}

export const routes: Route[] = [
    {
        name: "Menu",
        icon: <IdcardOutlined />,
        routeUrl: "/dashboard",
        role: [],
    },
    {
        name: "Menu",
        icon: <IdcardOutlined />,
        routeUrl: "/administrator/users",
        role: [],
    }
]