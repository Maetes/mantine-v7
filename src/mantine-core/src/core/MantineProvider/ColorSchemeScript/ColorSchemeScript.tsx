import React from 'react';
import type { MantineColorScheme } from '../theme.types';

export interface ColorSchemeScriptProps extends React.ComponentPropsWithoutRef<'script'> {
  forceColorScheme?: 'light' | 'dark';
  defaultColorScheme?: MantineColorScheme;
  localStorageKey?: string;
}

const getScript = ({
  defaultColorScheme,
  localStorageKey,
  forceColorScheme,
}: Pick<ColorSchemeScriptProps, 'defaultColorScheme' | 'localStorageKey' | 'forceColorScheme'>) =>
  forceColorScheme
    ? `document.documentElement.setAttribute("data-mantine-color-scheme", '${forceColorScheme}');`
    : `try {
  var colorScheme = window.localStorage.getItem("${localStorageKey}") || "${defaultColorScheme}";
  var computedColorScheme = colorScheme !== "auto" ? colorScheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-mantine-color-scheme", computedColorScheme);
} catch (e) {}
`;

export function ColorSchemeScript({
  defaultColorScheme = 'auto',
  localStorageKey = 'mantine-color-scheme',
  forceColorScheme,
  ...others
}: ColorSchemeScriptProps) {
  return (
    <script
      {...others}
      data-mantine-script
      dangerouslySetInnerHTML={{
        __html: getScript({ defaultColorScheme, localStorageKey, forceColorScheme }),
      }}
    />
  );
}
