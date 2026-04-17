import React from 'react';
import { InvitationData, SectionStyle } from '../../lib/types';
import { TraditionalTemplate } from './InvitationTemplate';
import StoriesTemplate from './StoriesTemplate';

export default function InvitationTemplate({ data, isEditing, onUpdate }: { data: InvitationData, isEditing?: boolean, onUpdate?: (id: string, value: string, style?: SectionStyle) => void }) {
  if (data.layoutMode === 'stories') {
    return <StoriesTemplate data={data} isEditing={isEditing} onUpdate={onUpdate} />;
  }
  return <TraditionalTemplate data={data} isEditing={isEditing} onUpdate={onUpdate} />;
}
