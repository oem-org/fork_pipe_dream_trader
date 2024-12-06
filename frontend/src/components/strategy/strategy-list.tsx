
import getStrategiesQuery from "../../lib/queries/getStrategiesQuery"
import Strategy from "../../interfaces/Strategy";
import SimpleList from "../shared/lists/list";
import { useState } from "react";

interface StrategyListProps {
	setId: (id: number) => void;
}

export default function StrategyList({ setId }: StrategyListProps) {
	const { data } = getStrategiesQuery();
	const [title, setTitle] = useState<string>("Clone existing strategy");
	const addSelected = (strategy: Strategy) => {
		setId(strategy.id);
		setTitle(strategy.name)
		console.log(strategy.id, "strategy id");
	};

	const renderStrategy = (strategy: Strategy) => (
		<span>{strategy.name}</span>
	);

	console.log(data, "data");

	return (
		<SimpleList<Strategy>
			data={data || []}
			keyExtractor={(strategy) => strategy.id}
			addSelected={addSelected}
			renderItem={renderStrategy}
			title={title}
		/>
	);
}

