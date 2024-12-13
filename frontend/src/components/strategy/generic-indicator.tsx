interface Props {
	settings: Record<string, any>;
	settings_schema: Record<string, any>;
}

export default function GenericIndicator({ settings_schema, settings }: Props) {
	console.log(settings_schema, settings);

	return (
		<div>
			{
				Object.entries(settings_schema.properties).map(([key, property], index) => {
					const { default: defaultValue, title, type } = property as { default: any; title: string; type: string };

					return (
						<div key={index} className="mb-2">
							<label
								htmlFor={key}
								className="block font-bold mb-1"
							>
								{title}:
							</label>
							<input
								type={type || "text"}
								id={key}
								name={key}
								defaultValue={defaultValue}
								className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					);
				})
			}
		</div>
	);
}
