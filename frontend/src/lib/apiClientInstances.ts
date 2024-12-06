import TokenResponse from "../interfaces/responses/TokenResponse"
// import ApiClientService from "./services/ApiClientService"
import CreateUserResponse from "../interfaces/responses/CreateUserResponse"
import CreateUserFormRequest from "../interfaces/requests/CreateUserFormRequest"
import Strategy from "../interfaces/Strategy"
import IndicatorRequest from "@/interfaces/requests/UpdateIndicatorRequest"
import Indicator from "../interfaces/Indicator"
import File from "@/interfaces/File"
import { PostService, GetAllService } from "./services/ApiService"
// import UploadFileRequest from "../interfaces/requests/UploadFileRequest"
// Class for GET requests



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

export const postStrategyApi = new PostService<Strategy, any>('strategy', jsonHeader)


//Files
export const getAllFilesApi = new GetAllService<File>('files', jsonHeader)
export const jsonFileApi = new PostService<FormData, any>('files/save', jsonHeader)
export const csvFileApi = new PostService<FormData, any>('files/save', csvHeader)
