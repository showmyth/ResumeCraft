import { describe, it, expect } from "vitest";
import { QUIZ_QUESTIONS, scoreQuiz } from "../quizData";
import { DOMAINS } from "../domains";

describe("QUIZ_QUESTIONS", () => {
  it("has 8 questions, each with 5 options", () => {
    expect(QUIZ_QUESTIONS.length).toBe(8);
    QUIZ_QUESTIONS.forEach((q) => expect(q.options.length).toBe(5));
  });

  it("every option's domain is a real, known domain id", () => {
    const validIds = new Set(DOMAINS.map((d) => d.id));
    for (const q of QUIZ_QUESTIONS) {
      for (const opt of q.options) {
        expect(validIds.has(opt.domain), `unknown domain "${opt.domain}" in question ${q.id}`).toBe(true);
      }
    }
  });

  it("gives every domain the same number of scoring opportunities (fairness check)", () => {
    const counts = {};
    for (const q of QUIZ_QUESTIONS) {
      for (const opt of q.options) counts[opt.domain] = (counts[opt.domain] || 0) + 1;
    }
    const values = Object.values(counts);
    expect(new Set(values).size).toBe(1); // all counts identical
    expect(Object.keys(counts).length).toBe(DOMAINS.length); // every domain appears
  });
});

describe("scoreQuiz", () => {
  it("ranks the domain with the most answers first", () => {
    const answers = { q1: "ai-ml", q2: "ai-ml", q3: "ai-ml", q4: "swe" };
    const result = scoreQuiz(answers);
    expect(result[0].domain).toBe("ai-ml");
    expect(result[0].score).toBe(3);
  });

  it("handles a tie by including both at the top", () => {
    const answers = { q1: "swe", q2: "ai-ml" };
    const result = scoreQuiz(answers);
    expect(result[0].score).toBe(1);
    expect(result[1].score).toBe(1);
  });

  it("handles no answers without throwing", () => {
    expect(() => scoreQuiz({})).not.toThrow();
    expect(scoreQuiz({})).toEqual([]);
  });
});
