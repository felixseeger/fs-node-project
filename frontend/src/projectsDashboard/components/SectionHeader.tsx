import type { FC } from 'react';
import { truncate } from '../utils';

export const SectionHeader: FC<{ title: string }> = ({ title }) => {
  return <div className="sidebar-section-header">{truncate(title, 24)}</div>;
};
