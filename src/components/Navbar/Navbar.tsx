import React, {useState, useEffect} from 'react';
import {
  Header,
  DesktopNav,
  NavItem,
  MobileNav,
  DropDownItem,
  MobileNavItem,
  Hamburger,
  NavContainer,
  Separator,
} from './Navbar.sc';
import {DropDown, Typography, Box} from 'components';
import {Button} from 'components';
import {IcruitingLogo, UserCircle, Logout} from 'icons';
import {useTheme} from 'styled-components';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useAuth} from 'context';
import config from 'config';
import {theme} from 'theme';

const Navbar: React.FC = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const {currentUser, logout, isAuthenticating} = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (menuOpen) {
      // https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
      // to avoid scrolling under mobile menu
      document.body.style.position = 'fixed';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // reset back to default
      const scrollY = document.body.style.top;
      document.body.style.position = 'relative';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const unauthenticatedMobileNav = (
    <>
      <MobileNavItem onClick={closeMenu}>
        <a href="/docs/">Dokumentation</a>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/contact">
          <a>Kontakt</a>
        </Link>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/login">
          <a>Anmelden</a>
        </Link>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/signup">
          <a>Registrieren</a>
        </Link>
      </MobileNavItem>
    </>
  );

  const authenticatedMobileNav = (
    <>
      <MobileNavItem onClick={closeMenu}>
        <a
          href="https://docs.icruiting.at"
          rel="noopener noreferrer"
          target="_blank"
        >
          Dokumentation
        </a>
      </MobileNavItem>
      {currentUser?.userRole === 'admin' && (
        <>
          <MobileNavItem onClick={closeMenu}>
            <Link href="/dashboard/jobs">
              <a>Stellen</a>
            </Link>
          </MobileNavItem>
          <MobileNavItem onClick={closeMenu}>
            <Link href="/dashboard/applicants">
              <a>Bewerber*innen</a>
            </Link>
          </MobileNavItem>
          <MobileNavItem onClick={closeMenu}>
            <Link href="/dashboard/members">
              <a>Mitarbeiter:innen</a>
            </Link>
          </MobileNavItem>
          <MobileNavItem onClick={closeMenu}>
            <Link href={`/dashboard/theme`}>
              <a>Einstellungen</a>
            </Link>
          </MobileNavItem>
        </>
      )}
      <Box padding={`${spacing.scale200} ${spacing.scale500}`}>
        <Separator />
      </Box>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/account">
          <a>Account</a>
        </Link>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/contact">
          <a>Kontakt</a>
        </Link>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Typography>
          <a
            href={`${config.userPoolDomain}/logout?client_id=${config.userPoolWebClientId}&logout_uri=${config.logoutCallbackUrl}`}
          >
            Abmelden
          </a>
        </Typography>
      </MobileNavItem>
    </>
  );

  const unauthenticatedDesktopNav = (
    <>
      <NavItem>
        <a
          href="https://docs.icruiting.at"
          rel="noopener noreferrer"
          target="_blank"
        >
          Dokumentation
        </a>
      </NavItem>
      <NavItem>
        <Link href="/contact">
          <a>Kontakt</a>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/login">
          <a>Anmelden</a>
        </Link>
      </NavItem>
      <NavItem>
        <Button onClick={() => router.push('/signup')}>Registrieren</Button>
      </NavItem>
    </>
  );

  const authenticatedDesktopNav = (
    <>
      <NavItem>
        <a
          href="https://docs.icruiting.at"
          rel="noopener noreferrer"
          target="_blank"
        >
          Dokumentation
        </a>
      </NavItem>
      <NavItem>
        <Link href="/contact">
          <a>Kontakt</a>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="/dashboard">
          <a>Dashboard</a>
        </Link>
      </NavItem>
      <NavItem>
        <DropDown label={currentUser?.email || 'Account'}>
          <Box position="relative">
            <Link href="/account">
              <DropDownItem>
                <UserCircle
                  style={{width: '1em', marginRight: spacing.scale200}}
                />
                Account
              </DropDownItem>
            </Link>
            <Typography
              onClick={() => {
                router.replace(
                  `${config.userPoolDomain}/logout?client_id=${config.userPoolWebClientId}&logout_uri=${config.logoutCallbackUrl}`,
                );
              }}
            >
              <DropDownItem>
                <Logout style={{width: '1em', marginRight: spacing.scale200}} />
                Abmelden
              </DropDownItem>
            </Typography>
          </Box>
        </DropDown>
      </NavItem>
    </>
  );

  return (
    <Header>
      <div style={{zIndex: 25, cursor: 'pointer'}} onClick={closeMenu}>
        <Link href="/">
          <a>
            <IcruitingLogo
              style={{
                width: '110px',
                height: 'auto',
                marginBottom: -10,
                fill: theme.colors.textPrimary,
              }}
            />
          </a>
        </Link>
      </div>
      {!isAuthenticating && (
        <>
          <NavContainer style={{marginLeft: 'auto'}}>
            <Hamburger
              open={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span></span>
              <span></span>
              <span></span>
            </Hamburger>
            <DesktopNav>
              {currentUser
                ? authenticatedDesktopNav
                : unauthenticatedDesktopNav}
            </DesktopNav>
          </NavContainer>
          <MobileNav open={menuOpen}>
            <Separator />
            {currentUser ? authenticatedMobileNav : unauthenticatedMobileNav}
          </MobileNav>
        </>
      )}
    </Header>
  );
};

export {Navbar};
