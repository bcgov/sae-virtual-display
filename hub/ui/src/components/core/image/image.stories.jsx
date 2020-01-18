import React from 'react';

import Img from './';

export default {
  title: 'Core/Image',
  component: Img,
};

export const Image = () => <Img src="http://placehold.it/50" />;
export const FluidImage = () => (
  <Img fluid src="http://placehold.it/2000x500" />
);
