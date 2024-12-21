
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
