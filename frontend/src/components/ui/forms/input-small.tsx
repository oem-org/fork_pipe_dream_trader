import React, { useState, forwardRef, useImperativeHandle } from "react";

interface InputSmallProps {
	initialValue: string;
	position: number;
	name: string;
	onValueChange: (value: string) => void;
	conditionId: number

}

const InputSmall = forwardRef(({ position, initialValue, name, onValueChange, conditionId }: InputSmallProps, ref) => {
	const [value, setValue] = useState(initialValue);

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newValue = event.target.value;
		setValue(newValue);
		if (onValueChange) {
			onValueChange(newValue);
		}
		console.log(conditionId, position)
	}

	useImperativeHandle(ref, () => ({
		getValue: () => ({ value: value }),
		getPosition: () => ({ postion: position }),
	}));

	return (
		<div className="flex flex-col">
			<label className="label-simple" htmlFor={name}>{name}</label>
			<input
				className="indicator-input"
				id={name}
				type="text"
				value={value}
				onChange={handleChange}
			/>
		</div>
	);
});

export default InputSmall;
