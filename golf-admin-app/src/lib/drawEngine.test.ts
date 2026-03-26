import test from 'node:test';
import assert from 'node:assert';

// ---- INTERFACES ----
export interface DrawInput {
  totalPrizePool: number;
  previousRollover: number;
  winners5Count: number;
  winners4Count: number;
  winners3Count: number;
}

export interface DrawDistribution {
  tier5: {
    totalAllocated: number;
    payoutPerWinner: number;
    rolloverAmount: number;
  };
  tier4: {
    totalAllocated: number;
    payoutPerWinner: number;
    unclaimedToCharity: number; // If no rollover, it defaults to charity
  };
  tier3: {
    totalAllocated: number;
    payoutPerWinner: number;
    unclaimedToCharity: number;
  };
  summary: {
    totalPaidOut: number;
    totalRolledOver: number;
    totalUnclaimed: number;
  };
}

// ---- ENGINE LOGIC ----
export function calculatePrizeDistribution(input: DrawInput): string {
  if (input.totalPrizePool < 0 || input.previousRollover < 0) {
    throw new Error('Pools cannot be strictly negative.');
  }

  // 1. Calculate Base Allocations
  const tier5Base = input.totalPrizePool * 0.40;
  const tier4Base = input.totalPrizePool * 0.35;
  const tier3Base = input.totalPrizePool * 0.25;

  // 2. Build Tier 5 (40% + Rollover)
  const tier5Total = tier5Base + input.previousRollover;
  let tier5Payout = 0;
  let tier5Rollover = 0;

  if (input.winners5Count > 0) {
    // Split equally
    tier5Payout = parseFloat((tier5Total / input.winners5Count).toFixed(2));
  } else {
    // No winners, Jackpots roll over!
    tier5Rollover = parseFloat(tier5Total.toFixed(2));
  }

  // 3. Build Tier 4 (35% No rollover)
  let tier4Payout = 0;
  let tier4Unclaimed = 0;

  if (input.winners4Count > 0) {
    tier4Payout = parseFloat((tier4Base / input.winners4Count).toFixed(2));
  } else {
    tier4Unclaimed = parseFloat(tier4Base.toFixed(2));
  }

  // 4. Build Tier 3 (25% No rollover)
  let tier3Payout = 0;
  let tier3Unclaimed = 0;

  if (input.winners3Count > 0) {
    tier3Payout = parseFloat((tier3Base / input.winners3Count).toFixed(2));
  } else {
    tier3Unclaimed = parseFloat(tier3Base.toFixed(2));
  }

  // Calculate strict ledger sums
  const totalPaidOut = (tier5Payout * input.winners5Count) + 
                       (tier4Payout * input.winners4Count) + 
                       (tier3Payout * input.winners3Count);

  const totalUnclaimed = tier4Unclaimed + tier3Unclaimed;

  const distribution: DrawDistribution = {
    tier5: {
      totalAllocated: tier5Total,
      payoutPerWinner: tier5Payout,
      rolloverAmount: tier5Rollover,
    },
    tier4: {
      totalAllocated: tier4Base,
      payoutPerWinner: tier4Payout,
      unclaimedToCharity: tier4Unclaimed,
    },
    tier3: {
      totalAllocated: tier3Base,
      payoutPerWinner: tier3Payout,
      unclaimedToCharity: tier3Unclaimed,
    },
    summary: {
      totalPaidOut: parseFloat(totalPaidOut.toFixed(2)),
      totalRolledOver: tier5Rollover,
      totalUnclaimed: tier3Unclaimed,
    }
  };

  return JSON.stringify(distribution);
}


// ---- UNIT TESTS ----

test('Standard win distribution - 1 winner in each tier', () => {
  const resultStr = calculatePrizeDistribution({
    totalPrizePool: 1000,
    previousRollover: 0,
    winners5Count: 1,
    winners4Count: 1,
    winners3Count: 1,
  });
  
  const result: DrawDistribution = JSON.parse(resultStr);

  // 40% of 1000
  assert.strictEqual(result.tier5.totalAllocated, 400);
  assert.strictEqual(result.tier5.payoutPerWinner, 400);
  assert.strictEqual(result.tier5.rolloverAmount, 0);

  // 35% of 1000
  assert.strictEqual(result.tier4.payoutPerWinner, 350);
  assert.strictEqual(result.tier4.unclaimedToCharity, 0);

  // 25% of 1000
  assert.strictEqual(result.tier3.payoutPerWinner, 250);
  
  assert.strictEqual(result.summary.totalPaidOut, 1000);
});

test('Multiple winners share payout equally', () => {
  const resultStr = calculatePrizeDistribution({
    totalPrizePool: 1000,
    previousRollover: 0,
    winners5Count: 2,
    winners4Count: 10,
    winners3Count: 4,
  });
  
  const result: DrawDistribution = JSON.parse(resultStr);

  assert.strictEqual(result.tier5.payoutPerWinner, 200);   // 400 / 2
  assert.strictEqual(result.tier4.payoutPerWinner, 35);    // 350 / 10
  assert.strictEqual(result.tier3.payoutPerWinner, 62.5);  // 250 / 4
});

test('Zero winners triggers strict rollover logic', () => {
  const resultStr = calculatePrizeDistribution({
    totalPrizePool: 1000,
    previousRollover: 500, // Rolled over from last month!
    winners5Count: 0, // No jackpot winner
    winners4Count: 0, // No tier 4 winners
    winners3Count: 0, // No tier 3 winners
  });
  
  const result: DrawDistribution = JSON.parse(resultStr);

  // Jackpot rolls over! (400 base + 500 previous)
  assert.strictEqual(result.tier5.totalAllocated, 900);
  assert.strictEqual(result.tier5.payoutPerWinner, 0);
  assert.strictEqual(result.tier5.rolloverAmount, 900);

  // Tier 4 does NOT roll over (350 to charity)
  assert.strictEqual(result.tier4.payoutPerWinner, 0);
  assert.strictEqual(result.tier4.unclaimedToCharity, 350);

  // Tier 3 does NOT roll over (250 to charity)
  assert.strictEqual(result.tier3.payoutPerWinner, 0);
  assert.strictEqual(result.tier3.unclaimedToCharity, 250);

  assert.strictEqual(result.summary.totalPaidOut, 0);
  assert.strictEqual(result.summary.totalRolledOver, 900);
});

test('Rejects negative inputs', () => {
  assert.throws(
    () => calculatePrizeDistribution({
      totalPrizePool: -100,
      previousRollover: 0,
      winners5Count: 0,
       winners4Count: 0,
      winners3Count: 0,
    }),
    /Pools cannot be strictly negative/
  );
});
