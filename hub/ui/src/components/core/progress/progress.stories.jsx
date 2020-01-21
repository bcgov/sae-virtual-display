import React from 'react';

import Progress from './';

export default {
  title: 'Core/Progress',
  component: Progress,
};

export const Default = () => <Progress />;

export const Basic = () => (
  <Progress message="Importing (Step 4/5)" value={50} />
);
