export type EvidenceCategory =
  | 'look-alike-domain'
  | 'suspicious-url'
  | 'urgency-language'
  | 'suspicious-keywords'
  | 'sender-anomaly'
  | 'credential-request'
  | 'attachment'
  | 'legitimate';

export type EvidenceField = 'from' | 'subject' | 'body';

export interface Evidence {
  id: string;
  number: number;
  label: string;
  category: EvidenceCategory;
  field: EvidenceField;
  matchedText: string;
  explanation: string;
  whyItMatters: string;
  weight: number;
  start: number;
  end: number;
}

export type Verdict = 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' | 'CRITICAL RISK';

export interface DomainAnalysis {
  fromDomain: string;
  matchedBrand: string | null;
  expectedDomain: string | null;
  observedDomain: string;
  isLookalike: boolean;
  substitutions: { index: number; expectedChar: string; observedChar: string }[];
  similarity: number;
}

export interface UrlAnalysis {
  url: string;
  protocol: string;
  domain: string;
  path: string;
  query: string;
  isHttp: boolean;
  isIp: boolean;
  isShortened: boolean;
  isSuspicious: boolean;
  flags: string[];
}

export interface AnalysisResult {
  score: number;
  verdict: Verdict;
  evidence: Evidence[];
  indicatorsOfCompromise: string[];
  recommendedAction: string;
  domainAnalysis: DomainAnalysis | null;
  urlAnalysis: UrlAnalysis | null;
}

export interface EmailInput {
  from: string;
  subject: string;
  body: string;
}

export interface EmailSample extends EmailInput {
  id: string;
  name: string;
  category: 'phishing' | 'legitimate';
  time: string;
}

export interface HistoryEntry {
  caseId: string;
  from: string;
  subject: string;
  body: string;
  score: number;
  verdict: Verdict;
  timestamp: number;
  result: AnalysisResult;
}

export const EMAIL_SAMPLES: EmailSample[] = [
  {
    id: 'bank-alert',
    name: 'Fake Bank Alert',
    category: 'phishing',
    from: 'security@secure-bank-alert.com',
    subject: 'URGENT: Your account will be suspended today',
    time: '09:42 AM',
    body: 'Your account has been flagged for unusual activity.\n\nVerify your account immediately using:\nhttp://secure-bank-alert.com/verify\n\nFailure to verify within 24 hours may result in suspension.',
  },
  {
    id: 'delivery',
    name: 'Fake Delivery',
    category: 'phishing',
    from: 'delivery-update@parcel-confirm.net',
    subject: 'Your package could not be delivered',
    time: '02:17 PM',
    body: 'We were unable to deliver your package.\n\nPlease confirm your delivery information immediately:\nhttp://parcel-confirm.net/update',
  },
  {
    id: 'university',
    name: 'Fake University Email',
    category: 'phishing',
    from: 'it-support@university-security-help.com',
    subject: 'Your student account requires verification',
    time: '08:55 AM',
    body: 'Your student account requires verification.\n\nPlease confirm your login information within 24 hours.',
  },
  {
    id: 'legitimate',
    name: 'Legitimate Email',
    category: 'legitimate',
    from: 'notifications@collegeportal.edu',
    subject: "Reminder: Tomorrow's Project Review Meeting",
    time: '10:30 AM',
    body: 'Hello Student,\n\nThis is a reminder that your project review meeting is scheduled for tomorrow at 10:30 AM in the seminar hall.\n\nPlease bring your project documentation and arrive 10 minutes before the scheduled time.\n\nIf you have any questions, please contact your project coordinator through the official college portal.\n\nRegards,\nProject Coordination Team',
  },
];
