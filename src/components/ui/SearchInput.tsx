'use client';

import { IoSearchSharp, IoCloseCircle } from 'react-icons/io5';
import { useState, useEffect, useRef } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...', autoFocus }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative max-w-md w-full">
      <IoSearchSharp size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-light-gray" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-sp-gray text-sp-white text-sm pl-10 pr-10 py-2.5 rounded-full outline-none border-2 border-transparent focus:border-sp-white placeholder:text-sp-light-gray"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-light-gray hover:text-sp-white"
        >
          <IoCloseCircle size={18} />
        </button>
      )}
    </div>
  );
}
