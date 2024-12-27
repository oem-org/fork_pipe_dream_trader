import getStrategyIndicatorsQuery from "@/lib/hooks/react-query/getStrategyIndicatorsQuery";
import GenericSelect from "@/components/ui/lists/generic-select";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";
import { StrategyIndicator } from "@/interfaces/StrategyIndicator";
import useInitialValue from "@/lib/hooks/useInitialValue";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useUpdateStrategyCondition } from "@/lib/hooks/react-query/useUpdateStrategyConditions";
import { ConditionElement } from "@/interfaces/Condition";

interface IndicatorConditionSelectProps {
  id: number;
  initialValue: string;
  onValueChange: (value: string) => void;
  conditionId: number,
}

const IndicatorConditionSelect = forwardRef(
  ({ id, initialValue, onValueChange, conditionId }: IndicatorConditionSelectProps, ref) => {
    const { strategyId } = useStrategyStore();
    const { data: indicatorSettings } = getStrategyIndicatorsQuery(strategyId);
    const { mutateAsync: update } = useUpdateStrategyCondition()
    const findInitialValue = useInitialValue(
      indicatorSettings || [],
      initialValue,
      (indicator) => indicator.dataframe_column
    );
    const [selectedIndicator, setSelectedIndicator] = useState<StrategyIndicator | null>(
      findInitialValue
    );

    async function handleChange(item: StrategyIndicator) {
      setSelectedIndicator(item);
      if (onValueChange) {
        onValueChange(item.dataframe_column);
      }
      console.log(conditionId)
      const updateData = {
        "type": "indicator",
        "fk_strategy_id": item.id,
        "indicator": item.dataframe_column
      }

      let result = await update({ conditionId, strategyId, updateData })
      console.log(conditionId, result, "IndicatorCondtionSelect")
    }

    // Pass the initial value on first render while nothing has been selected yet
    // Otherwise will return a null value
    useImperativeHandle(ref, () => ({

      getValue: () => ({ indicator: selectedIndicator?.dataframe_column || initialValue }),

    }));

    return (
      <div>
        {id}
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
