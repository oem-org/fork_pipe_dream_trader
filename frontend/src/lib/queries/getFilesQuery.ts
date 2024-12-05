import { useQuery } from "@tanstack/react-query"
import { getAllFilesApi } from "../apiClientInstances"
import File from "../../interfaces/File"

export default function getFilesQuery() {
	const fetchFiles = async (): Promise<File[]> => {
		try {
			const indicatorsData: File[] = await getAllFilesApi.getAll()
			console.log(indicatorsData)
			return indicatorsData
		} catch (error) {
			//console.error(error)
			throw new Error("Failed to fetch indicators")
		}
	}


	const { data, error, isError, isLoading } = useQuery<File[], Error>({
		queryKey: ["indicatorList"],
		queryFn: fetchFiles,
	})

	return { data, error, isError, isLoading }
}

