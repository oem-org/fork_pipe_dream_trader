import { Button } from '@/components/ui/buttons/button';
import { BacktestService } from '@/lib/services/BacktestService';
import BuildConditionRenderer from './build-condition-renderer';
import { useCallback, useRef, useState, useEffect } from 'react';
import CreateConditions from './create-conditions';
import useStrategyStore from '@/lib/hooks/stores/useStrategyStore';
import { getAllStrategyConditionsApi, postStrategyBacktestApi, postStrategyConditionsApi } from '@/lib/apiClientInstances';
import { Backtest, CreateBacktestRequest } from '@/interfaces/Backtest';

interface ConditionsSectionProps {
  setBacktest: React.Dispatch<React.SetStateAction<Backtest>>,
}

export default function ConditionsSection({ setBacktest }: ConditionsSectionProps) {
  const { strategyId } = useStrategyStore();
  const [sellConditions, setSellConditions] = useState<any[]>([]);
  const [buyConditions, setBuyConditions] = useState<any[]>([]);
  const [refetch, setRefetch] = useState<number>(0);

  const fetchConditions = useCallback(async (strategyId: number, side: "buy" | "sell") => {
    try {
      const data = await getAllStrategyConditionsApi.getAll(strategyId);

      if (data === undefined) {
        return undefined
      }

      const filteredConditions = data
        .filter((condition) => condition.side === side)
        .map((condition) => ({
          id: condition.id,
          position: condition.position,
          settings: condition.settings,
        }));

      return filteredConditions;
    } catch (error) {
      console.error(`Error fetching ${side} conditions:`, error);
      throw new Error(`Failed to fetch ${side} conditions`);
    }
  }, []);

  const fetchStrategyConditions = useCallback(async () => {
    try {
      const [buyConditions, sellConditions] = await Promise.all([
        fetchConditions(strategyId, "buy"),
        fetchConditions(strategyId, "sell"),
      ]);
      if (buyConditions) {
        setBuyConditions(buyConditions);
      }
      if (sellConditions) {
        setSellConditions(sellConditions);
      }
    } catch (error) {
      console.error("Error in fetchStrategyConditions:", error);
    }
  }, [fetchConditions, strategyId]);

  useEffect(() => {
    fetchStrategyConditions();
  }, [fetchStrategyConditions, refetch]);

  const addCondition = useCallback(async (newCondition: any) => {
    try {

      await postStrategyConditionsApi.post(strategyId, {
        settings: newCondition.settings,
        side: newCondition.side,
      });


      await fetchStrategyConditions();
    } catch (error) {
      console.error("Error adding condition:", error);
    }
  }, [fetchStrategyConditions, strategyId]);

  const buyStringRef = useRef<{ createConditionString: () => Array<any> }>(null);
  const sellStringRef = useRef<{ createConditionString: () => Array<any> }>(null);

  const runBacktest = useCallback(async () => {
    let buy = [];
    let sell = [];
    if (buyStringRef.current) {
      buy = buyStringRef.current.createConditionString();
    }

    if (sellStringRef.current) {
      sell = sellStringRef.current.createConditionString();
    }

    const sellConds = new BacktestService(sell);
    const buyConditions = sellConds.processConditions();

    const buyConds = new BacktestService(buy);
    const sellConditions = buyConds.processConditions();

    let data: CreateBacktestRequest = {
      buy_string: JSON.stringify(buyConditions),
      sell_string: JSON.stringify(sellConditions),
    };
    const result = await postStrategyBacktestApi.post(strategyId, data);
    setBacktest(result)

  }, [strategyId]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <h2 className="h2 mb-4">Strategy</h2>
        <Button onClick={() => runBacktest()}>Run Backtest</Button>
      </div>
      <hr className="py-1" />
      <div className="flex flex-row space-x-4">
        <div className="flex-1">
          <h3 className="h3 font-semibold pb-4">Buy conditions</h3>
          <div className="flex flex-row">
            <BuildConditionRenderer setRefetch={setRefetch} ref={buyStringRef} conditions={buyConditions} />
          </div>
          <div className="flex flex-col">
            <CreateConditions side="buy" addCondition={addCondition} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="h3 font-semibold pb-4">Sell conditions</h3>
          <div className="flex flex-row">
            <BuildConditionRenderer setRefetch={setRefetch} ref={sellStringRef} conditions={sellConditions} />
          </div>
          <div className="flex flex-col">
            <CreateConditions side="sell" addCondition={addCondition} />
          </div>
        </div>
      </div>
    </div>
  );
}
