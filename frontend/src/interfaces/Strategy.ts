import Indicator from './Indicator'
import Pair from './Pair'

export default interface Strategy {
    id: number
    name: string
    description: string
    pair: Pair
    indicators?: Indicator[]
}

