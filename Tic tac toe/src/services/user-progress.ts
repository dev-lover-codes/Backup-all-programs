'use server';

import { db } from '@/lib/firebase-admin';
import { EMOJI_OPTIONS } from '@/types';

interface UserProgress {
  stage?: number;
  playerEmoji?: string;
}

export async function getUserProgress(userId: string): Promise<UserProgress> {
  try {
    const docRef = db.collection('userProgress').doc(userId);
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data();
      return {
        stage: data?.stage,
        playerEmoji: data?.playerEmoji,
      };
    }
    return {};
  } catch (error) {
    console.error('Error getting user progress:', error);
    // In case of error, return a default state to avoid breaking the client.
    return { stage: 1, playerEmoji: EMOJI_OPTIONS[0] };
  }
}

export async function saveUserProgress(userId: string, progress: UserProgress): Promise<void> {
  try {
    const docRef = db.collection('userProgress').doc(userId);
    await docRef.set(progress, { merge: true });
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

export async function getInitialUserData(userId: string): Promise<UserProgress> {
  const progress = await getUserProgress(userId);
  return {
    stage: progress.stage || 1,
    playerEmoji: progress.playerEmoji || EMOJI_OPTIONS[0],
  };
}

export async function saveStage(userId: string, stage: number) {
  await saveUserProgress(userId, { stage });
}

export async function saveEmoji(userId: string, playerEmoji: string) {
  await saveUserProgress(userId, { playerEmoji });
}
