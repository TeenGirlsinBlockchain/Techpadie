"use client";

import React from 'react';
import OptionSelector from './OptionSelector';

interface Step1PersonalInfoProps {
  onboardingData: {
    purpose: string;
    education: string;
    language: string; 
    web3Experience: string;
  };
  onDataChange: (key: string, value: string) => void;
}

export default function Step1PersonalInfo({ onboardingData, onDataChange }: Step1PersonalInfoProps) {
  return (
    <>
      <OptionSelector
        label="What brings you to Techpadie?"
        options={[
          { value: 'learn', label: 'Learn' },
          { value: 'earn', label: 'Earn' },
          { value: 'community', label: 'Community' },
        ]}
        selectedValue={onboardingData.purpose}
        onSelect={(value) => onDataChange('purpose', value)}
      />

      <OptionSelector
        label="Highest level of education?"
        options={[
          { value: 'high_school', label: 'High School' },
          { value: 'bachelor', label: 'Bachelor\'s Degree' },
          { value: 'master_phd', label: 'Master\'s/PhD' },
          { value: 'other', label: 'Other' },
        ]}
        selectedValue={onboardingData.education}
        onSelect={(value) => onDataChange('education', value)}
      />

      <OptionSelector
        label="Preferred language?" 
        options={[
          { value: 'english', label: 'English' },
          { value: 'spanish', label: 'Spanish' },
          { value: 'french', label: 'French' },
          { value: 'german', label: 'German' },
          { value: 'chinese', label: 'Chinese' },
        ]}
        selectedValue={onboardingData.language}
        onSelect={(value) => onDataChange('language', value)}
      />

   

      <OptionSelector
        label="What's your level of web3.0 experience?"
        options={[
          { value: '0-1_year', label: '0-1 year' },
          { value: '2-4_years', label: '2-4 years' },
          { value: '5_years_above', label: '5 years above' },
        ]}
        selectedValue={onboardingData.web3Experience}
        onSelect={(value) => onDataChange('web3Experience', value)}
      />
    </>
  );
}