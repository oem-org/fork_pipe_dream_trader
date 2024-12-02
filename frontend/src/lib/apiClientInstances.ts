import TokenResponse from "../interfaces/responses/TokenResponse"
import ApiClientService from "./services/ApiClientService"
import CreateUserResponse from "../interfaces/responses/CreateUserResponse"
import CreateUserFormRequest from "../interfaces/requests/CreateUserFormRequest"
import Strategy from "../interfaces/Strategy"
import IndicatorRequest from "../interfaces/requests/IndicatorRequest"
import Indicator from "../interfaces/Indicator"
import { PostService, GetAllService } from "./services/ApiService"
import UploadFileRequest from "../interfaces/requests/UploadFileRequest"
// Class for GET requests

const storedToken = localStorage.getItem('user');
const token = storedToken ? JSON.parse(storedToken) : null;


const csvHeader = {
	'Content-Type': 'test/csv',
};

const jsonHeader = {
	'Content-Type': 'application/json',
};


const formDataHeader = {
	'Content-Type': 'application/x-www-form-urlencoded',
};



//Auth
export const authUserApi = new PostService<FormData, TokenResponse>('auth/token', formDataHeader)
export const createUserApi = new PostService<CreateUserFormRequest, CreateUserResponse>('auth', jsonHeader)


// Indicators
export const getAllIndicatorsApi = new GetAllService<Indicator>('indicators', jsonHeader)
export const postIndicatorApi = new PostService<IndicatorRequest, void>('indicators', jsonHeader)

//Currency Pairs
export const getAllPairsDbApi = new GetAllService<Strategy>('strategy', jsonHeader)

//Strategy
export const getAllStrategiesApi = new GetAllService<Strategy>('strategy', jsonHeader)

//Upload files
export const jsonFileApi = new PostService<FormData, any>('files/save', jsonHeader)
export const csvFileApi = new PostService<FormData, any>('files/save', csvHeader)
