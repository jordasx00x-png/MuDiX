import React, { useEffect } from 'react';
import { cn } from '../lib/utils';

interface AdBannerProps {
  className?: string;
  style?: React.CSSProperties;
  /* Client ID like ca-pub-... */
  client?: string;
  /* Ad slot ID */
  slot?: string;
  /* Layout format: auto, fluid, etc. */
  format?: string;
  /* Full width responsive styling */
  responsive?: boolean;
}

export function AdBanner({
  className,
  style,
  client = (import.meta as any).env.VITE_GOOGLE_ADS_CLIENT || 'ca-pub-9345922247541675',
  slot = (import.meta as any).env.VITE_GOOGLE_ADS_SLOT || '1234567890',
  format = 'auto',
  responsive = true,
}: AdBannerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        // Check if there are any adsbygoogle elements that haven't been initialized yet
        const elements = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
        if (elements.length > 0) {
          adsbygoogle.push({});
        }
      } catch (e) {
        // Only log if it's not the redundant push error
        if (e instanceof Error && !e.message.includes('already have ads')) {
          console.error('Google Ads error:', e);
        }
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('w-full flex items-center justify-center my-4 overflow-hidden min-h-[90px] relative bg-black/5 rounded-lg border border-black/10', className)} style={style}>
      {/* Visual Placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-50 pointer-events-none p-4">
        <span className="text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-400">Publicidad</span>
      </div>
      
      <ins
        className="adsbygoogle relative z-10"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
