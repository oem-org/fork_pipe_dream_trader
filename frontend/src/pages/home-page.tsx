import getStrategiesQuery from "@/lib/queries/getStrategiesQuery";
import GenericTable from "@/components/ui/lists/generic-table";
import { Strategy } from "@/interfaces/Strategy";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const { data: strategies, isError, isLoading, error } = getStrategiesQuery();
  const navigate = useNavigate();


  const handleStrategyChange = (strategy: Strategy) => {
    navigate(`/strategy/${strategy.id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-row justify-between">

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
            renderItem={(strategy) => <span>{strategy.name}</span>}
            searchEnabled={true}
          />
        </section>

        <section className="p-4 bg-gray-100 rounded-lg">
          <h4 className="text-xl font-bold mb-4">Backtests</h4>
        </section>
      </div >

      < div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6" >
      </div >
    </div >
  );
}
