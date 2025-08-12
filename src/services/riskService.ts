// src/services/riskService.ts

type RiskLevel =
  | "Conservative"
  | "Moderately Conservative"
  | "Moderate"
  | "Moderately Aggressive"
  | "Aggressive";

interface RiskInput {
  objective: "FIXED_INCOME" | "BALANCED" | "GROWTH";
  knowledgeLevel: "NONE" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  investmentHorizon: "LESS_THAN_1_YEAR" | "ONE_TO_TWO_YEARS" | "THREE_TO_FOUR_YEARS" | "FIVE_PLUS_YEARS";
}

export const recommendRiskProfile = (input: RiskInput): RiskLevel => {
  const { objective, knowledgeLevel, investmentHorizon } = input;

  let score = 0;

  // Objective
  if (objective === "FIXED_INCOME") score += 0;
  else if (objective === "BALANCED") score += 1;
  else if (objective === "GROWTH") score += 2;

  // Knowledge
  if (knowledgeLevel === "NONE") score += 0;
  else if (knowledgeLevel === "BEGINNER") score += 1;
  else if (knowledgeLevel === "INTERMEDIATE") score += 2;
  else if (knowledgeLevel === "ADVANCED") score += 3;

  // Horizon
  if (investmentHorizon === "LESS_THAN_1_YEAR") score += 0;
  else if (investmentHorizon === "ONE_TO_TWO_YEARS") score += 1;
  else if (investmentHorizon === "THREE_TO_FOUR_YEARS") score += 2;
  else if (investmentHorizon === "FIVE_PLUS_YEARS") score += 3;

  if (score <= 2) return "Conservative";
  else if (score <= 4) return "Moderately Conservative";
  else if (score <= 6) return "Moderate";
  else if (score === 7) return "Moderately Aggressive";
  else return "Aggressive";
};
