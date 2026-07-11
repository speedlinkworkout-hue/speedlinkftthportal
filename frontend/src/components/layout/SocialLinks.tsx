import { Facebook, Twitter, Youtube, Instagram, Linkedin } from 'lucide-react';

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/speedlinkng',
    icon: Facebook,
    baseBg: 'bg-[#3b5998]',
    hoverText: 'hover:text-[#3b5998]',
  },
  {
    name: 'X (Twitter)',
    url: 'https://x.com/Speedlink_01',
    icon: Twitter,
    baseBg: 'bg-[#000000]',
    hoverText: 'hover:text-[#000000]',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@speedlinkng',
    icon: Youtube,
    baseBg: 'bg-[#FF0000]',
    hoverText: 'hover:text-[#FF0000]',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/speedlinkng/',
    icon: Instagram,
    baseBg: 'bg-[#c13584]',
    hoverText: 'hover:text-[#c13584]',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/speedlinkng/',
    icon: Linkedin,
    baseBg: 'bg-[#0077b5]',
    hoverText: 'hover:text-[#0077b5]',
  },
];

export function SocialLinks() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="mb-4 flex flex-col items-center">
        <h2 className="text-sm md:text-base font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
          Follow Us
        </h2>
        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mt-2 rounded-full" />
      </div>
      {/* 
        Pill-shaped floating container.
        Using existing border-radius scale (rounded-full) and shadow (shadow-md).
        Adapts to dark mode with dark: variants.
      */}
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 px-6 sm:px-8 py-4 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-md dark:shadow-sm dark:border dark:border-gray-800 transition-all duration-300">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit our ${link.name} page`}
              className={`
                flex items-center justify-center w-[50px] h-[50px] rounded-full 
                text-white transition-all duration-300 shadow-sm 
                hover:bg-white hover:shadow-lg dark:hover:bg-gray-800
                ${link.baseBg} ${link.hoverText}
              `}
            >
              <Icon className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
