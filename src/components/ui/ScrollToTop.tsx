'use client';

import { useEffect, useState } from 'react';
import { IoChevronUp } from 'react-icons/io5';

interface ScrollToTopProps {
  scrollContainer?: string;
}

export default function ScrollToTop({ scrollContainer }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = scrollContainer
      ? document.querySelector(scrollContainer)
      : document.querySelector('main');

    if (!container) return;

    const handleScroll = () => {
      setVisible(container.scrollTop > 300);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainer]);

  const scrollToTop = () => {
    const container = scrollContainer
      ? document.querySelector(scrollContainer)
      : document.querySelector('main');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-20 w-10 h-10 rounded-full bg-nr-panel/90 border border-nr-border flex items-center justify-center text-nr-text hover:bg-nr-hover transition-colors shadow-lg animate-fadeSlideIn"
      aria-label="Scroll to top"
    >
      <IoChevronUp size={20} />
    </button>
  );
}
