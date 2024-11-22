import { ReactNode } from 'react';
import TopNav from '../navigation/top-nav/top-nav';
import SideNav from '../navigation/side-nav';


interface StrategyLayoutProps {
	children: ReactNode;
}

export default function StrategyLayout({ children }: StrategyLayoutProps) {
	return (
		<div className="flex flex-col min-h-screen">
			<TopNav />
			<div className='flex flex-row'>
				<SideNav />
				<div className="pt-16">

					{children}
				</div>

			</div>
		</div >
	);
};

