import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MascotBanner from '../MascotBanner';

// Mock console.log for the button click handler, which is not essential to test here
// but prevents test runner output clutter.
global.console = { ...global.console, log: jest.fn() };


describe('MascotBanner Gamification Logic', () => {

  // Test Case 1: High Consistency (Streak >= 7 days)
  it('should display the happy message and green theme for a high, consistent streak', () => {
    const props = { currentStreak: 10, dailyGoalMet: true };
    render(<MascotBanner {...props} />);

    // Check for theme color/class (Jest will match partial class names)
    const banner = screen.getByRole('button', { name: /View Rewards/i }).closest('div');
    expect(banner).toHaveClass('bg-green-700/80');

    // Check for key message content
    expect(screen.getByText(/Techpadie Mascot says:/i)).toBeInTheDocument();
    expect(screen.getByText(/You've maintained a 10-day streak!/i)).toBeInTheDocument();

    // Check for happy emoji (based on the MascotPlaceholder implementation)
    expect(screen.getByText('😀')).toBeInTheDocument();
  });

  // Test Case 2: Low Consistency (Streak < 7 days, but consistent)
  it('should display the happy message and green theme for a short, consistent streak', () => {
    const props = { currentStreak: 3, dailyGoalMet: true };
    render(<MascotBanner {...props} />);
    
    // Check for green theme
    const banner = screen.getByRole('button', { name: /View Rewards/i }).closest('div');
    expect(banner).toHaveClass('bg-green-700/80');

    // Check for short streak message
    expect(screen.getByText(/Your learning streak is at 3 days./i)).toBeInTheDocument();
    expect(screen.getByText('😀')).toBeInTheDocument();
  });

  // Test Case 3: Break in Streak (Streak === 0, Goal Not Met)
  it('should display the sad message and red theme when the goal is not met and streak is 0', () => {
    const props = { currentStreak: 0, dailyGoalMet: false };
    render(<MascotBanner {...props} />);

    // Check for red theme
    const banner = screen.getByRole('button', { name: /View Rewards/i }).closest('div');
    expect(banner).toHaveClass('bg-red-700/80');

    // Check for warning message
    expect(screen.getByText(/Uh oh! You haven't started your learning today./i)).toBeInTheDocument();

    // Check for sad emoji
    expect(screen.getByText('😞')).toBeInTheDocument();
  });

  // Test Case 4: Streak in Danger (Streak > 0, but Today's Goal Not Met)
  it('should display the warning message and yellow theme when streak is in danger', () => {
    const props = { currentStreak: 5, dailyGoalMet: false };
    render(<MascotBanner {...props} />);

    // Check for yellow theme
    const banner = screen.getByRole('button', { name: /View Rewards/i }).closest('div');
    expect(banner).toHaveClass('bg-yellow-700/80');

    // Check for "finish strong" message
    expect(screen.getByText(/today's goal is incomplete! Finish strong!/i)).toBeInTheDocument();

    // Check for sad emoji (since goal is unmet, mascot is disappointed)
    expect(screen.getByText('😞')).toBeInTheDocument();
  });
  
  // Test Case 5: Verify the View Rewards button is present
  it('should have a working View Rewards button', () => {
    const props = { currentStreak: 1, dailyGoalMet: true };
    render(<MascotBanner {...props} />);
    
    const button = screen.getByRole('button', { name: /View Rewards/i });
    expect(button).toBeInTheDocument();
    
    // Optional: Test the onClick handler (though mostly for coverage, the console.log mock handles the actual function call)
    fireEvent.click(button);
    expect(global.console.log).toHaveBeenCalledWith('Gamification link clicked');
  });
});