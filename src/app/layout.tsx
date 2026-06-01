import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Relacione-se | Acesse seus recursos internos',
  description: 'Ecossistema Relacione-se de Sol Lima: discernimento, presenca, padroes emocionais, vinculos conscientes e reposicionamento.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
