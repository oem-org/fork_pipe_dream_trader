import User from "../interfaces/User"
import AuthRequest from "../interfaces/User"
import Token from "../interfaces/Token"
import ApiClient from "./services/ApiClientService"

export const authUserApi = new ApiClient<AuthRequest, Token>('auth/token/')
export const creatUserApi = new ApiClient<User, Token>('auth/')
