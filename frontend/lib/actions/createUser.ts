'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

// returned values are available as state.message client side
export async function createUser(prevState: any, formData: FormData) {
  const userSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must not exceed 20 characters'),
  });

  try {
    const userData = {
      username: formData.get('username')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || '',
    };

    const parsedData = userSchema.parse(userData);

    const res = await fetch('http://localhost:8000/auth/', {
      method: 'POST',
      body: JSON.stringify(parsedData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();

      return { message: errorData.message || 'Something went wrong. Please try again.' };
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(', '); // Combine messages into a single string
      console.error('Validation errors:', errorMessages);

      return {
        message: `Validation failed: ${errorMessages}`,
      };
    }
    console.error('Unexpected error:', error);
    return { message: 'An unexpected error occurred. Please try again later.' };
  }
  redirect('/login');
}

