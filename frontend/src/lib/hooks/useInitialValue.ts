
import { useState, useEffect } from "react";

function useInitialValue<T>(data: T[], initialValue: any, keyExtractor: (item: T) => string | number): T | null {
	const [initialItem, setInitialItem] = useState<T | null>(null);

	useEffect(() => {
		if (data && initialValue) {
			const foundItem = data.find(item => keyExtractor(item) === initialValue);
			setInitialItem(foundItem || null);
		}
	}, [data]);

	return initialItem;
}

export default useInitialValue;
