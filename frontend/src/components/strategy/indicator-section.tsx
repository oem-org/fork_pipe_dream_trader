import GenericSelect from "@/components/shared/lists/generic-select";
import getIndicatorsQuery from "@/lib/queries/getIndicatorsQuery";
import Indicator from "@/interfaces/Indicator";
import getStrategyIndicatorsQuery from "@/lib/queries/getStrategyIndicatorsQuery";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import { useAddIndicator } from "@/lib/hooks/useAddIndicator";
import { useDeleteIndicator } from "@/lib/hooks/useDeleteIndicator";
import { Button } from "@/components/shared/buttons/button";
import GenericIndicator from "./generic-indicator";

import { SquareX } from 'lucide-react';
import useChartStore from "@/lib/hooks/useChartStore";




export default function IndicatorSection() {

	const { strategyId, setStrategyId } = useStrategyStore();
	const { mutateAsync: addIndicatorMutation } = useAddIndicator(strategyId);
	const { mutateAsync: deleteIndicatorMutation } = useDeleteIndicator(strategyId);

	const { data: strategyIndicators, error: siError, isLoading: siIsLoading, refetch: siRefetch } = getStrategyIndicatorsQuery(strategyId);
	const { data: indicatorSettings } = getIndicatorsQuery();

	//const { addIndicator, removeIndicator, indicators, lineSeriesIndicators, histogramIndicators } = useChartStore()


	//console.log(indicators, "88888888888888888888888888")

	const handleIndicatorChange = async (indicator: Indicator) => {
		try {
			// Using the destructured mutateAsync
			const response = await addIndicatorMutation(indicator);
			console.log("Indicator added successfully:", response);

		} catch (error) {
			console.error("Error adding indicator:", error);
		}
	};


	return (<>


		<h4 className="text-xl font-bold mb-4">Indicators</h4>
		<GenericSelect<Indicator>
			data={indicatorSettings || []}
			keyExtractor={(indicator) => indicator.id}
			nameExtractor={(indicator) => indicator.kind}
			onSelect={handleIndicatorChange}
			renderItem={(indicator) => <span>{indicator.kind}</span>}
			title="Select or search"
			searchEnabled={true}
		/>

		<div className="mt-4">
			<h5 className="text-lg font-semibold mb-2">Loaded Indicators</h5>
			{siIsLoading && <p>Loading indicatorSettings...</p>}
			{siError && siError instanceof Error && (
				<p className="text-red-500">Error loading indicatorSettings: {siError.message}</p>
			)}
			{!siIsLoading && !siError && strategyIndicators && strategyIndicators.length > 0 ? (
				<ul className="list-disc pl-4">
					{strategyIndicators.map((indicator) => (
						<li key={indicator.id}>

							<GenericIndicator indicatorId={indicator.id} settings_schema={JSON.parse(indicator.settings_schema)} settings={indicator.settings} />

							<Button onClick={() => deleteIndicatorMutation(indicator.id)}>
								{indicator.id}

							</Button>
							<Button></Button>
						</li>
					))}
				</ul>
			) : (
				<p>No indicators found for this strategy.</p>
			)}
		</div>

	</>)
}


//<button
//	onClick={() =>
//		addIndicator('SMA', [
//			{ time: '2022-01-01', value: 50 },
//			{ time: '2022-01-02', value: 52 },
//		])
//	}
//	className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
//>
//	Add SMA
//</button>
//<button
//	onClick={() => removeIndicator('SMA')}
//	className="px-4 py-2 bg-red-500 text-white rounded"
//>
//	Remove SMA
//</button>
