'use client';

import React from 'react';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import ActivityItem from '../cards/ActivityItem';
import { MOCK_ACTIVITY } from '@/app/lib/mockData';

export default function RecentActivity() {
  const { t } = useTranslation();

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
      <h2 className="text-lg font-bold text-text-primary mb-4">
        {t('dashboard.recentActivity')}
      </h2>

      <div className="divide-y divide-gray-50">
        {MOCK_ACTIVITY.slice(0, 5).map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>

      {MOCK_ACTIVITY.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-text-tertiary">No recent activity yet. Start learning!</p>
        </div>
      )}
    </section>
  );
}