import getStrategyIndicatorsQuery from "@/lib/queries/getStrategyIndicatorsQuery";
import GenericSelect from "@/components/ui/lists/generic-select";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import { StrategyIndicator } from "@/interfaces/StrategyIndicator";
interface IndicatorConditionSelectProps {
  initialValue: string;
  key: number;
}

export default function IndicatorConditionSelect({ key, initialValue }: IndicatorConditionSelectProps) {

  const { strategyId } = useStrategyStore()
  const { data: indicatorSettings } = getStrategyIndicatorsQuery(strategyId);

  function handleChange() {
    console.log("click");
    console.log(initialValue)
  }

  return (
    <div key={key}>
      <GenericSelect<StrategyIndicator>
        data={indicatorSettings || []}
        keyExtractor={(indicator) => indicator.id}
        nameExtractor={(indicator) => indicator.dataframe_column}
        onSelect={handleChange}
        renderItem={(indicator) => <span>{indicator.dataframe_column}</span>}
        title="Indicator"
        searchEnabled={false}
      />
    </div>
  );
};

