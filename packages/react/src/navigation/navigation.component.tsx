import Link from "next/link";
import React from "react";

interface NavigationProps {
  links: { text: string; href: string }[];
}

export const Navigation: React.FC<NavigationProps> = ({ links }) => (
  <nav className="flex h-96 w-full items-center justify-center bg-black text-gray-500">
    <ul className="flex flex-col gap-2 md:flex-row">
      {links.map(({ text, href }) => (
        <Link href={href} key={text}>
          <a>
            <li className="p-2 transition-colors hover:text-white">{text}</li>
          </a>
        </Link>
      ))}
    </ul>
  </nav>
);

export default Navigation;
