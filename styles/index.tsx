import { css } from '@emotion/css'

export const color = {
  primary: '#333333',
  secondary: '#CBA4A0',
  white: '#fff',
  subColor: {
    blue: '#88D9F4',
    red: '#F2464A',
    green: '#80C067',
    dark: '#333333',
    yellow: '#FFE923',
    orange: '#FF9F2E',
  },
  background: {
    bague: '#F5F5F5',
    dark: '#333',
    white: '#fff',
    blue: '#EDF2F5',
  },
  utils: {
    error: '#FF3B30',
    link: '#007AFF',
  },
  content: {
    dark: 'rgba(0,0,0,.82)',
    middle: 'rgba(0,0,0,.54)',
    light: 'rgba(0, 0, 0, 0.14)',
    superLight: 'rgba(0, 0, 0, 0.08);',
    gray1: '#BDBDBD',
    gray2: '#EBEBEB',
    white: '#ffffff',
  },
  active: 'linear-gradient(180deg, #FD80A8 0%, #FCCF42 100%);',
} as const

export const font = {
  inter: {
    h1: 'font-family: Inter, sans-serif; font-weight: 600; font-size: 48px; line-height: 1.3;',
    h2: 'font-family: Inter, sans-serif; font-weight: 600; font-size: 32px; line-height: 1.3;',
    h3: 'font-family: Inter, sans-serif; font-weight: 600; font-size: 20px; line-height: 1.3;',
    h4: 'font-family: Inter, sans-serif; font-weight: 600; font-size: 18px; line-height: 1.3;',
    subtitle1:
      'font-family: Inter, sans-serif; font-weight: 600; font-size: 16px; line-height: 1.3;',
    subtitle2:
      'font-family: Inter, sans-serif; font-weight: 600; font-size: 14px; line-height: 1.3;',
    body1: 'font-family: Inter, sans-serif; font-weight: 500; font-size: 16px; line-height: 1.3;',
    body2: 'font-family: Inter, sans-serif; font-weight: 500; font-size: 14px; line-height: 1.3;',
    article1:
      'font-family: Inter, sans-serif; font-weight: 500; font-size: 16px; line-height: 2.0;',
    article2:
      'font-family: Inter, sans-serif; font-weight: 500; font-size: 14px; line-height: 2.0;',
    button: 'font-family: Inter, sans-serif; font-weight: 700; font-size: 14px; line-height: 1.5;',
    caption: 'font-family: Inter, sans-serif; font-weight: 400; font-size: 12px; line-height: 1.5;',
    label: 'font-family: Inter, sans-serif; font-weight: 600; font-size: 12px; line-height: 1.5;',
    overline:
      'font-family: Inter, sans-serif; font-weight: 400; font-size: 10px; line-height: 1.5;',
    unit: 'font-family: Inter, sans-serif; font-weight: 700; font-size: 10px; line-height: 1.3;',
  },
  courier: {
    h1: 'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 48px; line-height: 1.3;',
    h2: 'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 32px; line-height: 1.3;',
    h3: 'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 20px; line-height: 1.3;',
    h4: 'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 18px; line-height: 1.3;',
    subtitle1:
      'font-family: Courier Prime, monospace, serif; font-weight: 700; font-size: 16px; line-height: 1.3;',
    subtitle2:
      'font-family: Courier Prime, monospace, serif; font-weight: 700; font-size: 14px; line-height: 1.3;',
    body1:
      'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 16px; line-height: 1.3;',
    body2:
      'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 14px; line-height: 1.3;',
    article1:
      'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 16px; line-height: 2.0;',
    article2:
      'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 14px; line-height: 2.0;',
    button:
      'font-family: Courier Prime, monospace, serif; font-weight: 700; font-size: 14px; line-height: 1.5;',
    caption:
      'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 12px; line-height: 1.5;',
    label:
      'font-family: Courier Prime, monospace, serif; font-weight: 700; font-size: 12px; line-height: 1.5;',
    overline:
      'font-family: Courier Prime, monospace, serif; font-weight: 400; font-size: 10px; line-height: 1.5;',
    unit: 'font-family: Courier Prime, monospace, serif; font-weight: 700; font-size: 10px; line-height: 1.3;',
  },
} as const

export const media = {
  lg: '@media (min-width: 1040px)',
  md: '@media (min-width: 480px) and (max-width: 1039px)',
  mdsp: '@media (max-width: 1039px) ',
  sp: '@media (max-width: 479px)',
}

export const curve = {
  button: 'transition: all .1s 0s ease-out;',
  card: 'transition: all .3s 0s ease-out;',
  fade: 'transition: all .6s 0s ease-out;',
} as const

export const zIndex = {
  base: 0,
  default: 1,
  header: 10,
  loader: 15,
  behind: -1,
  back: -2,
} as const
