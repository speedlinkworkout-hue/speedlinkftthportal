import { SocialLinks } from './SocialLinks';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-auto flex flex-col items-center justify-center space-y-4">
      <SocialLinks />
      <div className="text-sm text-speedlink-textSec dark:text-gray-400">
        &copy; {currentYear} Speedlink. All rights reserved.
      </div>
    </footer>
  );
}
