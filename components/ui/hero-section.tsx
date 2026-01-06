'use client'
import React from 'react'
import { Button } from './button'
import { cn } from '../../lib/utils'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useScroll, motion } from 'framer-motion'
import { UserRole } from '../../types'

interface HeroSectionProps {
    onSelectRole?: (role: UserRole) => void;
}

export function HeroSection({ onSelectRole }: HeroSectionProps) {
    return (
        <div className="bg-white dark:bg-black min-h-screen text-slate-950 dark:text-white">
            <HeroHeader onSelectRole={onSelectRole} />
            <main className="overflow-x-hidden">
                <section>
                    <div className="py-24 md:pb-32 lg:pb-36 lg:pt-48">
                        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                            <div className="mx-auto max-w-2xl text-center lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="mt-8 max-w-3xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    The Care Operating System
                                </h1>
                                <p className="mt-8 max-w-2xl text-balance text-xl text-slate-700 dark:text-slate-200 font-medium">
                                    A structured, evidence-based care platform bridging the trust gap between families and professional caregivers with real-time vitals, tasks, and tracking.
                                </p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full pl-5 pr-3 text-base bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                        onClick={() => onSelectRole?.(UserRole.FAMILY)}
                                    >
                                        <a>
                                            <span className="text-nowrap">Get Started</span>
                                            <ChevronRight className="ml-1" />
                                        </a>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5 cursor-pointer text-slate-900 dark:text-white"
                                    >
                                        <a href="#demo">
                                            <span className="text-nowrap">View Demo</span>
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-[2/3] absolute inset-1 overflow-hidden rounded-3xl border border-black/10 sm:aspect-video lg:rounded-[3rem] dark:border-white/5">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="size-full object-cover opacity-50 dark:opacity-40"
                                src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"></video>
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-black dark:via-black/40 dark:to-transparent"></div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solutions', href: '#' },
    { name: 'Enterprise', href: '#' },
    { name: 'About', href: '#' },
]

const HeroHeader = ({ onSelectRole }: { onSelectRole?: (role: UserRole) => void }) => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header className="absolute top-0 left-0 right-0 z-50">
            <nav
                data-state={menuState && 'active'}
                className="group w-full pt-4">
                <div className={cn('mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12', scrolled && 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm')}>
                    <motion.div
                        key={1}
                        className={cn('relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6', scrolled && 'lg:py-4')}>
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <a
                                href="#"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">ADLTrack</span>
                            </a>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-slate-900 dark:text-white">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm font-medium">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 block duration-150">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base font-medium">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                href={item.href}
                                                className="text-slate-800 dark:text-slate-200 hover:text-blue-600 block duration-150">
                                                <span>{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => onSelectRole?.(UserRole.FAMILY)}
                                >
                                    <a>
                                        <span>Log In</span>
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={() => onSelectRole?.(UserRole.FAMILY)}
                                >
                                    <a>
                                        <span>Sign Up</span>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </nav>
        </header>
    )
}