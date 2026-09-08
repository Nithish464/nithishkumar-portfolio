import './globals.css';
import { profile } from '../data/portfolio';
export const metadata = { title: `${profile.name} — Portfolio`, description: 'Full-Stack Developer and AI / GenAI Engineer portfolio.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
