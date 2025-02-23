use near_sdk::{
    collections::{LookupMap, UnorderedMap},
    env, near, AccountId,
};

#[near]
pub struct VotingSession {
    title: String,
    description: String,
    created_at: u64,
    expires_at: u64,
    creator: AccountId,
}

#[near]
pub struct Candidate {
    session_id: u64,
    name: String,
    description: String,
}

#[near]
pub struct Vote {
    candidate_id: u64,
    voter: AccountId,
    voted_at: u64,
}

#[near(contract_state)]
pub struct Contract {
    sessions: UnorderedMap<u64, VotingSession>,
    candidates: UnorderedMap<u64, Candidate>,
    votes: UnorderedMap<u64, Vote>,
    next_session_id: u64,
    next_candidate_id: u64,
    next_vote_id: u64,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            sessions: UnorderedMap::new(b"s"),
            candidates: UnorderedMap::new(b"c"),
            votes: UnorderedMap::new(b"v"),
            next_session_id: 1,
            next_candidate_id: 1,
            next_vote_id: 1,
        }
    }
}

#[near]
impl Contract {
    pub fn create_voting_session(
        &mut self,
        title: String,
        description: String,
        expires_at: u64,
        candidates: Vec<(String, String)>,
    ) -> u64 {
        let session_id = self.next_session_id;
        self.next_session_id += 1;

        let creator = env::signer_account_id();
        let session = VotingSession {
            title,
            description,
            created_at: env::block_timestamp_ms(),
            expires_at,
            creator,
        };

        self.sessions.insert(&session_id, &session);

        for (name, description) in candidates {
            let candidate_id = self.next_candidate_id;
            self.next_candidate_id += 1;

            let candidate = Candidate {
                session_id,
                name,
                description,
            };
            self.candidates.insert(&candidate_id, &candidate);
        }

        env::log_str(&format!("Voting session {} created", session_id));
        session_id
    }

    pub fn vote(&mut self, candidate_id: u64) -> u64 {
        let voter = env::signer_account_id();
        let current_time = env::block_timestamp_ms();

        let candidate = self
            .candidates
            .get(&candidate_id)
            .expect("Candidate not found!");

        let session = self
            .sessions
            .get(&candidate.session_id)
            .expect("Session not found!");

        if current_time > session.expires_at {
            env::panic_str("Voting session has ended! You cannot vote anymore.");
        }

        for (existing_candidate_id, existing_candidate) in self.candidates.iter() {
            if (existing_candidate.session_id == candidate.session_id) {
                for (_, existing_vote) in self.votes.iter() {
                    if existing_vote.voter == voter
                        && existing_vote.candidate_id == existing_candidate_id
                    {
                        env::panic_str("You have already voted in this session!");
                    }
                }
            }
        }

        let vote_id = self.next_vote_id;
        self.next_vote_id += 1;

        let vote = Vote {
            candidate_id,
            voter,
            voted_at: env::block_timestamp_ms(),
        };

        self.votes.insert(&vote_id, &vote);
        env::log_str(&format!(
            "Vote {} casted for candidate {}",
            vote_id, candidate_id
        ));

        vote_id
    }

    pub fn get_all_sessions(
        &self,
    ) -> Vec<(
        u64,
        String,
        String,
        u64,
        u64,
        AccountId,
        Vec<(u64, String, String, i32)>,
    )> {
        let mut sessions_list = Vec::new();

        for session_id in self.sessions.keys().collect::<Vec<u64>>() {
            if let Some(session) = self.sessions.get(&session_id) {
                let mut candidates_list = Vec::new();

                for candidate_id in self.candidates.keys().collect::<Vec<u64>>() {
                    if let Some(candidate) = self.candidates.get(&candidate_id) {
                        if candidate.session_id == session_id {
                            let vote_count = self
                                .votes
                                .keys()
                                .collect::<Vec<u64>>()
                                .iter()
                                .filter(|&&vote_id| {
                                    if let Some(vote) = self.votes.get(&vote_id) {
                                        vote.candidate_id == candidate_id
                                            && candidate.session_id == session_id
                                    } else {
                                        false
                                    }
                                })
                                .count() as i32;

                            candidates_list.push((
                                candidate_id,
                                candidate.name.clone(),
                                candidate.description.clone(),
                                vote_count,
                            ));
                        }
                    }
                }

                sessions_list.push((
                    session_id,
                    session.title.clone(),
                    session.description.clone(),
                    session.created_at,
                    session.expires_at,
                    session.creator.clone(),
                    candidates_list,
                ));
            }
        }

        sessions_list
    }
}
