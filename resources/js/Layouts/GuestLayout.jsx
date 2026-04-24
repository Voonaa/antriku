import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-50 pt-6 sm:justify-center sm:pt-0 font-sans text-dark">
            <div>
                <Link href="/">
                    <img src="/storage/logo.png" alt="Antriku" className="h-20 w-auto" onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }} />
                    <span className="hidden text-3xl font-black tracking-tight text-primary">Antriku</span>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-2xl">
                {children}
            </div>
        </div>
    );
}
