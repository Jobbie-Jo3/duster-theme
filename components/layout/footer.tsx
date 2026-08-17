'use client';

import Link from 'next/link';
import { useStore } from '@/hooks/use-api';
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitch,
  FaDiscord,
  FaTiktok,
  FaSteam,
} from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import type { Store } from '@/lib/schemas';

interface FooterProps {
  initialStore?: Store | null;
}

export function Footer({ initialStore }: FooterProps) {
  const { data: fetchedStore } = useStore();
  const store = fetchedStore || initialStore;
  const currentYear = new Date().getFullYear();

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return (
    <footer className="mt-auto border-t border-steel/70 bg-void/95">
      <div className="mx-auto max-w-[1600px] px-6 py-10">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_0.7fr]">

          {/* BRAND */}

          <div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-salt-orange" />

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-salt-orange-bright">
                  Official #SALT Webshop
                </p>

                <h3 className="mt-1 font-black uppercase tracking-wide text-white">
                  #SALT NO-WIPE
                </h3>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500">
              {store?.description
                ? stripHtml(store.description)
                : 'Official #SALT NO-WIPE ARK: Survival Ascended webshop.'}
            </p>
          </div>

          {/* QUICK LINKS */}

          <div className="lg:ml-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
              Quick Links
            </p>

            <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3">
              <FooterLink href="/">
                Home
              </FooterLink>

              <FooterLink href="/shop">
                Shop
              </FooterLink>

              <FooterLink href="/cart">
                Cart
              </FooterLink>

              {store?.menu_links?.map((menuLink, index) => (
                <a
                  key={index}
                  href={menuLink.link.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-500 transition-colors hover:text-salt-orange-bright"
                >
                  {menuLink.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* SOCIALS */}

        {store?.social_medias ? (
          <div className="mt-10 border-t border-steel/60 pt-7">

            <div className="flex flex-wrap items-center justify-between gap-5">

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                Follow #SALT
              </p>

              <div className="flex flex-wrap gap-2">

                {store.social_medias.facebook ? (
                  <SocialLink
                    href={store.social_medias.facebook}
                    label="Facebook"
                  >
                    <FaFacebook className="h-4 w-4" />
                  </SocialLink>
                ) : null}

                {store.social_medias.instagram ? (
                  <SocialLink
                    href={store.social_medias.instagram}
                    label="Instagram"
                  >
                    <FaInstagram className="h-4 w-4" />
                  </SocialLink>
                ) : null}

                {store.social_medias.twitter ? (
                  <SocialLink
                    href={store.social_medias.twitter}
                    label="X"
                  >
                    <SiX className="h-4 w-4" />
                  </SocialLink>
                ) : null}

                {store.social_medias.youtube ? (
                  <SocialLink
                    href={store.social_medias.youtube}
                    label="YouTube"
                  >
                    <FaYoutube className="h-4 w-4" />
                  </SocialLink>
                ) : null}

                {store.social_medias.tiktok ? (
                  <SocialLink
                    href={store.social_medias.tiktok}
                    label="TikTok"
                  >
                    <FaTiktok className="h-4 w-4" />
                  </SocialLink>
                ) : null}

                {store.social_medias.discord ? (
                  <SocialLink
                    href={store.social_medias.discord}
                    label="Discord"
                  >
                    <FaDiscord className="h-4 w-4" />
                  </SocialLink>
                ) : null}

                {store.social_medias.twitch ? (
                  <SocialLink
                    href={store.social_medias.twitch}
                    label="Twitch"
                  >
                    <FaTwitch className="h-4 w-4" />
                  </SocialLink>
                ) : null}

                {store.social_medias.steam ? (
                  <SocialLink
                    href={store.social_medias.steam}
                    label="Steam"
                  >
                    <FaSteam className="h-4 w-4" />
                  </SocialLink>
                ) : null}

              </div>
            </div>
          </div>
        ) : null}

        {/* BOTTOM BAR */}

        <div className="mt-8 flex flex-col gap-3 border-t border-steel/60 pt-6 text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {currentYear} #SALT NO-WIPE. All rights reserved.
          </p>

          <p>
            Store services powered by Tip4Serv.
          </p>

        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs font-bold uppercase tracking-wider text-neutral-500 transition-colors hover:text-salt-orange-bright"
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-steel-light bg-charcoal text-neutral-500 transition-all hover:border-salt-orange/60 hover:bg-salt-orange/10 hover:text-salt-orange-bright"
    >
      {children}
    </a>
  );
}