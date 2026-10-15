window.RS_PROGRESSION = {
  id: "renewal_knight_job_path",
  milestones: [
    {
      stage: "Novice",
      jobId: "novice",
      jobStart: 1,
      jobMilestone: 10,
      nextStage: "Swordman",
    },
    {
      stage: "Swordman",
      jobId: "swordman",
      jobStart: 1,
      jobMilestone: 50,
      nextStage: "Knight",
    },
    {
      stage: "Knight",
      jobId: "knight",
      jobStart: 1,
      jobMilestone: 50,
      nextStage: null,
    },
  ],
  levelCap: { base: 99, job: 50 },
};
