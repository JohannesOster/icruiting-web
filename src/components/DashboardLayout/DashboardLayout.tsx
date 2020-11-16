import React from 'react';
import {Users, World, Portfolio, Palette} from 'icons';
import {useTheme} from 'styled-components';
import {useAuth} from 'context';
import {SideNav, NavList, Container} from './DashboardLayout.sc';
import {useRouter} from 'next/router';
import {NavLink} from './NavLink';

const DashboardLayout: React.FC = ({children}) => {
  const {colors, spacing} = useTheme();
  const {pathname} = useRouter();
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
            <NavLink href={`${pathname}/jobs`}>
              <Portfolio style={iconsStyles} />
              Stellen
            </NavLink>
            <NavLink href={`${pathname}/applicants`}>
              <Users style={iconsStyles} />
              Bewerbungen
            </NavLink>
            <NavLink href={`${pathname}/members`}>
              <World style={iconsStyles} />
              Tenant
            </NavLink>
            <NavLink href={`${pathname}/theme`}>
              <Palette style={iconsStyles} />
              Theme
            </NavLink>
          </NavList>
        ) : (
          <NavList>
            <NavLink href={`${pathname}/applicants`}>
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
