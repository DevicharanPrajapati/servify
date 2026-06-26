import React from 'react';
import { Wrench, Mail, Github, Twitter } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: 'Platform',
      links: [
        { label: 'Find Services', href: '/providers' },
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' },
      ],
    },
    {
      title: 'Specialties',
      links: [
        { label: 'Electricians', href: '/providers?category=electrician' },
        { label: 'Plumbers', href: '/providers?category=plumber' },
        { label: 'Mechanics', href: '/providers?category=mechanic' },
        { label: 'Cleaners', href: '/providers?category=cleaner' },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.05] bg-[#10121a] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="text-violet-500 w-5 h-5" />
              <span className="text-lg font-extrabold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Servify</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Premium local service network. Book verified plumbers, electricians, mechanics, and cleaners in just a few clicks.
            </p>
            <div className="flex gap-3 mt-5">
              {[Twitter, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-white hover:border-violet-500/40 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>{section.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-slate-500 hover:text-white transition-colors duration-150">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <span>© {year} Servify Inc. All rights reserved.</span>
          <span>Built with the MERN stack & Tailwind CSS v4</span>
        </div>
      </div>
    </footer>
  );
}
