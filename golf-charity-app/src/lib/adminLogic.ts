// ---- INTERFACES ----
export interface AdminScore {
  id: string;
  user_id: string;
  score: number;
  image_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
}

export interface UserSubscription {
  id: string;
  subscription_status: 'active' | 'inactive' | 'suspended';
  charity_contribution_percentage: number;
}

// ---- ENGINE LOGIC ----

export function verifyScoreImage(score: AdminScore, action: 'approve' | 'reject' | 'flag'): AdminScore {
  // Edge Case: Can't operate on already approved/rejected scores without special override, but for now we allow re-verifying if it was flagged.
  // Actually, let's enforce a strict state machine
  
  if (score.status !== 'pending' && score.status !== 'flagged') {
    throw new Error(`Cannot transition score from status: ${score.status}`);
  }

  if (action === 'approve') {
    if (!score.image_url) {
      throw new Error('Cannot approve a score without a valid image proof representation.');
    }
    return { ...score, status: 'approved' };
  }
  
  if (action === 'reject') {
    return { ...score, status: 'rejected' };
  }
  
  // Flag for manual higher-tier review
  return { ...score, status: 'flagged' };
}

export function editUserScore(score: AdminScore, newScoreValue: number): AdminScore {
  // Strict constraints
  if (!Number.isInteger(newScoreValue)) {
    throw new Error('Modified score must be a discrete integer.');
  }
  if (newScoreValue < 1 || newScoreValue > 45) {
    throw new Error('Modified score out of stableford bounds (1-45).');
  }

  return { ...score, score: newScoreValue, status: 'pending' }; // Editing a score resets it to pending verification
}

export function aggregateSystemAnalytics(users: UserSubscription[], monthlySubscriptionFee: number = 100) {
  if (monthlySubscriptionFee < 0) throw new Error('Subscription fee cannot be negative.');

  const totalUsers = users.length;
  const activeSubs = users.filter(u => u.subscription_status === 'active').length;
  
  // Calculate exact charity yields (e.g. 100 fee, 15% -> $15 to charity, $85 to prize pool)
  let charityContributionTotal = 0;
  let projectedPrizePool = 0;

  for (const user of users) {
    if (user.subscription_status === 'active') {
      // Validate percentage boundaries
      const percentage = Math.max(10, Math.min(100, user.charity_contribution_percentage));
      
      const charityAmt = monthlySubscriptionFee * (percentage / 100);
      const prizeAmt = monthlySubscriptionFee - charityAmt;
      
      charityContributionTotal += charityAmt;
      projectedPrizePool += prizeAmt;
    }
  }

  return {
    totalUsers,
    activeSubs,
    charityContributionTotal: parseFloat(charityContributionTotal.toFixed(2)),
    projectedPrizePool: parseFloat(projectedPrizePool.toFixed(2)),
  };
}
