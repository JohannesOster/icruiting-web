import React from 'react';
import {withAuth} from 'requireAuth';
import {getDashboardLayout} from 'components';

const Dashboard = () => <div>Dashboard</div>;

Dashboard.getLayout = getDashboardLayout;
export default withAuth(Dashboard);
