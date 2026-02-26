'use client';

import React from 'react';
import StatCard from '../cards/StatCard';
import { MOCK_STATS } from '@/app/lib/mockData';

export default function GamifiedStatsStrip() {
  return (
    <section className="-mx-4 px-4 sm:mx-0 sm:px-0">
      {/* 
        Mobile: horizontal scroll with snap points
        Tablet (sm): 2-col grid  
        Medium (md): 3-col grid
        Desktop (lg): 5-col grid 
      */}
      <div className="
        flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide
        sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:snap-none
        md:grid-cols-3
        lg:grid-cols-5
      ">
        {MOCK_STATS.map((stat) => (
          <div
            key={stat.metricKey}
            className="min-w-[140px] snap-start flex-shrink-0 sm:min-w-0 sm:flex-shrink"
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>
    </section>
  );
}