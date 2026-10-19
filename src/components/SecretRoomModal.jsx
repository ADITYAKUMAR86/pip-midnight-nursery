import React from 'react';
import SecretRoom from './SecretRoom';

// Compatibility wrapper preserving existing SecretRoomModal imports
export default function SecretRoomModal(props) {
  return <SecretRoom {...props} />;
}
