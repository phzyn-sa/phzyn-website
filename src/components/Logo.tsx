/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
  showSubtitle?: boolean;
}

export function Logo({ className = '', light = true, showSubtitle = true }: LogoProps) {
  const textColorClass = light ? 'text-white' : 'text-zinc-950';
  
  // Custom responsive viewBox to crop the logo perfectly
  const viewBox = showSubtitle ? "230 410 590 240" : "230 410 590 170";

  return (
    <div className={`flex flex-col items-center justify-center font-sans tracking-normal select-none ${className}`}>
      <svg 
        viewBox={viewBox}
        className={`w-36 sm:w-44 md:w-48 h-auto ${textColorClass} transition-colors duration-300`} 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Small petroleum brand teal polygon */}
        <polygon 
          className="fill-[#10798e] transition-colors duration-300"
          points="399.69 466 406.78 436.63 364.5 425.02 357.42 454.38 399.69 466"
        />
        
        {/* Letter P shape group */}
        <path 
          className="fill-current"
          d="M336.3,474.59c-3.95-5.96-9.37-10.45-16.12-13.34-4-1.72-8.94-2.89-14.92-3.55h-63.03v112.18h42.72v-37.58h13.63c12.93,0,23.51-3.45,31.45-10.27,8.11-6.96,12.22-16.18,12.22-27.39,0-7.36-2-14.1-5.95-20.05ZM300.31,499.44l-1.26,5.23-.67-.17-16.11-4.15-3.49-.9-.56-.14,3.18-13.18,20.83,5.37-1.92,7.96Z"
        />
        
        {/* Letter H shape block */}
        <polygon 
          className="fill-current"
          points="414.95 495.1 399.68 495.1 399.68 477.51 357.42 484.95 357.42 569.87 399.68 569.87 399.68 529.63 414.95 529.63 414.95 569.87 457.2 569.87 457.2 457.74 414.95 457.74 414.95 495.1"
        />

        {/* Letter Z shape block */}
        <polygon 
          className="fill-current"
          points="528.54 533.76 563.72 485.58 563.72 457.74 472.37 457.74 472.37 493.42 509.14 493.42 472.79 542.38 472.79 569.87 563.72 569.87 563.72 533.76 528.54 533.76"
        />

        {/* Letter Y shape block */}
        <polygon 
          className="fill-current"
          points="656.21 457.67 638.18 493.36 620.14 457.67 578.48 457.67 618 521.4 618 569.87 658.19 569.87 658.19 521.64 658.27 521.52 697.87 457.67 656.21 457.67"
        />

        {/* Letter N shape group */}
        <path 
          className="fill-current"
          d="M776.93,457.67v34.69c0,1.54.02,3.07.07,4.6l-25.68-39.29h-38.68v112.2h36.1v-47.63l30.33,47.63h34.04v-112.2h-36.18Z"
        />

        {/* Brand Text Subtitle rendered inside SVG directly */}
        {showSubtitle && (
          <text 
            className="fill-current font-bold"
            transform="translate(240.5 632.37)"
            style={{
              fontFamily: "DINNextLTArabic-Bold, 'DIN Next LT Arabic', 'Tajawal', sans-serif",
              fontSize: "44px"
            }}
          >
            فزيــــن للمقــــــــاولات المعمــــــــارية
          </text>
        )}
      </svg>
    </div>
  );
}
