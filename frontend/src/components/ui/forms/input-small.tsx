import React, { useState } from "react";

interface InputFormProps {
	title?: string;
	initialValue?: string;
	name: string;
}

export default function InputSmall({ title, initialValue = "", name }: InputFormProps) {
	const [inputValue, setInputValue] = useState(initialValue);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
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
};

