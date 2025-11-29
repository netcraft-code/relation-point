import { ActionIcon, AppShell, AppShellSection, Box, Burger, Card, Group, MantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import navigationConfig from '@/configs/navigation.config';
import AuthorityCheck from '@/route/AuthorityCheck';
import { LinksGroup } from '@/components/Layout/LinksGroup';
import { Link, useNavigate } from 'react-router-dom';
import classes from '@/components/Layout/LayoutTypes/SimpleSideBar.module.css';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { useTranslation } from 'react-i18next';
import { MantineLogo } from '@mantinex/mantine-logo';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

import Views from '@/components/Layout/Views';
import App from '@/App';
import CollapsibleAppShellBottomContent from '@/components/Layout/LayoutTypes/CollapsibleAppShellBottomContent';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
interface CollapsibleAppShellProps {
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
}
export default function CollapsibleAppShell({ colorScheme, toggleColorScheme }: CollapsibleAppShellProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const userAuthority = useAppSelector((state) => state.auth.user.role);
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    setActive(currentPath);
  }, [location.pathname]);

  const links = navigationConfig.map((item, index) => {
    let links = [];

    if (item.subMenu && item.subMenu.length > 0) {
      links = item.subMenu.map((i) => ({
        label: i.title,
        link: i.path,
        authority: i.authority,
      }));
      const isAnyLinkActive = links.some((link) => location.pathname.includes(link.link));

      return (
        <AuthorityCheck userAuthority={userAuthority || []} authority={item.authority} key={index}>
          <Box ml={10} my={10}>
            <LinksGroup
              initiallyOpened={isAnyLinkActive}
              icon={item.icon}
              label={item.title}
              links={links}
            />
          </Box>
        </AuthorityCheck>
      );
    } else {
      return (
        <AuthorityCheck userAuthority={userAuthority || []} authority={item.authority} key={index}>
          <Link
            className={classes.link}
            data-active={item.path.split('/')[1] === active ? 'true' : undefined}
            to={item.path}
            onClick={(event) => {
              event.preventDefault();
              setActive(item.path.split('/')[1]);
              navigate(item.path);
            }}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.translateKey ? t(item.translateKey) : item.title}</span>
          </Link>
        </AuthorityCheck>
      );
    }
  });

  return (
    <AppShell

      styles={(theme: MantineTheme) => ({
        main: {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
          color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
        },
        header: {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
        },
        navbar: {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
        },
      })}
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: {
          mobile: !mobileOpened,
          desktop: !desktopOpened,
        },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          {/* Left side: burger + logo */}
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>RelationPoint</div>
          </Group>

          {/* Right side: dark mode toggle */}
          <ActionIcon
            variant="outline"
            color={colorScheme === 'dark' ? 'yellow' : 'blue'}
            onClick={toggleColorScheme}
            title="Toggle dark/light mode"
            style={{ marginLeft: 'auto' }} // Push to right
          >
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow>{links}</AppShell.Section>
        <AppShell.Section>
          <CollapsibleAppShellBottomContent />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <div
          // styles={(theme:MantineTheme) => ({
          //   root: {
          //     padding: '2rem',
          //     backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
          //     color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
          //     flex: 1,
          //     overflow: 'hidden',
          //     display: 'flex',
          //     flexDirection: 'column',
          //     height: '100%',
          //   },
          // })}
        >
          <Views />
        </div>

      </AppShell.Main>

    </AppShell>
  );
}
