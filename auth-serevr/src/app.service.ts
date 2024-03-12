import { Injectable } from '@nestjs/common';
import * as queryString from 'querystring';
import axios from "axios";
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppService {

  config = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUrl: process.env.REDIRECT_URL,
    clientUrl: process.env.CLIENT_URL,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: 36000,
    postUrl: 'https://jsonplaceholder.typicode.com/posts',
  }
  constructor(
    public jwtService: JwtService
  ) { }
  getHello(): string {
    return 'Hello World!';
  }
  
  generateUrl() {
    const authParams = queryString.stringify({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUrl,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      state: 'standard_oauth',
      prompt: 'consent',
    })
    // console.log(`${this.config.authUrl}?${authParams}`)
    return{
      url: `${this.config.authUrl}?${authParams}`,
    };
  }

  async generateToken(req) {
    try {
      const { code } = req.query
      console.log(code);
      // Get all parameters needed to hit authorization server
      const tokenParam = queryString.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUrl,
      })
      // Exchange authorization code for access token (id token is returned here too)
      const {
        data: { id_token },
      } = await axios.post(`${this.config.tokenUrl}?${tokenParam}`)
      if (!id_token) {
        return {
          status: 400,
          message: 'Invalid token'
        }
      }
      // // Get user info from id token
      console.log('token----------->',id_token,'----------->');
      
      const { email, name, picture } = this.jwtService.decode(id_token)
      const user = { name, email, picture }
      // Sign a new token
      const token = jwt.sign({ user }, this.config.tokenSecret, { expiresIn: this.config.tokenExpiration })
      // Set cookies for user
      // console.log(token);
      
      return {
        "token":token
      }
    } catch (err) {
      console.error('Error: ', err)
      // res.status(500).json({ message: err.message || 'Server error' })
    }
  }
  async login(req) {
    if(!req.headers.token){
      return {
        status:400,
        statusCode:"Token required"
      }
    }
    const token = req.headers.token;
    const data = jwt.decode(token)
    return data;
  }
  async dashboard(req) {
    if(!req.headers.token){
      return {
        status:400,
        statusCode:"Token required"
      }
    }
    const token = req.headers.token;
    const data = jwt.decode(token)
    return data;
  }
}
