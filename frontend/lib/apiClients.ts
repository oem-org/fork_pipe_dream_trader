import Coin from "@/interfaces/Coin"
import GridItem from "@/interfaces/GridItem"
import Indicator from "@/interfaces/Indicator"
import IndicatorList from "@/interfaces/IndicatorList"
import { PriceResponse } from "@/interfaces/responses/PriceResponse"
import Strategy from "@/interfaces/Strategy"
import User from "@/interfaces/User"
import ApiClient from "@/lib/services/ApiClientService"

export const GridItemClient = new ApiClient<GridItem>('grid/grids/')
export const CreateUserClient = new ApiClient<User>('users/create/')
export const StrategiesClient = new ApiClient<Strategy>('strategy/strategies/')
export const IndicatorTypesClient = new ApiClient<IndicatorList>('indicatortypes/')
export const IndicatorClient = new ApiClient<Indicator>('strategy/indicators/')
export const IndicatorStrategyClient = new ApiClient<Indicator[]>('strategy/indicators')
export const PricesClient = new ApiClient<PriceResponse>('prices') // using params
export const CoinClient = new ApiClient<Coin>('coins/')
