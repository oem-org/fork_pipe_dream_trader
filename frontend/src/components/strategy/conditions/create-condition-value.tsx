
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
    <div className="flex flex-col">
      <label
        htmlFor="value"
        className="label-simple"
      >
        Value
      </label>
      <input
        id="value"
        type="text"
        value={valueLocal}
        onChange={handleChange}
        className="indicator-input"
      />
    </div>
  );
}
