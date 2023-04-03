import React from 'react';
import {
  IcruitingLogo,
  Users,
  World,
  Portfolio,
  Settings,
  Logout,
  Account,
} from 'icons';
import {useTheme} from 'styled-components';
import {useAuth} from 'context';
import {SideNav, NavList, Container, LogoContainer} from './DashboardLayout.sc';
import {NavLink} from './NavLink';
import Link from 'next/link';
import {Box, Typography} from 'components';

const DashboardLayout: React.FC = ({children}) => {
  const {colors, spacing} = useTheme();
  const {currentUser} = useAuth();

  const iconsStyles = {
    marginRight: spacing.scale200,
    height: spacing.scale400,
    width: spacing.scale400,
    color: colors.textDefault,
  };

  return (
    <>
      <SideNav>
        <LogoContainer>
          <Link href="/">
            <a>
              <IcruitingLogo
                style={{
                  width: '110px',
                  height: 'auto',
                  marginBottom: -10,
                  fill: colors.textPrimary,
                }}
              />
            </a>
          </Link>
        </LogoContainer>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
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
                Mitarbeiter:innen
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
          <NavList>
            <NavLink href="/account">
              <Account style={iconsStyles} />
              Account
            </NavLink>
            <NavLink href="/logout">
              <Logout style={iconsStyles} />
              Abmelden
            </NavLink>
            {currentUser?.userRole === 'admin' && (
              <NavLink href="/dashboard/settings">
                <Settings style={iconsStyles} />
                Einstellungen
              </NavLink>
            )}
            <Box
              borderTop={`1px solid ${colors.borderSubdued}`}
              padding={`${spacing.scale200} ${spacing.scale500}`}
              fontSize={13}
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {currentUser.email}
            </Box>
          </NavList>
        </Box>
      </SideNav>
      <Container>{children}</Container>
    </>
  );
};

const getDashboardLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export {DashboardLayout, getDashboardLayout};
