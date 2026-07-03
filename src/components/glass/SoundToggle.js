import React, { useEffect, useState } from 'react';
import sfx from './sfx';
import { TbVolume, TbVolumeOff } from './icons';

/**
 * Small, quiet sound on/off control. Off by default; turning it on plays the
 * startup bloom as confirmation (and unlocks audio per the browser gesture
 * policy). Sits top-right so it never clashes with the top-left Back/Menu.
 */
const SoundToggle = () => {
  const [on, setOn] = useState(sfx.isEnabled());
  useEffect(() => sfx.subscribe(setOn), []);

  return (
    <button
      onClick={() => sfx.toggle()}
      aria-label={on ? 'Mute sound' : 'Enable sound'}
      title={on ? 'Sound on' : 'Sound off'}
      className="gx-btn gx-selectable fixed right-6 top-6 z-[70] !p-2 pointer-events-auto"
      style={{ opacity: on ? 1 : 0.6 }}
    >
      {on ? <TbVolume size={17} /> : <TbVolumeOff size={17} />}
    </button>
  );
};

export default SoundToggle;
