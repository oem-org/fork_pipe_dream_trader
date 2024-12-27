
import { useState } from "react";
import { ConditionElement } from "@/interfaces/Condition";

interface CreateConditionValueProps {
  setValue: React.Dispatch<React.SetStateAction<ConditionElement>>;
}
export default function CreateConditionValue({ setValue }: CreateConditionValueProps) {
  const [valueLocal, setValueLocal] = useState<number>(1);

  // Handle input change and update state
  const handleChange = (event: any) => {
    setValue(event.target.value);
    setValueLocal(event.target.value)
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="value"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Value
      </label>
      <input
        id="value"
        type="text"
        value={valueLocal}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
