import GenericSelect from "@/components/shared/lists/generic-select";
import getIndicatorsQuery from "@/lib/queries/getIndicatorsQuery";
import Indicator from "@/interfaces/Indicator";
import getStrategyIndicatorsQuery from "@/lib/queries/getStrategyIndicatorsQuery";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import { useAddIndicator } from "@/lib/hooks/useAddIndicator";
import { useDeleteIndicator } from "@/lib/hooks/useDeleteIndicator";
import { Button } from "@/components/shared/buttons/button";


import { SquareX } from 'lucide-react';


export default function IndicatorSection() {

	const { strategyId, setStrategyId } = useStrategyStore();

	const { mutateAsync: addIndicatorMutation } = useAddIndicator(strategyId);
	const { mutateAsync: deleteIndicatorMutation } = useDeleteIndicator(strategyId);

	const { data: strategyIndicators, error: siError, isLoading: siIsLoading, refetch: siRefetch } = getStrategyIndicatorsQuery(strategyId);
	const { data: indicators } = getIndicatorsQuery();

	const handleIndicatorChange = async (indicator: Indicator) => {
		try {
			const response = await addIndicatorMutation(indicator); // Use the destructured mutateAsync
			console.log("Indicator added successfully:", response);

		} catch (error) {
			console.error("Error adding indicator:", error);
		}
	};


	return (<>

		<h4 className="text-xl font-bold mb-4">Indicators</h4>
		<GenericSelect<Indicator>
			data={indicators || []}
			keyExtractor={(indicator) => indicator.id}
			nameExtractor={(indicator) => indicator.kind}
			onSelect={handleIndicatorChange}
			renderItem={(indicator) => <span>{indicator.kind}</span>}
			title="Select or search"
			searchEnabled={true}
		/>

		<div className="mt-4">
			<h5 className="text-lg font-semibold mb-2">Loaded Indicators</h5>
			{siIsLoading && <p>Loading indicators...</p>}
			{siError && siError instanceof Error && (
				<p className="text-red-500">Error loading indicators: {siError.message}</p>
			)}
			{!siIsLoading && !siError && strategyIndicators && strategyIndicators.length > 0 ? (
				<ul className="list-disc pl-4">
					{strategyIndicators.map((indicator) => (
						<li key={indicator.id}>
							<Button onClick={() => deleteIndicatorMutation(indicator.id)}>
								{indicator.id}

							</Button>
						</li>
					))}
				</ul>
			) : (
				<p>No indicators found for this strategy.</p>
			)}
		</div>

	</>)
}
