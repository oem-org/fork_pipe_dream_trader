
import { create } from "zustand"

interface FileStore {
	fileId: number | undefined
	setFileId: (id: number | undefined) => void
}

const useFileStore = create<FileStore>((set) => ({
	fileId: 0,
	setFileId: (id: number | undefined) => set(() => ({ fileId: id })),

}))

export default useFileStore


