import Link from "next/link";

const navLinks = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

const NavLinks = ({ className = "" }) => (
  <div className={`${className} flex flex-col space-y-2 py-4 lg:flex-column lg:space-y-0 lg:gap-x-8 xl:gap-x-12 lg:py-0 `}>
    {navLinks.map((link) => (
      <Link 
        href={link.href} 
        key={link.href} 
        className="text-base font-medium block px-3 rounded-lg  text-base-content py-2 hover:bg-base-100 transition-colors" 
        title={link.label}
      >
        {link.label}
      </Link>
    ))}
  </div>
);

export default NavLinks;