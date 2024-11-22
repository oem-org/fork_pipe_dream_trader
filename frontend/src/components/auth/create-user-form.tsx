import { Input } from '../shared/forms/input';
import { Button } from '../shared/buttons/button';
import useAuthStore from '../../lib/hooks/useAuthStore';
import React, { useState } from "react";


interface LoginForm {
	username: string;
	password: string;
}

type StringOrNumber<T extends object> = {
	[K in keyof T as K extends string ? K : never]: T[K] extends string ? T[K] : never
}

const extractFormData = <T extends StringOrNumber<T>>(formData: FormData): T => {
	const data: Partial<T> = {};
	formData.forEach((value, key) => {
		let valueType: string;
		let finalValue: string | number = value as string | number;

		if (typeof value === "number") {
			finalValue = value;
			valueType = "number";
		}

		else if (typeof value === "string") {
			valueType = "string";
		}

		else {
			throw new Error(`Unexpected value type for key "${key}": Expected string or number, but got ${typeof value}`);
		}

		//data[key as keyof T] = finalValue;
		data[key as keyof T] = finalValue as T[keyof T];
		// Optionally log the key and its type
		console.log(`${key}: ${finalValue} (${valueType})`);

		for (const key in data) {
			if (data[key] === undefined) {
				throw new Error(`Missing value for required field: ${key}`);
			}
		}
	});

	// Validate that all required fields are present and correctly typed
	for (const key in data) {
		if (data[key] === undefined) {
			throw new Error(`Missing value for required field: ${key}`);
		}
	}

	// Return the data object cast to the specified type T
	return data as T;
};

export default function LoginForm() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { login } = useAuthStore();


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);

		const username = formData.get("username") as string;
		const password = formData.get("password") as string;

		const loginForm = extractFormData<LoginForm>(formData);
		console.log(loginForm, "Login");
		try {
			await login(username, password);
		} catch (error) {
			setError("Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="space-y-3" onSubmit={handleSubmit}>
			<div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
				<h1 className='mb-3 text-2xl'>
					Please log in to continue.
				</h1>
				{error && (
					<div className="mb-4 text-sm text-red-600">{error}</div>
				)}
				<div className="w-full">
					<div>
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="username"
						>
							Username
						</label>
						<div className="relative">
							<Input
								id="username"
								type="text"
								name="username"
								defaultValue="testuser"
								placeholder="Enter your username"
								required
							/>
						</div>
					</div>
					<div className="mt-4">
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="password"
						>
							Password
						</label>
						<div className="relative">
							<Input
								id="password"
								type="password"
								name="password"
								defaultValue="Lilleged666!"
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
