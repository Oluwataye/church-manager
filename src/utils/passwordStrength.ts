export interface PasswordStrength {
  score: number; // 0-4 (weak to very strong)
  label: string;
  color: string;
  feedback: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 16) {
    score += 2;
  } else if (password.length >= 12) {
    score += 1;
    feedback.push("Use at least 16 characters for better security");
  } else {
    feedback.push("Password must be at least 16 characters");
  }

  // Complexity checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include both uppercase and lowercase letters");
  }

  if (/\d/.test(password)) {
    score += 0.5;
  } else {
    feedback.push("Include at least one number");
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 0.5;
  } else {
    feedback.push("Include at least one special character (!@#$%^&* etc.)");
  }

  // Common patterns penalty
  if (/^(?:123|abc|qwe|password|admin)/i.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push("Avoid common patterns or words");
  }

  // Normalize score to 0-4
  const normalizedScore = Math.min(4, Math.floor(score));

  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = [
    "hsl(var(--destructive))",
    "hsl(var(--warning))",
    "hsl(var(--chart-3))",
    "hsl(var(--success))",
    "hsl(var(--success))"
  ];

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    color: colors[normalizedScore],
    feedback: feedback.length > 0 ? feedback : ["Password meets all requirements"],
  };
}
