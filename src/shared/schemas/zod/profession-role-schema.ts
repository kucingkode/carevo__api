import z from "zod";

export const professionRoleSchema = z.enum([
  "Product Manager / Project Manager",
  "UI/UX Designer & Researcher",
  "Front-End (FE) Developer",
  "Back-End (BE) Developer & Database Administrator",
  "Data Analyst & Business Intelligence (BI)",
  "Cybersecurity Analyst",
  "Business Analyst / ERP Consultant",
  "IT Governance & Risk Specialist",
  "Cloud & Infrastructure Engineer",
  "Machine Learning Engineer / AI Specialist",
]);

export type ProfessionRole = z.infer<typeof professionRoleSchema>;
