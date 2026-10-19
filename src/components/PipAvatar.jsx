import React from 'react';
import PipCharacter from './PipCharacter';

// Compatibility wrapper preserving existing PipAvatar imports
export default function PipAvatar(props) {
  return <PipCharacter {...props} />;
}
