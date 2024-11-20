'use client'

import { SubmitButton } from '@/app/components/shared/buttons/submit-button';
import { lusitana } from '@/app/ui/fonts';
import { createUser } from '@/lib/actions/createUser'
import React, { useActionState } from 'react';

const initialState = {
  message: '',
}

export default function CreateUserForm() {
  // state is updated on form submission
  const [state, formAction] = useActionState(createUser, initialState)



  return (
    <form className="space-y-3" action={formAction}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Create your account
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                defaultValue="starter"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="string"
                name="email"
                defaultValue="starter@emaild.dk"
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
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                defaultValue="Lilleged666!"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                  id="confirmPassword"
                  type="password"
                  defaultValue="Lilleged666!"
                  name="confirmPassword"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p aria-live="polite">{state?.message}</p>
      <SubmitButton></SubmitButton>
    </form>
  );
}
