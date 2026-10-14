window.RS_PROGRESSION = {
  id: 'classic_knight_path',
  milestones: [
    { stage: 'Novice', jobId: 'novice', baseStart: 1, baseMilestone: 15, jobStart: 1, jobMilestone: 10, nextStage: 'Swordman' },
    { stage: 'Swordman', jobId: 'swordman', baseStart: 15, baseMilestone: 65, jobStart: 1, jobMilestone: 50, nextStage: 'Knight' },
    { stage: 'Knight', jobId: 'knight', baseStart: 65, baseMilestone: 80, jobStart: 1, jobMilestone: 50, nextStage: null }
  ],
  levelCap: { base: 99, job: 50 }
};
