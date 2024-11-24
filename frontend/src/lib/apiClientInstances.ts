import TokenResponse from "../interfaces/responses/TokenResponse"
import ApiClientService from "./services/ApiClientService"
import CreateUserResponse from "../interfaces/responses/CreateUserResponse"
import CreateUserFormRequest from "../interfaces/requests/CreateUserFormRequest"
import Strategy from "../interfaces/Strategy"
import { PostService } from "./services/ApiService"
// Class for GET requests

const storedToken = localStorage.getItem('user');
const token = storedToken ? JSON.parse(storedToken) : null;

const jsonHeader = {
	'Content-Type': 'application/json',
	'Authorization': token?.token ? `Token ${token.token}` : '',
};


const formDataHeader = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization': token?.token ? `Token ${token.token}` : '',
};



//Auth
//no end / for token endpoint, will throw cors error
export const authUserApi = new PostService<FormData, TokenResponse>('auth/token', formDataHeader)
export const createUserApi = new PostService<CreateUserFormRequest, CreateUserResponse>('auth/', jsonHeader)


//Strategy
export const strategyApi = new ApiClientService<Strategy, any>('auth/', jsonHeader)


