import TokenResponse from "../interfaces/responses/TokenResponse"
// import ApiClientService from "./services/ApiClientService"
import CreateUserResponse from "../interfaces/responses/CreateUserResponse"
import CreateUserFormRequest from "../interfaces/requests/CreateUserFormRequest"
import { Strategy } from "../interfaces/Strategy"
import IndicatorRequest from "@/interfaces/requests/UpdateIndicatorRequest"
import Indicator from "../interfaces/Indicator"
import File from "@/interfaces/File"
import { PostRelationService, PutService, PostService, DeleteRelationService, PutRelationService, GetAllService, DeleteService, GetWithParamsService, GetWithQueryService, GetAllRelationService, } from "./services/ApiService"

import { StrategyIndicator, UpdateStrategyIndicatorRequest } from "@/interfaces/StrategyIndicator"
import { CreateStrategyRequest } from "@/interfaces/requests/CreateStrategyRequest"

const csvHeader = {
	'Content-Type': 'test/csv',
};

const jsonHeader = {
	'Content-Type': 'application/json',
};


const formDataHeader = {
	'Content-Type': 'application/x-www-form-urlencoded',
};


export const post = new PostService<any, any>("strategy", jsonHeader)

//Auth
export const authUserApi = new PostService<FormData, TokenResponse>('auth/token', formDataHeader)
export const createUserApi = new PostService<CreateUserFormRequest, CreateUserResponse>('auth', jsonHeader)

// Indicators
export const getAllIndicatorsApi = new GetAllService<Indicator>('indicators', {})
export const postIndicatorNames = new PostService<IndicatorRequest, void>('indicators/chart', jsonHeader)



// StrategyIndicators
export const getStrategyIndicatorsApi = new GetAllRelationService<StrategyIndicator>('strategy', jsonHeader, 'indicator')
export const postStrategyIndicatorsApi = new PostRelationService<Record<string, any>, any>('strategy', jsonHeader, 'indicator')

export const deleteStrategyIndicatorsApi = new DeleteRelationService('strategy', jsonHeader, 'indicator')


export const putStrategyIndicatorsApi = new PutRelationService<Record<string, any>, StrategyIndicator>('strategy', jsonHeader, 'indicator')
//Strategy
export const getAllStrategiesApi = new GetAllService<Strategy>('strategy', {})
export const getStrategyApi = new GetWithParamsService<number, Strategy>('strategy', {})
export const postStrategyApi = new PostService<CreateStrategyRequest, Strategy>('strategy', jsonHeader)
export const putStrategyApi = new PutService<Strategy, Strategy>('strategy', jsonHeader)
export const deleteStrategyApi = new DeleteService<number>('strategy', jsonHeader)




//Timeseries
export const getTimeseriesApi = new GetWithQueryService<Record<string, any>>('timeseries', {})

//Files
export const getAllFilesApi = new GetAllService<File>('files', {})
export const jsonFileApi = new PostService<FormData, any>('files/save', jsonHeader)
export const csvFileApi = new PostService<FormData, any>('files/save', csvHeader)
