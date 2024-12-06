import { useState } from "react";
import GenericSelect from "./strategy-list";
import Strategy from "@/interfaces/Strategy";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import getFilesQuery from "@/lib/queries/getFilesQuery";
import File from "@/interfaces/File";
import { postStrategyApi } from "@/lib/apiClientInstances";

type DataSourceType = "file" | "database";

export default function CreateStrategyForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [clonedStrategy, setClonedStrategyId] = useState<number>(0);
	const [fileId, setFileId] = useState<number>(0);
	const [dataSourceType, setDataSourceType] = useState<DataSourceType>("file"); // Default to file
	const [databaseOption, setDatabaseOption] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (dataSourceType === 'file') {
			const data_source = { type: dataSourceType, id: fileId }
			postStrategyApi.post({ name, description, data_source: data_source });

		} else if (dataSourceType === 'database') {
			const data_source = { type: dataSourceType, table: "bin1s" }
			postStrategyApi.post({ name, description, data_source: data_source });
		}

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

			<div className="flex items-center justify-center space-x-4">
				<button
					type="button"
					onClick={() => setDataSourceType("file")}
					className={`px-4 py-2 rounded-lg ${dataSourceType === "file" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
						}`}
				>
					File
				</button>
				<button
					type="button"
					onClick={() => setDataSourceType("database")}
					className={`px-4 py-2 rounded-lg ${dataSourceType === "database" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
						}`}
				>
					Database
				</button>
			</div>

			{dataSourceType === "file" ? (
				<GenericSelect<File>
					data={dataFiles || []}
					keyExtractor={(file) => file.id}
					onSelect={(file) => {
						setFileId(file.id);
						console.log(file.id, "Selected File ID");
					}}
					renderItem={(file) => <span>{file.name}</span>}
					title="Select or search a file"
					searchEnabled={true}
				/>
			) : (
				<div>
					<label htmlFor="databaseOption" className="block text-white">Select Database</label>
					<input
						type="text"
						id="databaseOption"
						name="databaseOption"
						value={databaseOption}
						onChange={(e) => setDatabaseOption(e.target.value)}
						placeholder="Enter database option"
						className="w-full px-4 py-2 mt-2 text-black border rounded-lg"
					/>
				</div>
			)}

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
					rows={4}
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
