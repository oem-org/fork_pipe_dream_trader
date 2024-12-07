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
	const [dataSourceType, setDataSourceType] = useState<DataSourceType>("file");
	const [databaseOption, setDatabaseOption] = useState("");

	const [errors, setErrors] = useState({
		name: "",
		description: "",
		fileId: "",
		databaseOption: "",
	});

	const validateForm = () => {
		const newErrors = {
			name: name ? "" : "Strategy name is required",
			description: description ? "" : "Strategy description is required",
			fileId: dataSourceType === "file" && !fileId ? "Select a file" : "",
			databaseOption: dataSourceType === "database" && !databaseOption
				? "Please enter a database option" : "",
		};
		setErrors(newErrors);

		return Object.values(newErrors).every((error) => error === "");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validateForm()) return;

		const data_source = dataSourceType === "file"
			? { type: dataSourceType, id: fileId }
			: { type: dataSourceType, table: "bin1s" };

		const strategy = await postStrategyApi.post({ name, description, data_source: data_source });
		console.log(strategy.id)
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
					className={`btn-primary ${dataSourceType === "file" ? "bg-blue-600 text-white" : "btn-secondary"}`}
				>
					File
				</button>
				<button
					type="button"
					onClick={() => setDataSourceType("database")}
					className={`btn-primary ${dataSourceType === "database" ? "bg-blue-600 text-white" : "btn-secondary"}`}
				>
					Database
				</button>
			</div>

			{dataSourceType === "file" ? (
				<div>
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
					{errors.fileId && <p className="text-error">{errors.fileId}</p>}
				</div>
			) : (
				<div>
					<label htmlFor="databaseOption" className="text-white-label">Select Database</label>
					<input
						type="text"
						id="databaseOption"
						name="databaseOption"
						value={databaseOption}
						onChange={(e) => setDatabaseOption(e.target.value)}
						placeholder="Enter database option"
						className="input-field"
					/>
					{errors.databaseOption && <p className="text-error">{errors.databaseOption}</p>}
				</div>
			)}

			<div>
				<label htmlFor="name" className="text-white-label">Strategy Name</label>
				<input
					type="text"
					id="name"
					name="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter strategy name"
					className="input-field"
				/>
				{errors.name && <p className="text-error">{errors.name}</p>}
			</div>

			<div>
				<label htmlFor="description" className="text-white-label">Strategy Description</label>
				<textarea
					id="description"
					name="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Enter strategy description"
					rows={4}
					className="textarea-field"
				/>
			</div>

			<button
				type="submit"
				className="btn-primary w-full mt-4"
			>
				Create Strategy
			</button>
		</form>
	);
}
