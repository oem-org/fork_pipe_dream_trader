
import getStrategiesQuery from "../../lib/queries/getStrategiesQuery"
import useStrategyStore from "../../lib/hooks/useStrategyStore";
import Strategy from "../../interfaces/Strategy";
//import { postStrategyQuery } from "../../lib/queries/postStrategyQuery";

export default function StrategyList() {
	const { data } = getStrategiesQuery();
	const { strategyId, setStrategyId } = useStrategyStore();
	//const mutateAsyncStrategy = postStrategyQuery()

	const addStrategy = async (strategy: Strategy, strategyId: number) => {
		console.log(strategy.id, strategyId);
		// strategyId 0 is when none is selected
		if (typeof strategy.id === "number" && strategyId === 0) {
			console.log(strategyId, strategy.name);
			try {
				//const data = await mutateAsyncStrategy({
				//	kind: strategy.kind,
				//	settings: strategy.default_settings,
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

	function addSelectStrategy(strategy: Strategy, strategyId: number) {
		setStrategyId(strategy.id);
		console.log(strategyId, "strategy id");
		addStrategy(strategy, strategyId);
	}

	return (
		<ul className="list-none p-0">
			{data && data.map(strategy => (
				<li
					key={strategy.id}
					className="p-2 cursor-pointer bg-gray-100 border-b border-gray-300 hover:bg-gray-200"
				>
					<div className="flex justify-between items-center w-full">
						<button
							className="text-left text-md font-normal text-black hover:text-blue-500"
							onClick={() => addSelectStrategy(strategy, strategyId)}
						>
							{strategy.name}
						</button>
					</div>

				</li>
			))}
		</ul>
	)
}

