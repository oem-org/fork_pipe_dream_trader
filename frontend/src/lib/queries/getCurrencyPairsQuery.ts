
import { useQuery } from "@tanstack/react-query"
import { getAllPairsDbApi } from "../apiClientInstances"
//import Strategy from "../models/Strategy"
import Pair from "@/interfaces/Pair"
// import {GridItemClass} from "../models/GridItem"

const getPairsDbQuery = () => {
	const fetchPairs = async (): Promise<Pair[]> => {

		const coinData: Pair[] = await getAllPairsDbApi.getAll()

		return coinData
	}

	return useQuery<Pair[], Error>({
		queryKey: ["coins"],
		queryFn: fetchPairs,
	})
}

export default getPairsDbQuery
