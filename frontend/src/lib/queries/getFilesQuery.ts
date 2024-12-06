import { useQuery } from "@tanstack/react-query"
import { getAllFilesApi } from "../apiClientInstances"
import File from "../../interfaces/File"

export default function getFilesQuery() {
	const fetchFiles = async (): Promise<File[]> => {
		try {
			const filesData: File[] = await getAllFilesApi.getAll()
			console.log(filesData)
			return filesData
		} catch (error) {
			//console.error(error)
			throw new Error("Failed to fetch files")
		}
	}


	const { data, error, isError, isLoading } = useQuery<File[], Error>({
		queryKey: ["fileList"],
		queryFn: fetchFiles,
	})

	return { data, error, isError, isLoading }
}

