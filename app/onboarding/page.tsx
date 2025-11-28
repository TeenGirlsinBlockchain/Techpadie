"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingCard from './components/OnboardingCard';
import Step1PersonalInfo from './components/Step1PersonalInfo';
import Step2Knowledge from './components/Step2Knowledge';
import Step3Crypto from './components/Step3Crypto';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // State to store onboarding data (this would eventually be sent to the backend architectured by Tee and David)
  const [onboardingData, setOnboardingData] = useState({
    purpose: '',
    education: '',
    language: '', 
    web3Experience: '',
  });

  const handleDataChange = (key: string, value: string) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step, save data and redirect to dashboard or home
      console.log("Onboarding Complete! Data:", onboardingData);
      // In a real app, you'd send onboardingData to your API here.
      router.push('/dashboard'); // Redirect to dashboard after onboarding
    }
  };

  // Function to render the progress bar
  const renderProgressBar = () => (
    <div className="relative w-full max-w-md h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      ></div>
    </div>
  );

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo
            onboardingData={onboardingData}
            onDataChange={handleDataChange}
          />
        );
      case 2:
        return (
          <Step2Knowledge
             // If this step needs to interact with global state, pass relevant props
          />
        );
      case 3:
        return (
          <Step3Crypto
             // If this step needs to interact with global state, pass relevant props
          />
        );
      default:
        return null;
    }
  };

  // Determine title and description for each step
  const stepTitles = {
    1: "Welcome onboard",
    2: "More Knowledge",
    3: "Your Crypto",
  };

  const stepDescriptions = {
    1: "Let's get to know you!",
    2: "All in one place. Enjoy super-fast transactions with our wallet based on the Solana blockchain ecosystem.",
    3: "Access to more freedom. Enjoy super-fast transactions with our wallet based on the Solana blockchain ecosystem.",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6">
      {renderProgressBar()}
      <OnboardingCard
        title={stepTitles[currentStep as keyof typeof stepTitles]}
        description={stepDescriptions[currentStep as keyof typeof stepDescriptions]}
        onContinue={handleContinue}
        isLastStep={currentStep === totalSteps}
      >
        {getStepComponent()}
      </OnboardingCard>
    </div>
  );
}