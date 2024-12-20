import { useState } from 'react';
import { Button } from '../ui/buttons/button';
import { isFloat, addDecimal } from '@/lib/utils/numeric-utils';
import { useUpdateIndicator } from '@/lib/hooks/useUpdateIndicator';
import { useDeleteIndicator } from '@/lib/hooks/useDeleteIndicator';
import useStrategyStore from '@/lib/hooks/useStrategyStore';
import { SquareX, InfoIcon } from 'lucide-react';
import Modal from '../ui/modal';

interface Props {
	indicatorId: number,
	settings: Record<string, any>;
	settingsSchema: Record<string, any>;
}

// TODO: inputs go back to default when empty and the inputs move
export default function GenericIndicator({ indicatorId, settingsSchema, settings }: Props) {
	const [formData, setFormData] = useState<Record<string, any>>(settings);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { strategyId } = useStrategyStore();
	const { mutateAsync: updateIndicator } = useUpdateIndicator(strategyId);

	const { mutateAsync: deleteIndicatorMutation } = useDeleteIndicator(strategyId);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};
	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleModal = () => setIsModalOpen(!isModalOpen);


	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		//TODO: write explanation
		const convertedFormData = Object.entries(formData).reduce(
			(acc, [key, value]) => {
				const property = settingsSchema.properties[key];

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
							acc.errors[key] = `${property.title || key} trimming value into a float`;
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
		// TODO: fix errors type error
		if (Object.keys(convertedFormData.errors).length > 0) {
			setErrors(convertedFormData.errors);
		} else {
			setErrors({});
			// Disregard operand of delete must be optional typescript warning
			// Its unimportant as the errors {} should not be optional and is deleted only if exist
			delete convertedFormData.errors
			const data = updateIndicator({ indicatorId, settings: convertedFormData })
			console.log(data)
			console.log('Form submitted successfully with data:', convertedFormData);
		}
	};

	const renderInputField = (key: string, property: Record<string, any>) => {
		const { default: defaultValue, title, type } = property;
		if (key === 'kind') {
			return null;
		}

		// These fields depends on, if the Ta-Lib C-library is enabled or not
		if (key === 'ddof') {
			return null;
		}

		if (key === 'talib') {
			return null;
		}
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
							className="indicator-input"
						/>
						{errors[key] && <span className="text-error">{errors[key]}</span>}
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
							className="indicator-input"
						/>
						{errors[key] && <span className="text-error">{errors[key]}</span>}
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
							className="indicator-input"
						/>
						{errors[key] && <span className="text-error">{errors[key]}</span>}
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
							className="indicator-input"
						/>
						{errors[key] && <span className="text-error">{errors[key]}</span>}
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
							className="indicator-input"
						/>
						{errors[key] && <span className="text-error">{errors[key]}</span>}
					</div>
				);
		}
	};

	return (
		<div className='flex flex-col border rounded-lg p-4'>
			<Modal onClose={toggleModal} isOpen={isModalOpen} title={`Indicator: ${formData['kind']}`}>
				<section>
					<pre class="whitespace-pre-wrap break-words p-4 rounded-md">
						{settingsSchema.description}
					</pre>

				</section>
			</Modal>
			<div className='flex flex-row justify-between'>
				<div className='flex flex-row'>
					<h3 className='h3 font-bold mr-4'>{formData["kind"]}</h3>
					<InfoIcon className='cursor-pointer' onClick={() => toggleModal()} />
				</div>
				<button className="mb-4 appearance-none" onClick={() => deleteIndicatorMutation(indicatorId)}>
					<div className="flex items-center space-x-2">
						<span >Delete</span>
						<SquareX />
					</div>
				</button>
			</div>
			<hr className='py-1' />
			<form className='flex flex-row justify-between' onSubmit={handleSubmit}>
				<div className='flex flex-row space-x-2'>
					{Object.entries(settingsSchema.properties).map(([key, property]) => {
						return (<div key={key}>
							{renderInputField(key, property as Record<string, any>)}

						</div>);
					})

					}
				</div>
				<Button className='mt-auto ml-3 mb-2' type='submit'> Submit</Button>
			</form>
		</div>);
}
