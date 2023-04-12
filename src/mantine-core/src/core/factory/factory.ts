import { forwardRef } from 'react';
import type { MantineTheme, MantineThemeComponent } from '../MantineProvider';

export type DataAttributes = Record<`data-${string}`, any>;

export interface FactoryPayload {
  props: Record<string, any>;
  ctx?: any;
  ref?: any;
  stylesNames?: string;
  vars?: string;
  variant?: string;
  staticComponents?: Record<string, any>;
}

export type ExtendStyles<
  StylesNames extends string,
  Props extends Record<string, any>,
  Context = unknown
> =
  | Partial<Record<StylesNames, React.CSSProperties>>
  | ((
      theme: MantineTheme,
      props: Props,
      ctx: Context
    ) => Partial<Record<StylesNames, React.CSSProperties>>);

export type ExtendVars<Vars extends string, Props extends Record<string, any>, Context = unknown> =
  | Partial<Record<Vars, string>>
  | ((theme: MantineTheme, props: Props, ctx: Context) => Partial<Record<Vars, string>>);

export interface ExtendComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload['props']> & DataAttributes;
  classNames?: Payload['stylesNames'] extends string
    ? Partial<Record<Payload['stylesNames'], string>>
    : never;
  styles?: Payload['stylesNames'] extends string
    ? ExtendStyles<Payload['stylesNames'], Payload['props'], Payload['ctx']>
    : never;
  vars?: Payload['vars'] extends string
    ? ExtendVars<Payload['vars'], Payload['props'], Payload['ctx']>
    : never;
}

export type StaticComponents<Input> = Input extends Record<string, any>
  ? Input
  : Record<string, never>;

export interface ThemeExtend<Payload extends FactoryPayload> {
  extend: (input: ExtendComponent<Payload>) => MantineThemeComponent;
}

export type MantineComponent<Payload extends FactoryPayload> = React.ForwardRefExoticComponent<
  Payload['props'] & React.RefAttributes<Payload['ref']>
> &
  ThemeExtend<Payload> &
  StaticComponents<Payload['staticComponents']>;

export function identity<T>(value: T): T {
  return value;
}

export function factory<Payload extends FactoryPayload>(
  ui: React.ForwardRefRenderFunction<Payload['ref'], Payload['props']>
) {
  const Component = forwardRef(ui) as MantineComponent<Payload>;

  Component.extend = identity as any;

  return Component as MantineComponent<Payload>;
}
