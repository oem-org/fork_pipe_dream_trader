import { useState } from "react";
import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";

export default function StrategyList() {
	const [showStrategies, setShowStrategies] = useState(false);

	const { data, error, isError, isLoading } = getStrategiesQuery();

	const handleFetchStrategies = () => {
		setShowStrategies(true);
	};

	return (
		<div>
			<h1>Strategy List</h1>
			<button onClick={handleFetchStrategies} disabled={isLoading}>
				{isLoading ? "Loading..." : "Fetch Strategies"}
			</button>

			{isError && <p style={{ color: "red" }}>Error: {error?.message}</p>}

			{showStrategies && !isLoading && data && (
				<ul>
					{data.map((strategy) => (
						<li key={strategy.id}>{strategy.name}</li>
					))}
				</ul>
			)}
		</div>
	);
}
