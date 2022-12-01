import UserInfo from "../pages/User-info";

import ForgotPassword from "../pages/Forgot-password";
import Register from "../pages/Register";


import Users from '../adminPages/Admin-checkUsers';
import OneUser from '../adminPages/Admin-checkOneUser';
import CreateUser from '../adminPages/Admin-createUser';
import ChangeUser from '../adminPages/Admin-changeAccount.js';

import AllCalendars from "../pages/All-calendars";
import Calendar from "../pages/Calendar";
import Event from "../pages/Events";
import MainCalendar from "../pages/MainCalendar";

export const privateRoutes = [
    {path:'/:user_login/info', element: UserInfo},
    {path: '/calendars', element: AllCalendars},
    {path: '/calendars/:id', element: Calendar},
    {path: '/calendars/:id/events/:event_id', element: Event},
    {path: '/calendars/main', element: MainCalendar}

];

export const adminRoutes = [
    {path:'/:user_login/info', element: UserInfo},
    {path: '/admin/users', element : Users},
    {path: '/admin/users/:login', element: OneUser},
    {path: '/admin/create-user', element: CreateUser},
    {path: '/admin/change-user/:id', element: ChangeUser},
    {path: '/calendars', element: AllCalendars},
    {path: '/calendars/:id', element: Calendar},
    {path: '/calendars/:id/events/:event_id', element: Event},
    {path: '/calendars/main', element: MainCalendar}
];


export const publicRoutes = [
    {path:'/register', element: Register},
    {path:'/forgot-password', element: ForgotPassword},
];