interface Props {
	settings: Record<string, any>;
}

export default function GenericIndicator({ settings }: Props) {
	return (
		<div>
			{Object.entries(settings).map(([key, value], index) => (
				<div key={index} style={{ marginBottom: '10px' }}>
					<label htmlFor={key} style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
						{key}:
					</label>
					<input
						type="text"
						id={key}
						name={key}
						defaultValue={value}
						style={{ padding: '5px', width: '100%', boxSizing: 'border-box' }}
					/>
				</div>
			))}
		</div>
	);
}
