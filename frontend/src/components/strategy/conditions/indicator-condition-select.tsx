import getStrategyIndicatorsQuery from "@/lib/queries/getStrategyIndicatorsQuery";
import GenericSelect from "@/components/ui/lists/generic-select";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import { StrategyIndicator } from "@/interfaces/StrategyIndicator";
import useInitialValue from "@/lib/hooks/useInitialValue";
interface IndicatorConditionSelectProps {
  initialValue: string;
  //key: number;
}

export default function IndicatorConditionSelect({ initialValue }: IndicatorConditionSelectProps) {

  const { strategyId } = useStrategyStore();
  const { data: indicatorSettings } = getStrategyIndicatorsQuery(strategyId);

  const findInitialValue = useInitialValue(indicatorSettings || [], initialValue, (indicator) => indicator.dataframe_column);

  function handleChange(item: StrategyIndicator) {
    console.log("Selected item:", item);
    // You can also handle the change logic here, passing the selected item
  }

  return (
    <div >
      <GenericSelect<StrategyIndicator>
        data={indicatorSettings || []}
        keyExtractor={(indicator) => indicator.id}
        nameExtractor={(indicator) => indicator.dataframe_column}
        onSelect={handleChange}
        renderItem={(indicator) => <span>{indicator.dataframe_column}</span>}
        title="Indicator"
        searchEnabled={false}
        initialValue={findInitialValue}
      />
    </div>
  );
};
