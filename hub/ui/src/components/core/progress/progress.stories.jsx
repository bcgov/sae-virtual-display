import React from 'react';

import Progress from './';

export default {
  title: 'Core/Progress',
  component: Progress,
  decorators: [storyFn => <div style={{ margin: 50 }}>{storyFn()}</div>],
};

export const Default = () => <Progress />;

export const Pending = () => <Progress message="Pending..." value={0} />;

export const InProgress = () => (
  <Progress message="Importing (Step 4/5)" value={50} />
);

export const Complete = () => (
  <Progress message="Container is ready!" value={100} />
);
