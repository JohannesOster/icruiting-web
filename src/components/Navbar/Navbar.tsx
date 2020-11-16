import React, {useState, useEffect} from 'react';
import {Auth} from 'aws-amplify';
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
import {Button} from 'icruiting-ui';
import {IcruitingLogo, UserCircle, Logout} from 'icons';
import {useTheme} from 'styled-components';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useAuth} from 'context';

const Navbar: React.FC = () => {
  const {spacing} = useTheme();
  const router = useRouter();
  const {currentUser, refetchUser, isAuthenticating} = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (menuOpen) {
      // https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
      // to avoid scrolling under mobile menu
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // reset back to default
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [menuOpen]);

  const handleLogout = async () => {
    await Auth.signOut();
    refetchUser();
  };

  const closeMenu = () => setMenuOpen(false);

  const unauthenticatedMobileNav = (
    <>
      <MobileNavItem onClick={closeMenu}>
        <a href="/docs/">Dokumentation</a>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/contact">Kontakt</Link>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/login">Anmelden</Link>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/signup">Registrieren</Link>
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
            <Link href="/dashboard/jobs">Stellen</Link>
          </MobileNavItem>
          <MobileNavItem onClick={closeMenu}>
            <Link href="/dashboard/applicants">Bewerber*innen</Link>
          </MobileNavItem>
          <MobileNavItem onClick={closeMenu}>
            <Link href="/dashboard/members">Tenant</Link>
          </MobileNavItem>
          <MobileNavItem onClick={closeMenu}>
            <Link href={`/dashboard/theme`}>Theme</Link>
          </MobileNavItem>
        </>
      )}
      <Box padding={`${spacing.scale100} ${spacing.scale400}`}>
        <Separator />
      </Box>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/account">Account</Link>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Link href="/contact">Kontakt</Link>
      </MobileNavItem>
      <MobileNavItem onClick={closeMenu}>
        <Typography onClick={() => handleLogout()}>Abmelden</Typography>
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
        <Link href="/contact">Kontakt</Link>
      </NavItem>
      <NavItem>
        <Link href="/login">Anmelden</Link>
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
        <Link href="/contact">Kontakt</Link>
      </NavItem>
      <NavItem>
        <Link href="/dashboard">Dashboard</Link>
      </NavItem>
      <NavItem>
        <DropDown label={currentUser?.email || 'Account'}>
          <Box position="relative">
            <Link href="/account">
              <DropDownItem>
                <UserCircle
                  style={{width: '1em', marginRight: spacing.scale100}}
                />
                Account
              </DropDownItem>
            </Link>
            <Typography onClick={handleLogout}>
              <DropDownItem>
                <Logout style={{width: '1em', marginRight: spacing.scale100}} />
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
          <IcruitingLogo
            style={{width: '110px', height: 'auto', marginBottom: -10}}
          />
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
