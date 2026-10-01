/**
 * Grading scale — adjust thresholds here for the whole application.
 */
export const GRADING_SCALE = [
  { min: 80, max: 100, grade: "A" },
  { min: 70, max: 79, grade: "B" },
  { min: 60, max: 69, grade: "C" },
  { min: 50, max: 59, grade: "D" },
  { min: 0, max: 49, grade: "E" },
];

export const PASS_MARK = 50;

export function gradeFromMarks(marks) {
  const numeric = Number(marks);
  if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
    return null;
  }
  const rounded = Math.round(numeric);
  for (const band of GRADING_SCALE) {
    if (rounded >= band.min && rounded <= band.max) {
      return band.grade;
    }
  }
  return "E";
}

export function isPassing(marks) {
  return Number(marks) >= PASS_MARK;
}
