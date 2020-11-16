import React from 'react';
import {Users, World, Portfolio, Palette} from 'icons';
import {useTheme} from 'styled-components';
import {useAuth} from 'context';
import {SideNav, NavList, Container} from './DashboardLayout.sc';
import {NavLink} from './NavLink';

const DashboardLayout: React.FC = ({children}) => {
  const {colors, spacing} = useTheme();
  const {currentUser} = useAuth();

  const iconsStyles = {
    marginRight: spacing.scale200,
    height: spacing.scale400,
    width: spacing.scale400,
    color: colors.typographyPrimary,
  };

  return (
    <>
      <SideNav>
        {currentUser?.userRole === 'admin' ? (
          <NavList>
            <NavLink href="/dashboard/jobs">
              <Portfolio style={iconsStyles} />
              Stellen
            </NavLink>
            <NavLink href="/dashboard/applicants">
              <Users style={iconsStyles} />
              Bewerbungen
            </NavLink>
            <NavLink href="/dashboard/members">
              <World style={iconsStyles} />
              Tenant
            </NavLink>
            <NavLink href="/dashboard/theme">
              <Palette style={iconsStyles} />
              Theme
            </NavLink>
          </NavList>
        ) : (
          <NavList>
            <NavLink href="/dashboard/applicants">
              <Users style={iconsStyles} />
              Bewerbungen
            </NavLink>
          </NavList>
        )}
      </SideNav>
      <Container>{children}</Container>
    </>
  );
};

const getDashboardLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export {DashboardLayout, getDashboardLayout};
