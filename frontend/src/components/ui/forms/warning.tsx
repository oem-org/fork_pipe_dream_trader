import React from 'react'


const FormWarning = ({ error: any }) => {
	return (
		<>
			{error && <p className="pt-1 text-red-500 text-sm">{error}</p>}
		</>
	);
};

export default FormWarning;

