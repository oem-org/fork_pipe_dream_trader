
import { useState, useEffect } from "react";

function useInitialValue<T>(data: T[], initialValue: string | null, keyExtractor: (item: T) => string): T | null {
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
