import React from 'react';

import Announcement from './';

export default {
  title: 'Announcement',
  component: Announcement,
};

export const Default = () => (
  <Announcement message="Server Maintenance tonight" />
);
export const Empty = () => <Announcement />;
