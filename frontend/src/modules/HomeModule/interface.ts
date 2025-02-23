// Interface yang sesuai
export interface Candidate {
  id: number;
  name: string;
  description: string;
  voteCount: number;
}

export interface VotingSession {
  id: number;
  title: string;
  description: string;
  createdAt: number; // Timestamp (ms)
  expiresAt: number; // Timestamp (ms)
  creator: string;
  candidates: Candidate[];
}
