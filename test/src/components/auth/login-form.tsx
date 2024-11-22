import { Button } from "src@/components/shared/buttons/button";
import useAuthStore from "@/lib/stores/authStore";
import React from "react";
import useCoinQuery from "@/lib/hooks/useCoinQuery";
import ApiClient from "@/lib/services/apiClient";

const LoginForm: React.FC = () => {
  const { login } = useAuthStore();
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      // If login is successful, you can redirect to another page or update UI accordingly
      // window.location.reload();
    } catch (error) {
      console.error(error);
      // Handle login failure
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleLogin}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl">Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
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
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex h-8 items-end space-x-1">
          <Button type="submit" disabled={false}>
            Login
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
