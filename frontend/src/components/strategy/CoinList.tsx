import { NavLink } from 'react-router-dom'

interface Coin {
  id: string
  name: string
}

interface CoinListProps {
  data: Coin[]
}

export default function CoinList({ data }: CoinListProps) {
  return (
    <div className="mt-3 max-h-[300px] lg:h-screen overflow-auto">
      <ul>
        {data?.map((coin) => (
          <li key={coin.id} className="p-4 hover:bg-gray-300">
            <NavLink className="block" to={`/coins/${coin.name}`}>
              {coin.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}