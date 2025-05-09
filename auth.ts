import fs from 'fs/promises';
import path from 'path';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as dotenv from 'dotenv';
dotenv.config();

const CREDENTIALS_PATH = path.join('/Users/rajatvarma/Documents/googlecalendartsmcp/credentials.json');
const TOKEN_PATH = path.join('/Users/rajatvarma/Documents/googlecalendartsmcp/token.json');

/**
 * Load OAuth2 client from saved credentials and token.
 */
export async function getAuthClient(): Promise<OAuth2Client> {
  // const credentialsJson = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  // const credentials = JSON.parse(credentialsJson);
  // const { client_id, client_secret, redirect_uris } = credentials.web;
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uris = [process.env.REDIRECT_URI];
  // const refresh_token = process.env.REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // const tokenJson = await fs.readFile(TOKEN_PATH, 'utf-8');
  // const token = JSON.parse(tokenJson);
  const credentials = {
    refresh_token: process.env.REFRESH_TOKEN
  };
  oAuth2Client.setCredentials(credentials);

  return oAuth2Client;
}
