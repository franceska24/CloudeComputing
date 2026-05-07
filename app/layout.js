import { Inter } from 'next/font/google';
import './globals.css';
import Provider from './SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Task Manager',
  description: 'Aplicatie de gestionare task-uri',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
