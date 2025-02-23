import { VotingSession } from './interface';

// Fungsi untuk mengubah nested array ke bentuk object
export const deserializeSession = (data: any[]): VotingSession => {
  return {
    id: data[0],
    title: data[1],
    description: data[2],
    createdAt: data[3],
    expiresAt: data[4],
    creator: data[5],
    candidates: data[6].map((c: any) => ({
      id: c[0],
      name: c[1],
      description: c[2],
      voteCount: c[3],
    })),
  };
};
