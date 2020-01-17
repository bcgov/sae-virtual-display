import React from 'react';

import Img from '../src/components/core/image';
import Loading from '../src/components/core/loading';

export default {
  title: 'Core',
  component: Loading,
};

export const Loader = () => <Loading />;
export const Image = () => <Img src="http://placehold.it/50" />;
export const FluidImage = () => (
  <Img fluid src="http://placehold.it/2000x500" />
);
