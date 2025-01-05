import { Input } from '../ui/forms/input';
import { Button } from '../ui/buttons/button';
import useAuthStore from '../../lib/hooks/stores/useAuthStore';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import sendFormData from '../../lib/utils/generics/sendFormData';

export default function LoginForm() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { login } = useAuthStore();
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
		const success = await sendFormData<boolean>(e, login, setError, setLoading);

		if (success) {
			navigate('/');
		}
	}

	return (<form className="space-y-3" onSubmit={handleSubmit}>
		<div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
			<h1 className='mb-3 text-2xl'>
				Log in to continue.
			</h1>
			{error && (
				<div className="mb-4 text-sm text-red-600">{error}</div>
			)}
			<div className="w-full">
				<div>
					<label
						className="label"
						htmlFor="username"
					>
						Username
					</label>
					<div className="relative">
						<Input
							id="username"
							type="string"
							name="username"
							defaultValue="jep"
							placeholder="Enter your username"
							required
						/>
					</div>
				</div>
				<div className="mt-4">
					<label
						className="label"
						htmlFor="password"
					>
						Password
					</label>
					<div className="relative">
						<Input
							id="password"
							type="password"
							name="password"
							defaultValue="password"
							placeholder="Enter your password"
							required
						/>
					</div>
				</div>
			</div>
			<Button className="mt-4 w-full" type="submit" disabled={loading}>
				{loading ? "Logging in..." : "Log in"}
			</Button>
			<div className="flex h-8 items-end space-x-1">
				{error}
			</div>
		</div>
	</form>
	);
}
