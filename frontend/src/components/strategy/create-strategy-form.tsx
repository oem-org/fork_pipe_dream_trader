import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function SaveStrategy() {
	type Strategy = {
		name: string;
		description: string;
		fk_user_id: number;
		fk_pair_id: number;
	};

	//type ResponseData = {
	//	id: number;
	//	name: string;
	//	description: string;
	//	priority: number;
	//	fk_user_id: number;
	//	fk_pair_id: number;
	//};

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [fk_user_id, setFkUserId] = useState<number | "">("");
	const [fk_pair_id, setFkPairId] = useState<number | "">("");

	const mutation = useMutation((newStrategy: Strategy) =>
		axios.post("http://localhost:8000/strategy", newStrategy), // Replace with your actual backend endpoint
	);

	const submitData = () => {
		if (priority === "" || fk_user_id === "" || fk_pair_id === "") {
			alert("Please fill in all fields.");
			return;
		}
		mutation.mutate({
			name,
			description,
			priority: Number(priority),
		});
	};

	return (
		<div>
			<h1>Create a New Strategy</h1>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Name"
			/>
			<input
				type="text"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description"
			/>



			<button onClick={submitData} disabled={mutation.isLoading}>
				{mutation.isLoading ? "Submitting..." : "Submit"}
			</button>
			{mutation.isError && (
				<div style={{ color: "red" }}>
					Error: {mutation.error?.response?.data?.message || mutation.error.message}
				</div>
			)}
			{mutation.isSuccess && <div>Strategy submitted successfully!</div>}
		</div>
	);
}
