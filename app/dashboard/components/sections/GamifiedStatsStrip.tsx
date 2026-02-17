'use client';

import React from 'react';
import StatCard from '../cards/StatCard';
import { MOCK_STATS } from '@/app/lib/mockData';

export default function GamifiedStatsStrip() {
  return (
    <section>
      {/* Mobile: horizontal scroll. Desktop: 5-col grid */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
        {MOCK_STATS.map((stat) => (
          <div key={stat.metricKey} className="min-w-40 lg:min-w-0 shrink-0 lg:shrink">
            <StatCard {...stat} />
          </div>
        ))}
      </div>
    </section>
  );
}