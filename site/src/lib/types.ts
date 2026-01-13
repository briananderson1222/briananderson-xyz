export interface ResumeJob {
  role: string;
  company: string;
  location: string;
  period: string;
  description?: string;
  highlights: string[];
}

export interface ResumeSkillCategory {
  [category: string]: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  period: string;
  location: string;
}

export interface ResumeCertificate {
  name: string;
  period: string;
  url?: string;
}

export interface ResumeEarlyCareer {
  role: string;
  company: string;
  period: string;
  location: string;
}

export interface Resume {
  name: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  summary: string;
  skills: ResumeSkillCategory;
  experience: ResumeJob[];
  education: ResumeEducation[];
  certificates: ResumeCertificate[];
  'early-career'?: ResumeEarlyCareer[];
}
