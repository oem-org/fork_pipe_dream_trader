import { useState } from "react";
import GenericSelect from "../ui/lists/generic-select";
import getFilesQuery from "@/lib/hooks/react-query/getFilesQuery";
import { File } from "@/interfaces/File";
import { postStrategyApi } from "@/lib/apiClientInstances";
import { useNavigate } from 'react-router-dom';
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";

export default function CreateStrategyForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [fileId, setFileId] = useState<number>(0);
	const { data: dataFiles } = getFilesQuery();
	const { setStrategyId } = useStrategyStore()
	const [errors, setErrors] = useState({
		name: "",
		description: "",
		fileId: "",
	});

	const [touched, setTouched] = useState({
		name: false,
		description: false,
		fileId: false,
	});

	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {
			name: touched.name && !name ? "Strategy name is required" : "",
			description: touched.description && !description ? "Strategy description is required" : "",
			fileId: touched.fileId && !fileId ? "Select a file" : "",
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
		});
		if (!validateForm()) return;

		try {
			const strategy = await postStrategyApi.post({
				name,
				fk_file_id: fileId,
				description,
			});
			setStrategyId(strategy.id)

			navigate(`/strategy/${strategy.id}`);
		}

		catch (error) {
			console.error("Error creating strategy:", error);
		}
	};

	return (<>
		<h2 className="text-2xl font-bold mb-6 text-center">
			Create New Strategy
		</h2>
		<form onSubmit={handleSubmit} className="space-y-4 ">
			<div>
				<GenericSelect<File>
					data={dataFiles || []}
					keyExtractor={(file) => file.id}
					nameExtractor={(file) => file.name}
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
	</>);
}
