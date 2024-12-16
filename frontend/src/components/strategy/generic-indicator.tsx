import { useState } from 'react';
import { Button } from '../shared/buttons/button';

import { isFloat, addDecimal } from '@/lib/utils/numeric_utils';

import { useUpdateIndicator } from '@/lib/hooks/useUpdateIndicator';

import extractFormData from '@/lib/utils/generics/extractFormData';
import useStrategyStore from '@/lib/hooks/useStrategyStore';


interface Props {
	indicatorId: number,
	settings: Record<string, any>;
	settings_schema: Record<string, any>;
}

// TODO: inputs go back to default when empty and the inputs move 
export default function GenericIndicator({ indicatorId, settings_schema, settings }: Props) {
	const [formData, setFormData] = useState<Record<string, any>>(settings);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { strategyId } = useStrategyStore();
	const { mutateAsync: updateIndicator } = useUpdateIndicator(strategyId);


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const convertedFormData = Object.entries(formData).reduce(
			(acc, [key, value]) => {
				const property = settings_schema.properties[key];

				if (property) {
					if (property.type === 'integer') {
						const convertedValue = parseInt(value, 10);
						if (isNaN(convertedValue)) {
							acc.errors[key] = `${property.title || key} should be a valid integer`;
						} else {
							acc[key] = convertedValue;
						}
					} else if (property.type === 'number') {
						isFloat(value)
						const convertedValue = parseFloat(value);
						if (!isFloat(value) && isFloat(convertedValue)) {
							console.log(value, "trst")
							acc.errors[key] = `${property.title || key} trimming valus into a float`;
						}
						else if (isNaN(convertedValue)) {
							acc.errors[key] = `${property.title || key} should be a valid float`;
						} else {
							acc[key] = convertedValue;
						}
					} else if (property.type === 'boolean') {
						acc[key] = value === 'on';
					} else {
						acc[key] = value;
					}
				} else {
					acc[key] = value;
				}

				return acc;
			},
			{ errors: {} } as { [key: string]: any; errors: Record<string, string> }
		);

		if (Object.keys(convertedFormData.errors).length > 0) {
			setErrors(convertedFormData.errors);
		} else {
			setErrors({});
			delete convertedFormData.errors
			const data = updateIndicator({ indicatorId, settings: convertedFormData })
			console.log(data)
			console.log('Form submitted successfully with data:', convertedFormData);
		}
	};

	const renderInputField = (key: string, property: Record<string, any>) => {
		const { default: defaultValue, title, type } = property;

		switch (type) {
			case 'string':
				return (
					<div className="mb-2">
						<label htmlFor={key} className="block font-bold mb-1">
							{title || key}:
						</label>
						<input
							id={key}
							name={key}
							value={formData[key] || defaultValue}
							onChange={handleInputChange}
							className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
					</div>
				);
			case 'integer':
				return (
					<div className="mb-2">
						<label htmlFor={key} className="block font-bold mb-1">
							{title || key}:
						</label>
						<input
							id={key}
							name={key}
							value={formData[key] || defaultValue}
							onChange={handleInputChange}
							className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
					</div>
				);
			case 'number':
				return (
					<div className="mb-2">
						<label htmlFor={key} className="block font-bold mb-1">
							{title || key}:
						</label>
						<input
							id={key}
							name={key}
							value={addDecimal(formData[key] || defaultValue)}
							onChange={handleInputChange}
							className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
					</div>
				);
			case 'boolean':
				return (
					<div className="mb-2">
						<label htmlFor={key} className="block font-bold mb-1">
							{title || key}:
						</label>
						<input
							type="checkbox"
							id={key}
							name={key}
							checked={formData[key] || defaultValue}
							onChange={handleInputChange}
							className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
					</div>
				);
			default:
				return (
					<div className="mb-2">
						<label htmlFor={key} className="block font-bold mb-1">
							{title || key}:
						</label>
						<input
							type="text"
							id={key}
							name={key}
							value={formData[key] || defaultValue || ''}
							onChange={handleInputChange}
							className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
					</div>
				);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				{Object.entries(settings_schema.properties).map(([key, property], index) => {
					return (
						<div key={index}>
							{renderInputField(key, property as Record<string, any>)}
						</div>
					);
				})}
				<Button type='submit'> Submit</Button>
			</form>
		</div>
	);
}
