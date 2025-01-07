import { useQuery } from "@tanstack/react-query"
import { getAllFilesApi } from "@/lib/apiClientInstances"
import { File } from "@/interfaces/File"

export default function getFilesQuery() {
	const fetchFiles = async (): Promise<File[] | undefined> => {
		try {
			const files: File[] | undefined = await getAllFilesApi.getAll()
			return files
		} catch (error) {
			//console.error(error)
			throw new Error("Failed to fetch files")
		}
	}


	const { data, error, isError, isLoading } = useQuery<File[] | undefined, Error>({
		queryKey: ["files"],
		queryFn: fetchFiles,
	})

	return { data, error, isError, isLoading }
}

