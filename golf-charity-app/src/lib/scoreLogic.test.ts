import test from 'node:test';
import assert from 'node:assert';

// Define types
export type Score = {
  id: string;
  user_id: string;
  play_date: string;
  score: number;
  created_at: string;
};

// Core Domain Logic
export function processScoreSubmission(
  existingScores: Score[], 
  newScore: { score: number; play_date: string }
) {
  // 1. Validate Score
  if (!Number.isInteger(newScore.score)) {
    throw new Error('Score must be an integer.');
  }
  if (newScore.score < 1 || newScore.score > 45) {
    throw new Error('Score must be between 1 and 45 (Stableford logic).');
  }

  // 2. Validate Date
  if (!newScore.play_date || Number.isNaN(Date.parse(newScore.play_date))) {
    throw new Error('A valid dates must be included.');
  }

  // 3. Ascertain Rolling 5-Score Logic
  // Sort existing scores oldest first (by play_date, falling back to created_at)
  const sortedExisting = [...existingScores].sort((a, b) => {
    const timeA = new Date(a.play_date).getTime();
    const timeB = new Date(b.play_date).getTime();
    if (timeA === timeB) {
       return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return timeA - timeB;
  });

  const scoresToDelete: string[] = [];
  
  // If we already have 5 (or somehow more) scores, we need to delete the oldest until we have 4 left, 
  // so the new one makes exactly 5.
  if (sortedExisting.length >= 5) {
    const overs = sortedExisting.length - 4; // amount to delete
    for (let i = 0; i < overs; i++) {
       scoresToDelete.push(sortedExisting[i].id);
    }
  }

  return {
    valid: true,
    scoresToDelete
  };
}

// Unit Tests
test('processScoreSubmission - validates valid score and date', () => {
  const result = processScoreSubmission([], { score: 36, play_date: '2026-03-25T10:00:00Z' });
  assert.strictEqual(result.valid, true);
  assert.deepStrictEqual(result.scoresToDelete, []);
});

test('processScoreSubmission - rejects non-integer score', () => {
  assert.throws(
    () => processScoreSubmission([], { score: 36.5, play_date: '2026-03-25T10:00:00Z' }),
    /Score must be an integer/
  );
});

test('processScoreSubmission - rejects score out of bounds (< 1)', () => {
  assert.throws(
    () => processScoreSubmission([], { score: 0, play_date: '2026-03-25T10:00:00Z' }),
    /Score must be between 1 and 45/
  );
});

test('processScoreSubmission - rejects score out of bounds (> 45)', () => {
  assert.throws(
    () => processScoreSubmission([], { score: 46, play_date: '2026-03-25T10:00:00Z' }),
    /Score must be between 1 and 45/
  );
});

test('processScoreSubmission - rejects invalid date', () => {
  assert.throws(
    () => processScoreSubmission([], { score: 40, play_date: 'invalid-date' }),
    /A valid dates must be included/
  );
});

test('processScoreSubmission - handles under 5 scores without deletion', () => {
  const existing: Score[] = [
    { id: '1', user_id: 'usr1', play_date: '2026-01-01', score: 30, created_at: '2026-01-01' },
    { id: '2', user_id: 'usr1', play_date: '2026-01-02', score: 32, created_at: '2026-01-02' }
  ];
  const result = processScoreSubmission(existing, { score: 40, play_date: '2026-01-03' });
  assert.deepStrictEqual(result.scoresToDelete, []);
});

test('processScoreSubmission - handles exactly 5 scores (deletes oldest 1)', () => {
  const existing: Score[] = [
    { id: 'oldest', user_id: 'usr1', play_date: '2026-01-01', score: 30, created_at: '2026-01-01' },
    { id: '2', user_id: 'usr1', play_date: '2026-01-02', score: 31, created_at: '2026-01-02' },
    { id: '3', user_id: 'usr1', play_date: '2026-01-03', score: 32, created_at: '2026-01-03' },
    { id: '4', user_id: 'usr1', play_date: '2026-01-04', score: 33, created_at: '2026-01-04' },
    { id: '5', user_id: 'usr1', play_date: '2026-01-05', score: 34, created_at: '2026-01-05' }
  ];
  const result = processScoreSubmission(existing, { score: 40, play_date: '2026-01-06' });
  assert.deepStrictEqual(result.scoresToDelete, ['oldest']);
});

test('processScoreSubmission - handles > 5 scores if anomaly occurred (deletes oldest X)', () => {
  const existing: Score[] = [
    { id: 'oldest', user_id: 'usr1', play_date: '2026-01-01', score: 30, created_at: '2026-01-01' },
    { id: 'second-oldest', user_id: 'usr1', play_date: '2026-01-02', score: 31, created_at: '2026-01-02' },
    { id: '3', user_id: 'usr1', play_date: '2026-01-03', score: 32, created_at: '2026-01-03' },
    { id: '4', user_id: 'usr1', play_date: '2026-01-04', score: 33, created_at: '2026-01-04' },
    { id: '5', user_id: 'usr1', play_date: '2026-01-05', score: 34, created_at: '2026-01-05' },
    { id: '6', user_id: 'usr1', play_date: '2026-01-06', score: 35, created_at: '2026-01-06' }
  ];
  const result = processScoreSubmission(existing, { score: 40, play_date: '2026-01-07' });
  assert.deepStrictEqual(result.scoresToDelete, ['oldest', 'second-oldest']);
});
