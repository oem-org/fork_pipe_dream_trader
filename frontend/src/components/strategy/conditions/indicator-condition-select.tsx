import getStrategyIndicatorsQuery from "@/lib/queries/getStrategyIndicatorsQuery";
import GenericSelect from "@/components/ui/lists/generic-select";
import useStrategyStore from "@/lib/hooks/useStrategyStore";
import { StrategyIndicator } from "@/interfaces/StrategyIndicator";
import useInitialValue from "@/lib/hooks/useInitialValue";
import { forwardRef, useImperativeHandle, useState } from "react";

interface IndicatorConditionSelectProps {
  initialValue: string;
  onValueChange: (value: string) => void;
  onDelete: () => void;
}

const IndicatorConditionSelect = forwardRef(
  ({ initialValue, onValueChange, onDelete }: IndicatorConditionSelectProps, ref) => {
    const { strategyId } = useStrategyStore();
    const { data: indicatorSettings } = getStrategyIndicatorsQuery(strategyId);
    console.log(indicatorSettings, "DATA");

    const findInitialValue = useInitialValue(
      indicatorSettings || [],
      initialValue,
      (indicator) => indicator.dataframe_column
    );
    const [selectedIndicator, setSelectedIndicator] = useState<StrategyIndicator | null>(
      findInitialValue
    );

    function handleChange(item: StrategyIndicator) {
      console.log("Selected item:", item);
      setSelectedIndicator(item);
      if (onValueChange) {
        onValueChange(item.dataframe_column);
      }
    }

    // Pass the initial value on first render while nothing has been selected yet
    // Otherwise will return a null value
    useImperativeHandle(ref, () => ({
      getValue: () => selectedIndicator?.dataframe_column || initialValue,

      deleteComponent: () => {
        onDelete();
      }
    }));

    return (
      <div>
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
  }
);

export default IndicatorConditionSelect;
