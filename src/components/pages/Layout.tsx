import * as React from 'react';
import NavMenu from '../shared/NavMenu';
import { Outlet } from "react-router-dom";
import Sidebar from '../shared/Sidebar';

export default function Layout() {
    return (
        <React.Fragment>
            <NavMenu />
            <Outlet />
        </React.Fragment>
    );
}