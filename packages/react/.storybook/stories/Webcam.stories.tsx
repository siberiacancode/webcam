import type { StoryObj, Meta } from '@storybook/react';
import React from 'react';

import { Webcam } from '@/components/Webcam/Webcam';

const WebcamTemplate: StoryObj<typeof Webcam> = {
  render: (args) => <Webcam {...args} />
};

export const Playground = {
  ...WebcamTemplate
};

export default {
  component: Webcam,
  title: 'webcam'
} as Meta<typeof Webcam>;
