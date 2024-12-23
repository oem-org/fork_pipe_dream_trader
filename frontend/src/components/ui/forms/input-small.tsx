import React, { useState } from "react";

interface InputFormProps {
	title?: string;
	initialValue?: string;
	name: string;
	onValueChange: (value: string) => void;
}

export default function InputSmall({ title, initialValue = "", name, onValueChange }: InputFormProps) {
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
				{inputValue}
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
