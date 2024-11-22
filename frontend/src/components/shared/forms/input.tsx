import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export function Input({ className, ...rest }: InputProps) {
	return (
		<input
			{...rest}
			className={clsx(
				'peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"',
				className
			)}
		/>
	);
}
