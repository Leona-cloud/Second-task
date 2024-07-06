import {config} from 'dotenv'

config();


export const manualEnvironment = process.env.MANUAL_ENVIRONMENT;
export const frontendDevOrigin = [/^http:\/\/localhost:\d+$/];

export const isProduction: boolean = process.env.NODE_ENV === 'production';
export const port: number = parseInt(process.env.PORT ?? '9000');
export const allowedDomains =
  process.env.ALLOWED_DOMAINS && process.env.ALLOWED_DOMAINS.split(',');

  export const expiresIn: string = process.env.expiresIn;
  export const jwtSecret: string = process.env.jwtSecret;