import getStrategyIndicatorsQuery from '@/lib/queries/getStrategyIndicatorsQuery';
import GenericSelect from '../../ui/lists/generic-select';
import Indicator from '@/interfaces/Indicator';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { StrategyIndicator } from '@/interfaces/StrategyIndicator';
import { SettingsIcon } from 'lucide-react';
import Dropdown from '../../ui/navigation/dropdown';
import BuildConditionRenderer from './build-condition-renderer';
import { Input } from '../../ui/forms/input';

import { Plus } from 'lucide-react';


export default function ConditionSelect() {

  //const { strategyId } = useStrategyStore()

  const operators = [{ "id": 1, "name": "=" }, { "id": 2, "name": "<" }];

  //
  //const { data: indicatorSettings } = getStrategyIndicatorsQuery(strategyId);

  const defaultConds = [[{ "indicator": "SMA_10" }, { "operator": ">" }, { "value": 1 }], "&", [{ "indicator": "RSI_14" }, { "operator": "=" }, { "indicator": "RSI_10" }]]



  return (
    <>
      <BuildConditionRenderer conditions={defaultConds} />
    </>);
};

