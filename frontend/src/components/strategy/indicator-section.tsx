import GenericSelect from "@/components/ui/lists/generic-select";
import getIndicatorsQuery from "@/lib/queries/getIndicatorsQuery";
import Indicator from "@/interfaces/Indicator";
import getStrategyIndicatorsQuery from "@/lib/queries/getStrategyIndicatorsQuery";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import { useAddIndicator } from "@/lib/hooks/useAddIndicator";
import GenericIndicator from "./generic-indicator";
import { useEffect, useCallback, memo } from "react";

interface IndicatorSectionProps {
	setRerender: React.Dispatch<React.SetStateAction<number>>;
	strategyId: number;
}

const IndicatorSection = memo(function IndicatorSection({
	strategyId,
	setRerender,
}: IndicatorSectionProps) {
	const { mutateAsync: addIndicatorMutation } = useAddIndicator(strategyId);
	const { data: strategyIndicators, error: siError, isLoading: siIsLoading } = getStrategyIndicatorsQuery(strategyId);
	const { data: indicators } = getIndicatorsQuery();

	const handleIndicatorChange = useCallback(async (indicator: Indicator): Promise<void> => {
		try {
			const response = await addIndicatorMutation(indicator);
			console.log("Indicator added successfully:", response);
			console.log(indicator);
		} catch (error) {
			console.error("Error adding indicator:", error);
		}
	}, [addIndicatorMutation]);




	useEffect(() => {
		setRerender((prev) => prev + 1)
	}, [strategyIndicators]);

	function parseSettings(rawSchema: any): SettingsSchema {
		const settingsSchema = JSON.parse(rawSchema);
		return settingsSchema;
	}

	interface SettingsSchema {
		description: string;
		properties: Record<string, any>;
		title: string;
		type: Record<string, any>;
	}

	return (
		<section>
			<h2 className="h2 mb-4">Indicators</h2>
			<hr className="py-1" />

			<GenericSelect<Indicator>
				data={indicators || []}
				keyExtractor={(indicator) => indicator.id}
				nameExtractor={(indicator) => indicator.kind}
				onSelect={handleIndicatorChange}
				renderItem={(indicator) => <span>{indicator.name}</span>}
				title="Select or search"
				changeTitle={false}
				searchEnabled={true}
			/>

			<div className="mt-4">
				<h3 className="h3 mb-2">Loaded Indicators</h3>
				{siIsLoading && <p>Loading indicators...</p>}
				{siError && siError instanceof Error && (
					<p className="text-red-500">Error loading indicators: {siError.message}</p>
				)}
				{!siIsLoading && !siError && strategyIndicators ? (
					<ul>
						{strategyIndicators.map((indicator) => (
							<li key={indicator.id}>
								<GenericIndicator
									indicatorName={indicator.name}
									dataframeColumn={indicator.dataframe_column}
									indicatorId={indicator.id}
									settingsSchema={parseSettings(indicator.settings_schema)}
									settings={indicator.settings}
								/>
							</li>
						))}
					</ul>
				) : (
					<p>No indicators found for this strategy.</p>
				)}
			</div>
		</section>
	);
});

export default IndicatorSection;
