
import React from 'react';
import { Activity } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetTitle, SheetDescription } from './sheet';
import { Button, buttonVariants } from './button';
import { MenuToggle } from './menu-toggle';
import { UserRole } from '../../types';

interface SimpleHeaderProps {
  onSelectRole?: (role: UserRole) => void;
}

export function SimpleHeader({ onSelectRole }: SimpleHeaderProps) {
	const [open, setOpen] = React.useState(false);

	const links = [
		{
			label: 'The Problem',
			href: '#reality-gap',
		},
		{
			label: 'Features',
			href: '#clarity',
		},
		{
			label: 'Evidence',
			href: '#evidence',
		},
        {
            label: 'Demo',
            href: '#demo',
        }
	];

	return (
		<header className="bg-white/95 dark:bg-black/95 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg transition-all duration-200">
			<nav className="mx-auto flex h-16 w-full container items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                        <Activity className="size-5 text-white" />
                    </div>
					<p className="font-sans text-xl font-bold text-slate-900 dark:text-white tracking-tight">ADLTrack</p>
				</div>
				<div className="hidden items-center gap-6 lg:flex">
					{links.map((link) => (
						<a
							key={link.label}
							className={buttonVariants({ variant: 'ghost', className: 'text-slate-600 dark:text-slate-300 hover:text-blue-600 font-medium' })}
							href={link.href}
						>
							{link.label}
						</a>
					))}
					<Button variant="outline" className="rounded-full px-6" onClick={() => onSelectRole?.(UserRole.FAMILY)}>Sign In</Button>
					<Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-md hover:shadow-lg transition-all" onClick={() => onSelectRole?.(UserRole.FAMILY)}>Get Started</Button>
				</div>
				
                <div className="lg:hidden flex items-center">
                    <MenuToggle
                        strokeWidth={2.5}
                        open={open}
                        onOpenChange={setOpen}
                        className="size-8 text-slate-900 dark:text-white"
                    />
                </div>

				<Sheet open={open} onOpenChange={setOpen}>
					<SheetContent
						className="bg-white/95 dark:bg-black/95 supports-[backdrop-filter]:bg-white/80 gap-0 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800"
						showClose={false}
						side="left"
					>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">Mobile navigation links</SheetDescription>
                        
                        <div className="px-4 py-6 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                    <Activity className="size-5 text-white" />
                                </div>
                                <p className="font-sans text-xl font-bold text-slate-900 dark:text-white">ADLTrack</p>
                            </div>
                        </div>

						<div className="grid gap-y-2 overflow-y-auto px-4 pb-5">
							{links.map((link) => (
								<a
									key={link.label}
									className={buttonVariants({
										variant: 'ghost',
										className: 'justify-start text-lg font-medium py-6 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900',
									})}
									href={link.href}
                                    onClick={() => setOpen(false)}
								>
									{link.label}
								</a>
							))}
						</div>
						<SheetFooter className="px-4 mt-auto pb-8">
							<Button variant="outline" className="w-full rounded-full py-6 text-base" onClick={() => { setOpen(false); onSelectRole?.(UserRole.FAMILY); }}>Sign In</Button>
							<Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base shadow-lg" onClick={() => { setOpen(false); onSelectRole?.(UserRole.FAMILY); }}>Get Started</Button>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</nav>
		</header>
	);
}
