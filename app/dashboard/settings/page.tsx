'use client';

import React from 'react';
import { useUser } from '@/app/context/UserContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import { SUPPORTED_LANGUAGES, PLAYBACK_SPEEDS } from '@/app/lib/constants';
import type { LanguageCode } from '@/app/types';
import {
  UserCircleIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  BellIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

function SettingsSection({ icon: Icon, title, children }: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-xl bg-brand-50 flex items-center justify-center">
          <Icon className="h-4.5 w-4.5 text-brand-500" />
        </div>
        <h2 className="text-base font-bold text-text-primary">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingsRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {description && <p className="text-xs text-text-tertiary mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
        ${checked ? 'bg-brand-500' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, preferences, updatePreferences } = useUser();
  const { locale, setLocale } = useLanguage();

  return (
    <div className="space-y-5 md:space-y-6 pb-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{t('nav.settings')}</h1>
        <p className="text-text-tertiary text-sm mt-1">Manage your preferences.</p>
      </div>

      {/* Profile */}
      <SettingsSection icon={UserCircleIcon} title="Profile">
        <SettingsRow label="Name">
          <p className="text-sm text-text-secondary font-medium">{user.name}</p>
        </SettingsRow>
        <SettingsRow label="Email">
          <p className="text-sm text-text-secondary font-medium">{user.email}</p>
        </SettingsRow>
        <SettingsRow label="Role">
          <p className="text-sm text-text-secondary font-medium capitalize">{user.role}</p>
        </SettingsRow>
      </SettingsSection>

      {/* Language */}
      <SettingsSection icon={GlobeAltIcon} title="Language">
        <SettingsRow label="Platform Language" description="Changes all UI text. Course content depends on availability.">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as LanguageCode)}
            className="text-sm bg-surface-tertiary border-0 rounded-xl px-3 py-2 text-text-primary font-medium
              focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Audio */}
      <SettingsSection icon={MusicalNoteIcon} title="Audio Learning">
        <SettingsRow label="Auto-play audio" description="Automatically play lesson audio when opening a lesson.">
          <Toggle
            checked={preferences.audioAutoplay}
            onChange={(v) => updatePreferences({ audioAutoplay: v })}
          />
        </SettingsRow>
        <SettingsRow label="Default playback speed">
          <select
            value={preferences.playbackSpeed}
            onChange={(e) => updatePreferences({ playbackSpeed: Number(e.target.value) })}
            className="text-sm bg-surface-tertiary border-0 rounded-xl px-3 py-2 text-text-primary font-medium
              focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {PLAYBACK_SPEEDS.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Learning Goals */}
      <SettingsSection icon={ClockIcon} title="Learning Goals">
        <SettingsRow label="Daily goal" description="How many minutes per day do you want to learn?">
          <select
            value={preferences.dailyGoalMinutes}
            onChange={(e) => updatePreferences({ dailyGoalMinutes: Number(e.target.value) })}
            className="text-sm bg-surface-tertiary border-0 rounded-xl px-3 py-2 text-text-primary font-medium
              focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {[10, 15, 20, 30, 45, 60].map((mins) => (
              <option key={mins} value={mins}>
                {mins} minutes
              </option>
            ))}
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={BellIcon} title="Notifications">
        <SettingsRow label="Email notifications" description="Receive streak reminders and course updates.">
          <Toggle
            checked={preferences.emailNotifications}
            onChange={(v) => updatePreferences({ emailNotifications: v })}
          />
        </SettingsRow>
      </SettingsSection>

      {/* Account */}
      <SettingsSection icon={ShieldCheckIcon} title="Account">
        <SettingsRow label="Account created">
          <p className="text-sm text-text-tertiary font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </SettingsRow>
        <div className="pt-2">
          <button className="text-sm font-semibold text-feedback-error hover:underline transition-colors">
            Delete Account
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}