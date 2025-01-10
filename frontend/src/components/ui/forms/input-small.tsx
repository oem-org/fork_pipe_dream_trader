import { putStrategyConditionsApi } from "@/lib/apiClientInstances";
import useStrategyStore from "@/lib/hooks/stores/useStrategyStore";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useEffect } from "react";

interface InputSmallProps {
	initialValue: string;
	position: number | undefined;
	name: string;
	onValueChange: (value: string) => void;
	conditionId: number
	blockIndex: number

}

const InputSmall = forwardRef(({ blockIndex, position, initialValue, name, onValueChange, conditionId }: InputSmallProps, ref) => {
	const [value, setValue] = useState(initialValue);
	const { strategyId } = useStrategyStore();
	//getStrategyConditionApi.get(strategyId, conditionId)
	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newValue = event.target.value;
		setValue(newValue);
		if (onValueChange) {
			onValueChange(newValue);
		}
		console.log(conditionId, position)
		const data = { "position": position, "settings": [{ "indicator": null }, { "operator": null }, { "value": newValue }] }
		putStrategyConditionsApi.put(strategyId, conditionId, data)
	}

	useEffect(() => {
		const data = { "position": position }
		putStrategyConditionsApi.put(strategyId, conditionId, data)
	}, [blockIndex]);

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
