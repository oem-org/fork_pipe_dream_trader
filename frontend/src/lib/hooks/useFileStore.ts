
import { create } from "zustand"
import File from "../../interfaces/File"

interface FileStore {
	files: File[]
	fileId: number
	setFiles: (files: File[]) => void
	setFileId: (id: number) => void
	getById: () => File | null
}

const useFileStore = create<FileStore>((set, get) => ({
	files: [],
	fileId: 0,
	setFiles: (files: File[]) => set(() => ({ files })),
	setFileId: (id: number) => set(() => ({ fileId: id })),

	getById: () => {
		const { files, fileId } = get()
		console.log(`Selected ID: ${fileId}`)
		console.log(`Files: ${JSON.stringify(files)}`)
		const foundFile = files.find((file) => file.id === fileId)
		console.log(`Found file: ${JSON.stringify(foundFile)}`)
		return foundFile || null
	},
}))

export default useFileStore


