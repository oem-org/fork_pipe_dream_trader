// Component from shadcnui component library

import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	variant?: 'default' | 'outline';
}

export function Button({ children, className, variant = 'default', ...rest }: ButtonProps) {
	return (
		<button
			{...rest}
			className={clsx(
				'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
				variant === 'default' &&
				'bg-blue-500 text-white hover:bg-blue-400 focus-visible:outline-blue-500 active:bg-blue-600',
				variant === 'outline' &&
				'border border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100 focus-visible:outline-blue-500',
				className,
			)}
		>
			{children}
		</button>
	);
}
