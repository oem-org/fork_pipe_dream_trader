'use server'

import { redirect } from 'next/navigation'

export async function createUser(prevState: any, formData: FormData) {
  try {
    const res = await fetch('http://localhost:8000/auth/', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { message: errorData.message || 'Something went wrong. Please try again.' };
    }

    // Assuming a successful response
    redirect('/dashboard');
  } catch (error) {
    return { message: 'An error occurred while creating the user. Please try again later.' };
  }
}
