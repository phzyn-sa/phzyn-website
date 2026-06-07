import React, { useState } from 'react';

interface ProjectVideoEmbedProps {
  youtubeId: string;
  mainImage: string;
  title: string;
  scale?: number;
}

export const ProjectVideoEmbed: React.FC<ProjectVideoEmbedProps> = ({
  youtubeId,
  mainImage,
  title,
  scale = 2.38
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Use youtube-nocookie.com to bypass cookie policies and prevent autoplay blocks
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&playsinline=1&iv_load_policy=3&modestbranding=1&enablejsapi=1`;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-zinc-950">
      {/* 1. Static high-quality cover image displayed while loading or if fallback needed */}
      <img
        src={mainImage}
        alt={title}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover z-20 transition-all duration-1000 ease-in-out ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* 2. Seamlessly scaled and centered YouTube Embed */}
      <iframe
        src={embedUrl}
        className="w-full h-full object-cover opacity-90 transition-opacity z-10"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        title={title}
        onLoad={() => {
          // Slight delay to ensure video begins playing before fading out the cover
          setTimeout(() => {
            setIsLoaded(true);
          }, 800);
        }}
      />
    </div>
  );
};
