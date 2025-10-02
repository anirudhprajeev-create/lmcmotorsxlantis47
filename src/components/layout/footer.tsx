
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from '@/components/ui/icons';

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <Image src="https://cdn.discordapp.com/attachments/1083757528749453394/1422857574579048540/Image.png?ex=68de32e1&is=68dce161&hm=cfcee6dbc3b1545a593f00f4958fa89bbb25eaf48fce990a2773d594c44e77fe&" alt="LMC Motors Logo" width={96} height={96} className="h-24 w-auto" />
            <Image src="https://media.discordapp.net/attachments/1233726185243021382/1422828741922390016/image.png?ex=68de1806&is=68dcc686&hm=16bb9a40cc755af559b11c2fad7239c5b4084c4037ad400be4d51e85b3ce9c20&=&format=webp&quality=lossless&width=989&height=989" alt="Second Logo" width={96} height={96} className="h-24 w-auto" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-foreground/80 [text-shadow:0_1px_2px_var(--tw-shadow-color)] shadow-black/50">
              © LMC Group since 2022
            </p>
          </div>
          <div className="flex items-center gap-4">
             <p className="text-xs text-muted-foreground">developed by MIST LMC</p>
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://discord.gg/YNvTVA5p" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <DiscordIcon className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
