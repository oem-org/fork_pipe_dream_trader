import { useState } from "react";
import StrategyList from "./strategy-list";

export default function CreateStrategyForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [clonedStrategy, setClonedStrategy] = useState(0)
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Strategy Created:", { name, description, clonedStrategy });
	};


	return (
		<form onSubmit={handleSubmit} className="space-y-4">

			<StrategyList setId={setClonedStrategy} />
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
