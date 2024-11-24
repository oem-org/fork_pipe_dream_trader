import TokenResponse from "../interfaces/responses/LoginTokenResponse"
import ApiClientService from "./services/ApiClientService"
import CreateUserResponse from "../interfaces/responses/CreateUserResponse"
import CreateUserFormRequest from "../interfaces/requests/CreateUserFormRequest"

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

export const authUserApi = new ApiClientService<FormData, TokenResponse>('auth/token', formDataHeader)
export const createUserApi = new ApiClientService<CreateUserFormRequest, CreateUserResponse>('auth/', jsonHeader)
