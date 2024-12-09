import { useState } from "react";
import GenericSelect from "../shared/lists/generic-select";
import Strategy from "@/interfaces/Strategy";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import getFilesQuery from "@/lib/queries/getFilesQuery";
import File from "@/interfaces/File";
import { postStrategyApi } from "@/lib/apiClientInstances";
import { useNavigate } from 'react-router-dom';
import { DataSourceEnum } from "@/interfaces/enums/DataSourceEnum";
import { DatabaseDataSourceRequest, FileDataSourceRequest } from "@/interfaces/requests/CreateStrategyRequest";

export default function CreateStrategyForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [clonedStrategy, setClonedStrategyId] = useState<number>(0);
	const [fileId, setFileId] = useState<number>(0);
	const [dataSourceType, setDataSourceType] = useState<DataSourceEnum>(DataSourceEnum.FILE);
	const [databaseOption, setDatabaseOption] = useState("");
	const [errors, setErrors] = useState({
		name: "",
		description: "",
		fileId: "",
		databaseOption: "",
	});
	const [touched, setTouched] = useState({
		name: false,
		description: false,
		fileId: false,
		databaseOption: false,
	});
	const navigate = useNavigate();

	const { data: dataStrategies } = getStrategiesQuery();
	const { data: dataFiles } = getFilesQuery();

	const validateForm = () => {
		const newErrors = {
			name: touched.name && !name ? "Strategy name is required" : "",
			description: touched.description && !description ? "Strategy description is required" : "",
			fileId: touched.fileId && dataSourceType === DataSourceEnum.FILE && !fileId ? "Select a file" : "",
			databaseOption: touched.databaseOption && dataSourceType === DataSourceEnum.DATABASE && !databaseOption
				? "Please enter a database option" : "",
		};
		setErrors(newErrors);
		return Object.values(newErrors).every((error) => error === "");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setTouched({
			name: true,
			description: true,
			fileId: true,
			databaseOption: true,
		});
		if (!validateForm()) return;
		const data_source: FileDataSourceRequest | DatabaseDataSourceRequest =
			dataSourceType === DataSourceEnum.FILE
				? { id: fileId }
				: { table: databaseOption };
		try {
			const strategy = await postStrategyApi.post({
				name,
				description,
				data_source_type: dataSourceType,
				data_source,
			});
			navigate(`/strategy/${strategy.id}`);
		} catch (error) {
			console.error("Error creating strategy:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h4>Clone an existing strategy</h4>
			<GenericSelect<Strategy>
				data={dataStrategies || []}
				keyExtractor={(strategy) => strategy.id}
				onSelect={(strategy) => {
					setClonedStrategyId(strategy.id);
				}}
				renderItem={(strategy) => <span>{strategy.name}</span>}
				title="Select or search"
				searchEnabled={true}
			/>

			<h4>Choose a data source</h4>
			<div className="flex items-center justify-center space-x-4">
				<button
					type="button"
					onClick={() => setDataSourceType(DataSourceEnum.FILE)}
					className={`btn-primary ${dataSourceType === DataSourceEnum.FILE ? "bg-blue-600 text-white" : "btn-secondary"}`}
				>
					File
				</button>
				<button
					type="button"
					onClick={() => setDataSourceType(DataSourceEnum.DATABASE)}
					className={`btn-primary ${dataSourceType === DataSourceEnum.DATABASE ? "bg-blue-600 text-white" : "btn-secondary"}`}
				>
					Database
				</button>
			</div>

			{dataSourceType === DataSourceEnum.FILE ? (
				<div>
					<GenericSelect<File>
						data={dataFiles || []}
						keyExtractor={(file) => file.id}
						onSelect={(file) => {
							setFileId(file.id);
							setTouched((prev) => ({ ...prev, fileId: true }));
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
						onBlur={() => {
							setTouched((prev) => ({ ...prev, databaseOption: true }));
							validateForm();
						}}
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
					onBlur={() => {
						setTouched((prev) => ({ ...prev, name: true }));
						validateForm();
					}}
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
					onBlur={() => {
						setTouched((prev) => ({ ...prev, description: true }));
						validateForm();
					}}
					placeholder="Enter strategy description"
					rows={4}
					className="textarea-field"
				/>
				{errors.description && <p className="text-error">{errors.description}</p>}
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
