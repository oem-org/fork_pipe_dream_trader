import getStrategiesQuery from "@/lib/hooks/react-query/getStrategiesQuery";
import GenericTable from "@/components/ui/lists/generic-table";
import { Strategy } from "@/interfaces/Strategy";
import { Link, useNavigate } from "react-router-dom";
import StrategyInfo from "@/components/strategy/strategy-info";
import { useState } from "react";
import { Button } from "@/components/ui/buttons/button";
import StrategyTableRow from "@/components/strategy/conditions/strategy-table-row";


export default function HomePage() {
  const { data: strategies, isError, isLoading, error } = getStrategiesQuery();

  const [localStrategyId, setLocalStrategyId] = useState<number>(0)


  const handleStrategyChange = (strategy: Strategy) => {
    setLocalStrategyId(strategy.id)
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 custom-grid-full-spacing overflow-hidden">
        <section className="bg-gray-100 rounded-lg flex flex-col overflow-hidden">
          <div className="p-4">
            <h2 className="h2 mb-4">Strategies</h2>
            <Link
              to="/create-strategy"
              className="btn-primary"
            >
              Create new strategy
            </Link>
          </div>
          <GenericTable<Strategy>
            data={strategies || []}
            keyExtractor={(strategy) => strategy.id}
            nameExtractor={(strategy) => strategy.name}
            onSelect={handleStrategyChange}
            renderItem={(strategy) => {
              return <StrategyTableRow strategy={strategy} localStrategyId={localStrategyId} />;
            }}
            searchEnabled={true}
          />
        </section>

        <section className="p-4 bg-gray-100 rounded-lg">
          <h4 className="text-xl font-bold mb-4">Info</h4>
          <StrategyInfo strategyId={localStrategyId} />
        </section>
      </div >

      < div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6" >
      </div >
    </div >
  );
}
