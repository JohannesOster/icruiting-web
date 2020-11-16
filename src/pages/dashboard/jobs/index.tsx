import React from 'react';
import {withAdmin} from 'requireAuth';
import {getDashboardLayout} from 'components';

const Jobs = () => <div>Jobs</div>;

Jobs.getLayout = getDashboardLayout;
export default withAdmin(Jobs);
