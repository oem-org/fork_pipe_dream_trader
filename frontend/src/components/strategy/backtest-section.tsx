import { Button } from '../ui/buttons/button'
export default function BacktestSection() {
	return (
		<section>
			<h2 className="h2 mb-4">Backtest</h2>
			<div className="flex flex-row justify-between">
				<h2 className="h2 mb-4">Strategy</h2>
				<Button>Run Backtest</Button>
			</div>
		</section>
	)
}

