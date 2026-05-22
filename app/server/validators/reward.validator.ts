import { z } from 'zod';

export const claimRewardSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  walletAddress: z
    .string()
    .min(1, 'Wallet address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM/Flare wallet address format'),
});

export type ClaimRewardInput = z.infer<typeof claimRewardSchema>;
