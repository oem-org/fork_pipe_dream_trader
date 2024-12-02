import getIndicatorsQuery from "../../lib/queries/getIndicatorsQuery"
import useIndicatorStore from "../../lib/hooks/useIndicatorStore";
import useStrategyStore from "../../lib/hooks/useStrategyStore";
import Indicator from "../../interfaces/Indicator";
//import { postIndicatorQuery } from "../../lib/queries/postIndicatorQuery";

export default function IndicatorList() {
	const { data } = getIndicatorsQuery();
	const { indicatorId, setIndicatorId } = useIndicatorStore();
	const { strategyId } = useStrategyStore();
	//const mutateAsyncIndicator = postIndicatorQuery()

	const addIndicator = async (indicator: Indicator, strategyId: number) => {
		console.log(indicator.id, strategyId);
		// strategyId 0 is when none is selected
		if (typeof indicator.id === "number" && strategyId === 0) {
			console.log(strategyId, indicator.kind, indicator.default_settings);
			try {
				//const data = await mutateAsyncIndicator({
				//	kind: indicator.kind,
				//	settings: indicator.default_settings,
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

	function addSelectIndicator(indicator: Indicator, strategyId: number) {
		setIndicatorId(indicator.id);
		console.log(indicatorId, "indicator id");
		addIndicator(indicator, strategyId);
	}

	return (
		<ul className="list-none p-0">
			{data && data.map(indicator => (
				<li
					key={indicator.id}
					className="p-2 cursor-pointer bg-gray-100 border-b border-gray-300 hover:bg-gray-200"
				>
					<div className="flex justify-between items-center w-full">
						<button
							className="text-left text-md font-normal text-black hover:text-blue-500"
							onClick={() => addSelectIndicator(indicator, strategyId)}
						>
							{indicator.kind}
						</button>
					</div>

				</li>
			))}
		</ul>
	)
}

