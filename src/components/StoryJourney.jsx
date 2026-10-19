import React from 'react';
import StoryScenes from './StoryScenes';

// Compatibility wrapper preserving existing StoryJourney imports
export default function StoryJourney(props) {
  return <StoryScenes {...props} />;
}
