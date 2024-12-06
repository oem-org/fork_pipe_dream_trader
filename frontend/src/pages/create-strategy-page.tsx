import CreateStrategyForm from "@/components/strategy/create-strategy-form";


export default function CreateStrategyPage() {
  return (
    <div className="flex justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create New Strategy
        </h2>
        <CreateStrategyForm />
      </div>
    </div>
  );
}
