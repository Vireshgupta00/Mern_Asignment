import { redirect } from 'next/navigation';

export default function Home() {
  // Automatically redirect the user to the login page when they visit localhost:3000
  redirect('/login');
}
