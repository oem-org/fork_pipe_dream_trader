import TokenResponse from "../interfaces/responses/TokenResponse"
// import ApiClientService from "./services/ApiClientService"
import CreateUserResponse from "../interfaces/responses/CreateUserResponse"
import CreateUserFormRequest from "../interfaces/requests/CreateUserFormRequest"
import { Strategy } from "../interfaces/Strategy"
import IndicatorRequest from "@/interfaces/requests/UpdateIndicatorRequest"
import Indicator from "../interfaces/Indicator"
import { StrategyCondition } from "@/interfaces/StrategyCondition"
import { File, FileResponse } from "@/interfaces/File"
import { PostRelationService, PutService, GetService, GetLatestRelationService,  PostService, DeleteRelationService, PutRelationService, GetAllService, DeleteService, GetWithParamsService, GetWithQueryService, GetAllRelationService, } from "./services/ApiService"

import { StrategyIndicator } from "@/interfaces/StrategyIndicator"
import { CreateStrategyRequest } from "@/interfaces/requests/CreateStrategyRequest"
import { CreateBacktestRequest } from "@/interfaces/Backtest"
import { BacktestResponse, Backtest } from "@/interfaces/Backtest"

// Inspired by earlier work
//https://github.com/JeppeOEM/dashboard_frontend_exam/blob/main/src/services/ApiClientInstances.ts

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
export const getAllIndicatorsApi = new GetAllService<Indicator>('indicators', {})
export const postIndicatorNames = new PostService<IndicatorRequest, void>('indicators/chart', jsonHeader)

// StrategyConditions
export const getAllStrategyConditionsApi = new GetAllRelationService<StrategyCondition>('strategy', {}, 'condition')
export const postStrategyConditionsApi = new PostRelationService<Record<string, any>, any>('strategy', jsonHeader, 'condition')
export const deleteStrategyConditionApi = new DeleteRelationService('strategy', jsonHeader, 'condition')
export const putStrategyConditionsApi = new PutRelationService('strategy', jsonHeader, 'condition')

// StrategyIndicators
export const getStrategyIndicatorsApi = new GetAllRelationService<StrategyIndicator>('strategy', {}, 'indicator')
export const postStrategyIndicatorsApi = new PostRelationService<Record<string, any>, any>('strategy', jsonHeader, 'indicator')
export const deleteStrategyIndicatorsApi = new DeleteRelationService('strategy', jsonHeader, 'indicator')
export const putStrategyIndicatorsApi = new PutRelationService<Record<string, any>, StrategyIndicator>('strategy', jsonHeader, 'indicator')

//Strategy
export const getAllStrategiesApi = new GetAllService<Strategy>('strategy', {})
export const getStrategyApi = new GetWithParamsService<number, Strategy>('strategy', {})
export const postStrategyApi = new PostService<CreateStrategyRequest, Strategy>('strategy', jsonHeader)
export const putStrategyApi = new PutService<Strategy, Strategy>('strategy', jsonHeader)
export const deleteStrategyApi = new DeleteService<number>('strategy', jsonHeader)

//Backtest
export const postStrategyBacktestApi = new PostRelationService<CreateBacktestRequest, Backtest>('strategy', jsonHeader, "backtest")
export const getAllStrategyBacktestsApi = new GetAllRelationService<BacktestResponse>('strategy', {}, "backtest")
export const getLatestStrategyBacktestsApi = new GetLatestRelationService<Backtest>('strategy', {}, "backtest")

//Timeseries
export const getTimeseriesApi = new GetWithQueryService<Record<string, any>>('timeseries', {})

//Files
export const getAllFilesApi = new GetAllService<File>('file', {})
export const getFileApi = new GetService<FileResponse>('file', {})
export const jsonFileApi = new PostService<FormData, any>('file/save', jsonHeader)
export const csvFileApi = new PostService<FormData, any>('file/save', csvHeader)
