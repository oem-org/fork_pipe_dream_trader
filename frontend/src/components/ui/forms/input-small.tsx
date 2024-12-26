import React, { useState, forwardRef, useImperativeHandle } from "react";

interface InputSmallProps {
	initialValue: string;
	id: number;
	name: string;
	onValueChange: (value: string) => void;
	conditionId: number

}

const InputSmall = forwardRef(({ id, initialValue, name, onValueChange, conditionId }: InputSmallProps, ref) => {
	const [value, setValue] = useState(initialValue);

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newValue = event.target.value;
		setValue(newValue);
		if (onValueChange) {
			onValueChange(newValue);
		}
		console.log(conditionId)
	}

	useImperativeHandle(ref, () => ({
		getValue: () => ({ value: value }),
	}));

	return (
		<div>
			<label htmlFor={name}>{name}</label>
			{id}
			<input
				id={name}
				type="text"
				value={value}
				onChange={handleChange}
				style={{ margin: "5px", padding: "5px", border: "1px solid #ccc" }}
			/>
		</div>
	);
});

export default InputSmall;
