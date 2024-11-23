import LoginFormRequest from "../interfaces/requests/LoginFormRequest"
import Token from "../interfaces/Token"
import ApiClientService from "./services/ApiClientService"
import CreateUserResponse from "../interfaces/responses/CreateUserResponse"
import CreateUserFormRequest from "../interfaces/requests/CreateUserFormRequest"

export const authUserApi = new ApiClientService<LoginFormRequest, Token>('auth/token/')
export const createUserApi = new ApiClientService<CreateUserFormRequest, CreateUserResponse>('auth/')
