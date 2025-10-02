
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
            <div className="relative h-24 w-24">
                <Image src="https://cdn.discordapp.com/attachments/1083757528749453394/1422857574579048540/Image.png?ex=68de32e1&is=68dce161&hm=cfcee6dbc3b1545a593f00f4958fa89bbb25eaf48fce990a2773d594c44e77fe&" alt="LMC Motors Logo" fill className="object-contain" />
            </div>
            <div className="relative h-24 w-24">
                <Image src="https://cdn.discordapp.com/attachments/1233726185243021382/1422828741922390016/image.png?ex=68df6986&is=68de1806&hm=eb0e8c13d3b40a501172b00b8183d448540f4f62ea4b9aa5534f061606bccc6c&" alt="Second Logo" fill className="object-contain" />
            </div>
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
