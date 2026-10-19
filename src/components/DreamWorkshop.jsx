import React from 'react';
import WorkshopCards from './WorkshopCards';

// Compatibility wrapper preserving existing DreamWorkshop imports
export default function DreamWorkshop(props) {
  return <WorkshopCards {...props} />;
}
