
import getFilesQuery from "../../lib/queries/getFilesQuery"
import useFileStore from "../../lib/hooks/useFileStore";
import useStrategyStore from "../../lib/hooks/useStrategyStore";
import File from "../../interfaces/File";
//import { postFileQuery } from "../../lib/queries/postFileQuery";

export default function FileList() {
	const { data } = getFilesQuery();
	const { fileId, setFileId } = useFileStore();
	const { strategyId } = useStrategyStore();
	//const mutateAsyncFile = postFileQuery()

	const addFile = async (file: File, strategyId: number) => {
		console.log(file.id, strategyId);
		// strategyId 0 is when none is selected
		if (typeof file.id === "number" && strategyId === 0) {
			console.log(strategyId, file.name);
			try {
				//const data = await mutateAsyncFile({
				//	kind: file.kind,
				//	settings: file.default_settings,
				//	strategy_fk: strategyId,
				//});
				console.log("Mutation was successful, returned data:", data);
			} catch (error) {
				console.error("Mutation failed with error:", error);
			}
		} else {
			console.log("Error");
		}
	};

	function addSelectFile(file: File, strategyId: number) {
		setFileId(file.id);
		console.log(fileId, "file id");
		console.log(fileId, "file id");
		console.log(fileId, "file id");
		console.log(fileId, "file id");
		console.log(fileId, "file id");
		addFile(file, strategyId);
	}

	return (
		<ul className="list-none p-0">
			{data && data.map(file => (
				<li
					key={file.id}
					className="p-2 cursor-pointer bg-gray-100 border-b border-gray-300 hover:bg-gray-200"
				>
					<div className="flex justify-between items-center w-full">
						<button
							className="text-left text-md font-normal text-black hover:text-blue-500"
							onClick={() => addSelectFile(file, strategyId)}
						>
							{file.name}
						</button>
					</div>

				</li>
			))}
		</ul>
	)
}

