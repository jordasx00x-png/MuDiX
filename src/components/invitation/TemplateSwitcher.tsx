import React from 'react';
import { InvitationData, SectionStyle } from '../../lib/types';
import { TraditionalTemplate, KIDS_THEMES } from './InvitationTemplate';
import StoriesTemplate from './StoriesTemplate';
import KidsPosterTemplate from './KidsPosterTemplate';

export default function InvitationTemplate({ data, isEditing, onUpdate }: { data: InvitationData, isEditing?: boolean, onUpdate?: (id: string, value: string, style?: SectionStyle) => void }) {
  if (KIDS_THEMES.includes(data.theme) || data.layoutMode === 'kids_poster' as any) {
    return <KidsPosterTemplate data={data} isEditing={isEditing} onUpdate={onUpdate} />;
  }
  if (data.layoutMode === 'stories') {
    return <StoriesTemplate data={data} isEditing={isEditing} onUpdate={onUpdate} />;
  }
  return <TraditionalTemplate data={data} isEditing={isEditing} onUpdate={onUpdate} />;
}
