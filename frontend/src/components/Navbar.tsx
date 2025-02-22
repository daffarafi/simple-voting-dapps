'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWalletSelector } from '@near-wallet-selector/react-hook';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { NewSessionForm } from './NewSessionForm';

export const Navbar = () => {
  const [action, setAction] = useState<() => void>(() => {});
  const [label, setLabel] = useState('Loading...');
  const { signedAccountId, signIn, signOut } = useWalletSelector();

  useEffect(() => {
    if (signedAccountId) {
      setAction(() => signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => signIn);
      setLabel('Login');
    }
  }, [signedAccountId, signIn, signOut]);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              priority
              src="/near-logo.svg"
              alt="NEAR"
              width="30"
              height="24"
            />
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Active Sessions
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {signedAccountId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Voting Session</DialogTitle>
                  <DialogDescription>
                    Create a new voting session. Add title, description, and
                    candidates.
                  </DialogDescription>
                </DialogHeader>
                <NewSessionForm />
              </DialogContent>
            </Dialog>
          )}
          <Button
            variant={signedAccountId ? 'outline' : 'default'}
            onClick={action}
          >
            {label}
          </Button>
        </div>
      </div>
    </nav>
  );
};
