

import { useQuery } from "@tanstack/react-query"
import { getFileApi } from "../apiClientInstances"
import { FileResponse } from "@/interfaces/File"

export default function getFileQuery(id: number) {
	const fetchFile = async (): Promise<FileResponse> => {
		try {
			const file = await getFileApi.get(id)
			return file
		} catch (error) {
			throw new Error("Failed to fetch file")
		}
	}


	const { data, error, isError, isLoading, refetch } = useQuery<FileResponse, Error>({
		// refetch when id changes
		queryKey: ["file", id],
		queryFn: fetchFile,
	})

	return { data, error, isError, isLoading, refetch }
}

