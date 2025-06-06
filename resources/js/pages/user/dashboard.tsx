import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import React from 'react'
import Navbar from '@/components/navbar';

const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <h1>User Dashboard</h1>
        </div>
    )
};

export default Dashboard;