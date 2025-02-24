import { EUsersStatus } from "app/models/enum";

export interface User
{
    id: string;
    name: string;
    email: string; 
    firstName:string;
    password:string;
    phone:string;
    avatarUrl?: any;
    createdOn?: Date;
    lastLogin?: Date;
    status :string;
    position:InsertPosition;
    isAdmin:boolean;
    isLdap:boolean;
    token:string;
}
