'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useWalletSelector } from '@near-wallet-selector/react-hook';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { HelloNearContract } from '@/config';
import { VotingSession } from './interface';
import { deserializeSession } from './serializers';
import { Loader } from 'lucide-react';

export const HomeModule = () => {
  const { signedAccountId, callFunction, viewFunction } = useWalletSelector();

  const [sessions, setSessions] = useState<VotingSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [selectedVote, setSelectedVote] = useState<{
    sessionId: number;
    candidateId: number;
    candidateName: string;
    sessionTitle: string;
  } | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const getSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessions = await viewFunction({
        contractId: HelloNearContract,
        method: 'get_all_sessions',
      });
      const deserializedSessions = (sessions as any[]).map((session) =>
        deserializeSession(session),
      );
      setSessions(deserializedSessions.reverse());
    } catch (err) {
      console.log(err);
      toast.error('Failed to get sessions!');
    } finally {
      setIsLoading(false);
    }
  }, [viewFunction]);

  useEffect(() => {
    void getSessions();
  }, [getSessions]);

  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  const handleVoteClick = (
    sessionId: number,
    candidateId: number,
    candidateName: string,
    sessionTitle: string,
  ) => {
    if (!loggedIn) {
      toast.error('Please login to vote!');
      return;
    }
    setSelectedVote({ sessionId, candidateId, candidateName, sessionTitle });
  };

  const handleVoteConfirm = async () => {
    if (!selectedVote) return;

    try {
      setIsVoting(true);
      const body = {
        session_id: selectedVote.sessionId,
        candidate_id: selectedVote.candidateId,
      };
      callFunction({
        contractId: HelloNearContract,
        method: 'vote',
        args: body,
      });
      await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms delay to show spinner

      toast.success('Vote submitted successfully!');
      setSelectedVote(null);
      // Refresh sessions after voting
      await getSessions();
    } catch (err) {
      console.log(err);
      toast.error('Failed to submit vote!');
    } finally {
      setIsVoting(false);
    }
  };

  const epochToDayLeft = (epoch: number) => {
    return Math.max(0, Math.ceil((epoch - Date.now()) / (1000 * 60 * 60 * 24)));
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Active Voting Sessions
          </h1>
          <p className="text-muted-foreground">
            Cast your vote in our ongoing elections
          </p>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="min-h-12 flex justify-center items-center">
              <Loader className="animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <span className="text-center text-gray-500 mt-4">
              No voting sessions available. <br />
              Please create one or check back later.
            </span>
          ) : (
            sessions.map((session) => {
              const totalVote = session.candidates.reduce(
                (sum, candidate) => sum + candidate.voteCount,
                0,
              );

              return (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{session.title}</CardTitle>
                        <CardDescription>
                          {session.description}.{' '}
                          <span className="text-red-600">
                            Voting ends in {epochToDayLeft(session.expiresAt)}{' '}
                            day(s)
                          </span>
                        </CardDescription>
                      </div>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Show menu</span>
                      </Button>
                    </div>
                    {/* Creator Info */}
                    <div className="flex items-center gap-2 mt-2">
                      <Image
                        src="/placeholder.png?height=24&width=24"
                        alt="Creator"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="text-sm text-muted-foreground">
                        Created by{' '}
                        <span className="font-medium text-foreground">
                          {session.creator}
                        </span>
                        <span className="mx-1">•</span>
                        <time dateTime="2024-02-20">
                          {new Date(session.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )}
                        </time>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    {session.candidates.map((candidate) => {
                      return (
                        <div key={candidate.id} className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Image
                              src="/placeholder.png?height=64&width=64"
                              alt={candidate.name}
                              width={64}
                              height={64}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {candidate.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {candidate.description}
                              </p>
                            </div>
                            <Button
                              onClick={() =>
                                handleVoteClick(
                                  session.id,
                                  candidate.id,
                                  candidate.name,
                                  session.title,
                                )
                              }
                              disabled={epochToDayLeft(session.expiresAt) <= 0}
                            >
                              Vote
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Current Votes</span>
                              <span>{candidate.voteCount}</span>
                            </div>
                            <Progress
                              value={(candidate.voteCount / totalVote) * 100}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedVote} onOpenChange={() => setSelectedVote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              You are about to vote in &quot;{selectedVote?.sessionTitle}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-center text-lg font-medium">
              Are you sure you want to vote for
              <span className="font-semibold text-primary">
                {' '}
                {selectedVote?.candidateName}
              </span>
              ?
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedVote(null)}
              disabled={isVoting}
            >
              Cancel
            </Button>
            <Button onClick={handleVoteConfirm} disabled={isVoting}>
              {isVoting ? 'Submitting...' : 'Confirm Vote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};
