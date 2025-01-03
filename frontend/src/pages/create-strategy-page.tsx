import CreateStrategyForm from "@/components/strategy/create-strategy-form";

//TODO: center
export default function CreateStrategyPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg custom-light-grey">
        <CreateStrategyForm />
      </div>
    </div>
  );
}
