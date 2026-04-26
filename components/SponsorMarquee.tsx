import React from 'react';

export default function SponsorMarquee() {
  // Using the provided local logos
  const logos = [
    { name: 'SESA Logo', src: '/logos/logo1.png' },
    { name: 'SE Logo', src: '/logos/logo2.png' },
    { name: 'University Logo', src: '/logos/logo3.png' },
  ];

  return (
    <footer className="w-full bg-white border-t py-6 overflow-hidden mt-auto">
      <div className="text-center mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Official Partners
      </div>
      <div className="relative flex w-full max-w-full overflow-hidden flex-nowrap bg-white py-4">
        <div className="animate-marquee flex whitespace-nowrap items-center">
          {/* Duplicate the logos array 3 times to create a seamless infinite loop */}
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div key={index} className="mx-12 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={logo.src} 
                alt={logo.name} 
                className="h-24 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-6 text-xs text-muted-foreground/50 font-medium">
        &copy; {new Date().getFullYear()} se-ape-awurudu. All Rights Reserved.
      </div>
    </footer>
  );
}
