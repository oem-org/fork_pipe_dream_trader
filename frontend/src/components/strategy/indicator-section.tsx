import GenericSelect from "@/components/ui/lists/generic-select";
import getIndicatorsQuery from "@/lib/queries/getIndicatorsQuery";
import Indicator from "@/interfaces/Indicator";
import getStrategyIndicatorsQuery from "@/lib/queries/getStrategyIndicatorsQuery";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import { useAddIndicator } from "@/lib/hooks/useAddIndicator";
import GenericIndicator from "./generic-indicator";





export default function IndicatorSection() {

	const { strategyId } = useStrategyStore();
	const { mutateAsync: addIndicatorMutation } = useAddIndicator(strategyId);
	const { data: strategyIndicators, error: siError, isLoading: siIsLoading } = getStrategyIndicatorsQuery(strategyId);
	const { data: indicatorSettings } = getIndicatorsQuery();

	async function handleIndicatorChange(indicator: Indicator): Promise<void> {
		try {
			// Using the destructured mutateAsync
			const response = await addIndicatorMutation(indicator);
			console.log("Indicator added successfully:", response);

		} catch (error) {
			console.error("Error adding indicator:", error);
		}
	};

	interface SettingsSchema {
		description: string,
		properties: Record<string, any>,
		title: string,
		type: Record<string, any>,
	}

	// The raw schema contains a object with unparsed strings
	function parseSettings(rawSchema: any): SettingsSchema {
		const settingsSchema = JSON.parse(rawSchema)
		return settingsSchema
	}

	return (<section>
		<h2 className="h2 mb-4">Indicators</h2>
		<GenericSelect<Indicator>
			data={indicatorSettings || []}
			keyExtractor={(indicator) => indicator.id}
			nameExtractor={(indicator) => indicator.kind}
			onSelect={handleIndicatorChange}
			renderItem={(indicator) => <span>{indicator.kind}</span>}
			title="Select or search"
			searchEnabled={true}
		/>
		<hr className="my-6" />
		<div className="mt-4">
			<h3 className="h2 mb-2">Loaded Indicators</h3>
			{siIsLoading && <p>Loading indicatorSettings...</p>}
			{siError && siError instanceof Error && (
				<p className="text-red-500">Error loading indicatorSettings: {siError.message}</p>
			)}
			{!siIsLoading && !siError && strategyIndicators ? (

				<ul>
					{strategyIndicators.map((indicator) => (
						<li key={indicator.id}>
							<GenericIndicator indicatorId={indicator.id} settingsSchema={parseSettings(indicator.settings_schema)} settings={indicator.settings} />
						</li>
					))}
				</ul>
			) : (
				<p>No indicators found for this strategy.</p>
			)}
		</div>

	</section>)
}
