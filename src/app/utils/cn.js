// src/lib/utils.js
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };
  