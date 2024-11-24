import Tag from './Tag'
import Indicator from './IndicatorList'
import Coin from './Coin'

export default interface Strategy {
    id?: number
    name: string
    base_currency: number
    coins: Coin[]
    tags?: Tag[]
    indicators?: Indicator[]
    description?: string
}

