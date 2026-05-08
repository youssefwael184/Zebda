import React from 'react';

const sizeMap = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

const Avatar = ({ username, color, size = 'md' }) => {
  const initials = username.substring(0, 2).toUpperCase();
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
      style={{ background: `${color}22`, border: `2px solid ${color}66`, color }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
