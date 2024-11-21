
import Coin from "../models/Coin"
import GridItem from "../models/GridItem"
import Indicator from "../models/Indicator"
import IndicatorList from "../models/IndicatorList"
import { PriceResponse } from "../models/PriceResponse"
import Strategy from "../models/Strategy"
import User from "../models/User"
import ApiClient from "./ApiClient"

export const GridItemClient = new ApiClient<GridItem>('grid/grids/')
export const CreateUserClient = new ApiClient<User>('users/create/')
export const StrategiesClient = new ApiClient<Strategy>('strategy/strategies/')
export const IndicatorTypesClient = new ApiClient<IndicatorList>('indicatortypes/')
export const IndicatorClient = new ApiClient<Indicator>('strategy/indicators/')
export const IndicatorStrategyClient = new ApiClient<Indicator[]>('strategy/indicators')
export const PricesClient = new ApiClient<PriceResponse>('prices') // using params
export const CoinClient = new ApiClient<Coin>('coins/')
export const CoinClientNoParam = new ApiClient<Coin>('coins')
