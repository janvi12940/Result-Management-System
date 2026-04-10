const subjectKeys = ["math", "science", "english", "computer"];

const calculateResult = (marks) => {
  const total = subjectKeys.reduce((sum, subject) => sum + Number(marks[subject] || 0), 0);
  const percentage = Number((total / subjectKeys.length).toFixed(2));

  let grade = "F";
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B";
  else if (percentage >= 60) grade = "C";
  else if (percentage >= 50) grade = "D";

  return { total, percentage, grade };
};

module.exports = { calculateResult, subjectKeys };
