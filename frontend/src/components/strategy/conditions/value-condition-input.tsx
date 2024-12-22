import React from 'react'
import { useState } from 'react';
interface ValueConditionInputProps {
  title?: string;
  initialValue?: string;
  name: string;
  onValueChange: (value: string) => void;
}

export default function ValueConditionInput({ title, initialValue = "", name, onValueChange }: ValueConditionInputProps) {
  const [inputValue, setInputValue] = useState(initialValue);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange(newValue);
  };

  return (
    <>
      <label htmlFor={name} className="block font-bold mb-1">
        {title || name}:
      </label>
      <input
        id={name}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        className="indicator-input"
      />
    </>
  );
}
