import React, { useEffect, useRef, useState } from 'react';

// Global coordination for loading the YouTube IFrame Player API once
const apiReadyCallbacks: (() => void)[] = [];
let isApiLoading = false;
let isApiReady = false;

const loadYoutubeIframeApi = (callback: () => void) => {
  if (isApiReady) {
    callback();
    return;
  }

  apiReadyCallbacks.push(callback);

  if (isApiLoading) return;
  isApiLoading = true;

  // Check if YT scripting engine is already present on window
  if (typeof window !== 'undefined' && (window as any).YT && (window as any).YT.Player) {
    isApiReady = true;
    while (apiReadyCallbacks.length > 0) {
      const cb = apiReadyCallbacks.shift();
      if (cb) cb();
    }
    return;
  }

  // Setup the global callback that YouTube's library executes once fully initialized
  const previousOnReady = (window as any).onYouTubeIframeAPIReady;
  (window as any).onYouTubeIframeAPIReady = () => {
    if (previousOnReady) previousOnReady();
    isApiReady = true;
    while (apiReadyCallbacks.length > 0) {
      const cb = apiReadyCallbacks.shift();
      if (cb) cb();
    }
  };

  // Inject script asynchronously
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (firstScriptTag && firstScriptTag.parentNode) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    document.head.appendChild(tag);
  }
};

export interface YoutubePlayerProps {
  youtubeId: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  coverImage?: string;
}

export const YoutubePlayer: React.FC<YoutubePlayerProps> = ({
  youtubeId,
  title = '',
  className = '',
  style = {},
  autoplay = true,
  mute = true,
  loop = true,
  controls = false,
  coverImage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    setIsPlaying(false);

    loadYoutubeIframeApi(() => {
      if (!active || !containerRef.current) return;

      // Clean up any older player instance
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn("Cleanup error:", e);
        }
        playerRef.current = null;
      }

      // Create pristine mount target element
      const placeholder = document.createElement('div');
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(placeholder);

      const YT = (window as any).YT;
      playerRef.current = new YT.Player(placeholder, {
        videoId: youtubeId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          mute: mute ? 1 : 0,
          loop: loop ? 1 : 0,
          playlist: loop ? youtubeId : undefined,
          controls: controls ? 1 : 0,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          enablejsapi: 1,
          vq: 'hd1080', // Hint to force maximum stream quality inside player request headers
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            if (!active) return;
            setIsReady(true);

            // Attempt setting quality immediately
            try {
              if (typeof event.target.setPlaybackQuality === 'function') {
                event.target.setPlaybackQuality('hd1080');
                
                // Inspect current setting and double down fallback
                const current = event.target.getPlaybackQuality ? event.target.getPlaybackQuality() : '';
                if (current && current !== 'hd1080') {
                  event.target.setPlaybackQuality('hd720');
                }
              }
            } catch (err) {
              console.warn("Playback quality override failed:", err);
            }

            if (autoplay) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (!active) return;
            // Mark as playing to trigger fade-out of static screen
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            }
            // Force / re-request high definition upon transition to buffer/play to counter browser adaptive bandwidth downgrades
            if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING) {
              try {
                if (typeof event.target.setPlaybackQuality === 'function') {
                  event.target.setPlaybackQuality('hd1080');
                  
                  // Check shortly inside the playback loop
                  setTimeout(() => {
                    if (active && event.target && typeof event.target.getPlaybackQuality === 'function') {
                      const current = event.target.getPlaybackQuality();
                      if (current !== 'hd1080') {
                        event.target.setPlaybackQuality('hd720');
                      }
                    }
                  }, 600);
                }
              } catch (e) {
                // Ignore silent failure
              }
            }
          }
        }
      });
    });

    return () => {
      active = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore state
        }
        playerRef.current = null;
      }
    };
  }, [youtubeId, autoplay, mute, loop, controls]);

  return (
    <div className={`relative overflow-hidden bg-black ${className} ${!controls ? 'pointer-events-none' : ''}`} style={style}>
      <div 
        ref={containerRef}
        className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:object-cover"
        title={title}
      />
      {coverImage && (
        <img
          src={coverImage}
          alt={title}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-700 pointer-events-none ${
            isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
};
