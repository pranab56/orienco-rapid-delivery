'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  animate?: boolean;
}

export function SectionWrapper({
  children,
  className,
  id,
  animate = true,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={animate ? { opacity: 0, y: 50 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={cn('relative mx-auto max-w-7xl px-6 py-24 md:px-12 lg:py-32', className)}
    >
      {children}
    </motion.section>
  );
}
