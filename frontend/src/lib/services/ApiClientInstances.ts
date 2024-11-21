import Coin from "src/interfaces/Coin";
import GridItem from "src/interfaces/GridItem";
import Indicator from "src/interfaces/Indicator";
import IndicatorList from "src/interfaces/IndicatorList";
import { PriceResponse } from "src/interfaces/PriceResponse";
import Strategy from "src/interfaces/Strategy";
import User from "src/interfaces/User";
import ApiClient from "./ApiClient";

export const GridItemClient = new ApiClient<GridItem>("grid/grids/");
export const CreateUserClient = new ApiClient<User>("users/create/");
export const StrategiesClient = new ApiClient<Strategy>("strategy/strategies/");
export const IndicatorTypesClient = new ApiClient<IndicatorList>(
  "indicatortypes/"
);
export const IndicatorClient = new ApiClient<Indicator>("strategy/indicators/");
export const IndicatorStrategyClient = new ApiClient<Indicator[]>(
  "strategy/indicators"
);
export const PricesClient = new ApiClient<PriceResponse>("prices"); // using params
export const CoinClient = new ApiClient<Coin>("coins/");
export const CoinClientNoParam = new ApiClient<Coin>("coins");
