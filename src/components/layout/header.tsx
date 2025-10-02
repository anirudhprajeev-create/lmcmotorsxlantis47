'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, CarFront, GalleryHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/vehicles', label: 'Vehicles', icon: CarFront },
  { href: '/gallery', label: 'LMC Gallery', icon: GalleryHorizontal },
];

export default function Header() {
  const pathname = usePathname();

  const NavLinks = ({ className, linkClassName }: { className?: string, linkClassName?: (href: string) => string }) => (
    <nav className={cn('flex items-center gap-4 lg:gap-6', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            linkClassName ? linkClassName(link.href) : (pathname === link.href ? 'text-primary' : 'text-muted-foreground')
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 shadow-lg backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://cdn.discordapp.com/attachments/1083757528749453394/1422857574579048540/Image.png?ex=68de32e1&is=68dce161&hm=cfcee6dbc3b1545a593f00f4958fa89bbb25eaf48fce990a2773d594c44e77fe&" alt="LMC Motors Logo" width={40} height={40} className="h-10 w-10" />
            <span className="hidden text-lg font-semibold sm:inline-block">LMC Motors</span>
          </Link>
          <div className="hidden md:flex">
             <NavLinks linkClassName={(href) => href === '/gallery' ? 'hidden' : (pathname === href ? 'text-primary' : 'text-muted-foreground')} />
          </div>
        </div>
        
        <div className="hidden items-center gap-4 md:flex">
            <Link href="/gallery" className={cn('text-sm font-medium transition-colors hover:text-primary', pathname === '/gallery' ? 'text-primary' : 'text-muted-foreground')}>
                LMC Gallery
            </Link>
        </div>

        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-md p-2 text-lg font-medium hover:bg-accent"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
