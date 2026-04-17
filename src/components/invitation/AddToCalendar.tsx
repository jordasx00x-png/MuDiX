import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { InvitationData } from '../../lib/types';
import { cn } from '../../lib/utils';

interface AddToCalendarProps {
  data: InvitationData;
  theme: {
    bg: string;
    text: string;
    accent: string;
    border: string;
    primaryColor?: string;
    accentColor?: string;
  };
  className?: string;
}

export default function AddToCalendar({ data, theme, className }: AddToCalendarProps) {
  const getGoogleCalendarUrl = () => {
    try {
      // Parse date and time
      const [year, month, day] = data.date.split('-');
      const [hour, minute] = data.ceremony.time.split(':');
      
      const startDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
      
      // Default duration: 4 hours
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
      
      const formatGoogleDate = (d: Date) => {
        return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      };

      const startStr = formatGoogleDate(startDate);
      const endStr = formatGoogleDate(endDate);
      
      const title = encodeURIComponent(`Evento de ${data.name}`);
      const details = encodeURIComponent(`¡Te esperamos en nuestro evento!\n\nLugar: ${data.ceremony.name}\nDirección: ${data.ceremony.address}`);
      const location = encodeURIComponent(`${data.ceremony.name}, ${data.ceremony.address}`);
      
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
    } catch (e) {
      return '#';
    }
  };

  return (
    <a
      href={getGoogleCalendarUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-md",
        !theme.primaryColor && theme.bg,
        "text-white ring-2 ring-white/20",
        className
      )}
      style={theme.primaryColor ? { backgroundColor: theme.primaryColor } : {}}
    >
      <CalendarPlus className="w-4 h-4" />
      Agendar en Google Calendar
    </a>
  );
}
