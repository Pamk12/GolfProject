import test from 'node:test';
import assert from 'node:assert';
import { verifyScoreImage, editUserScore, aggregateSystemAnalytics, AdminScore, UserSubscription } from './adminLogic';

// ---- UNIT TESTS ----

test('verifyScoreImage - successfully approves pending score with image', () => {
  const initial: AdminScore = { id: 's1', user_id: 'u1', score: 36, image_url: 'https://...', status: 'pending' };
  const result = verifyScoreImage(initial, 'approve');
  assert.strictEqual(result.status, 'approved');
});

test('verifyScoreImage - successfully rejects pending score without image', () => {
  const initial: AdminScore = { id: 's2', user_id: 'u1', score: 40, status: 'pending' };
  const result = verifyScoreImage(initial, 'reject');
  assert.strictEqual(result.status, 'rejected');
});

test('verifyScoreImage - fails to approve if missing image', () => {
  const initial: AdminScore = { id: 's3', user_id: 'u1', score: 20, status: 'pending' };
  assert.throws(
    () => verifyScoreImage(initial, 'approve'),
    /valid image proof/
  );
});

test('verifyScoreImage - blocks overriding already approved status', () => {
  const initial: AdminScore = { id: 's4', user_id: 'u1', score: 20, status: 'approved' };
  assert.throws(
    () => verifyScoreImage(initial, 'reject'),
    /Cannot transition score/
  );
});

test('editUserScore - successfully edits within bounds and resets to pending', () => {
  const initial: AdminScore = { id: 's1', user_id: 'u1', score: 10, status: 'approved' };
  const result = editUserScore(initial, 45);
  assert.strictEqual(result.score, 45);
  assert.strictEqual(result.status, 'pending');
});

test('editUserScore - blocks out of bound edits (> 45)', () => {
  const initial: AdminScore = { id: 's1', user_id: 'u1', score: 10, status: 'approved' };
  assert.throws(() => editUserScore(initial, 46), /stableford bounds/);
});

test('editUserScore - blocks out of bound edits (< 1)', () => {
  const initial: AdminScore = { id: 's1', user_id: 'u1', score: 10, status: 'approved' };
  assert.throws(() => editUserScore(initial, 0), /stableford bounds/);
});

test('aggregateSystemAnalytics - correctly sums 10%, 20%, 50% contributions', () => {
  const users: UserSubscription[] = [
    { id: '1', subscription_status: 'active', charity_contribution_percentage: 10 },
    { id: '2', subscription_status: 'active', charity_contribution_percentage: 20 },
    { id: '3', subscription_status: 'active', charity_contribution_percentage: 50 },
    { id: '4', subscription_status: 'inactive', charity_contribution_percentage: 100 }, // Should be ignored
  ];
  
  // $100 sub fee -> Charity gets $10 + $20 + $50 = $80
  // Prize pool gets $90 + $80 + $50 = $220
  const result = aggregateSystemAnalytics(users, 100);
  
  assert.strictEqual(result.totalUsers, 4);
  assert.strictEqual(result.activeSubs, 3);
  assert.strictEqual(result.charityContributionTotal, 80);
  assert.strictEqual(result.projectedPrizePool, 220);
});

test('aggregateSystemAnalytics - enforces minimum 10% charity baseline even if DB is malformed', () => {
  const users: UserSubscription[] = [
    { id: '1', subscription_status: 'active', charity_contribution_percentage: 5 }, // Enforces 10%
  ];
  
  const result = aggregateSystemAnalytics(users, 100);
  assert.strictEqual(result.charityContributionTotal, 10);
  assert.strictEqual(result.projectedPrizePool, 90);
});
