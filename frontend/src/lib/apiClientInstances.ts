import TokenResponse from "../interfaces/responses/TokenResponse"
import ApiClientService from "./services/ApiClientService"
import CreateUserResponse from "../interfaces/responses/CreateUserResponse"
import CreateUserFormRequest from "../interfaces/requests/CreateUserFormRequest"
import Strategy from "../interfaces/Strategy"
import { PostService } from "./services/ApiService"
import UploadFileRequest from "../interfaces/requests/UploadFileRequest"
// Class for GET requests

const storedToken = localStorage.getItem('user');
const token = storedToken ? JSON.parse(storedToken) : null;


const csvHeader = {
	'Content-Type': 'test/csv',
	'Authorization': token?.token ? `Token ${token.token}` : '',
};

const jsonHeader = {
	'Content-Type': 'application/json',
	'Authorization': token?.token ? `Token ${token.token}` : '',
};


const formDataHeader = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization': token?.token ? `Token ${token.token}` : '',
};



//Auth
export const authUserApi = new PostService<FormData, TokenResponse>('auth/token', formDataHeader)
export const createUserApi = new PostService<CreateUserFormRequest, CreateUserResponse>('auth', jsonHeader)


//Strategy
export const strategyApi = new ApiClientService<Strategy, any>('strategy', jsonHeader)

//Upload files
export const jsonFileApi = new PostService<FormData, any>('files/save', jsonHeader)
export const csvFileApi = new PostService<FormData, any>('files/save', csvHeader)
