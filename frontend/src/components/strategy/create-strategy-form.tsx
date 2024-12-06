import { useState } from "react";
import GenericSelect from "./strategy-list";
import Strategy from "@/interfaces/Strategy";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import getFilesQuery from "@/lib/queries/getFilesQuery";
import File from "@/interfaces/File";
import { postStrategyApi } from "@/lib/apiClientInstances";


//id: number
//name: string
//description: string
//data_source?: JSON
//indicators?: JSON

export default function CreateStrategyForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [clonedStrategy, setClonedStrategyId] = useState(0)
	const [file, setFileId] = useState(0)
	const [dataSourceType, setDataSourceType] = useState(null)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//const data_source = {
		//	type:
		//}
		//postStrategyApi.post({ name, description, data_source })

	};
	const { data: dataStrategies } = getStrategiesQuery();
	const { data: dataFiles } = getFilesQuery();

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h4>Clone an existing strategy</h4>
			<GenericSelect<Strategy>
				data={dataStrategies || []}
				keyExtractor={(strategy) => strategy.id}
				onSelect={(strategy) => {
					setClonedStrategyId(strategy.id);
					console.log(strategy.id, "Selected Strategy ID");
				}}
				renderItem={(strategy) => <span>{strategy.name}</span>}
				title="Select or search"
				searchEnabled={true}
			/>

			<h4>Choose a data source</h4>
			<GenericSelect<File>
				data={dataFiles || []}
				keyExtractor={(file) => file.id}
				onSelect={(file) => {
					setFileId(file.id);
					console.log(file.id, "Selected Strategy ID");
				}}
				renderItem={(file) => <span>{file.name}</span>}
				title="Select or search"
				searchEnabled={true}
			/>
			<div>
				<label htmlFor="name" className="block text-white">Strategy Name</label>
				<input
					type="text"
					id="name"
					name="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter strategy name"
					className="w-full px-4 py-2 mt-2 text-black border rounded-lg"
				/>
			</div>

			<div>
				<label htmlFor="description" className="block text-white">Strategy Description</label>
				<textarea
					id="description"
					name="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Enter strategy description"
					rows="4"
					className="w-full px-4 py-2 mt-2 text-black border rounded-lg"
				/>
			</div>

			<button
				type="submit"
				className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700"
			>
				Create Strategy
			</button>
		</form>
	);
}
