import type { EmailInput, Evidence, AnalysisResult, DomainAnalysis, UrlAnalysis, Verdict } from '@/data/samples';

// ── Known brands for look-alike detection ──
const KNOWN_BRANDS: { domain: string; aliases: string[] }[] = [
  { domain: 'paypal.com', aliases: ['paypal', 'paypa'] },
  { domain: 'netflix.com', aliases: ['netflix', 'netfl'] },
  { domain: 'amazon.com', aliases: ['amazon', 'amazn'] },
  { domain: 'google.com', aliases: ['google'] },
  { domain: 'microsoft.com', aliases: ['microsoft', 'microsft'] },
  { domain: 'apple.com', aliases: ['apple'] },
  { domain: 'bankofamerica.com', aliases: ['bankofamerica', 'bofa'] },
  { domain: 'chase.com', aliases: ['chase'] },
  { domain: 'wellsfargo.com', aliases: ['wellsfargo'] },
  { domain: 'fedex.com', aliases: ['fedex', 'fedx'] },
  { domain: 'ups.com', aliases: ['ups'] },
  { domain: 'dhl.com', aliases: ['dhl'] },
  { domain: 'github.com', aliases: ['github'] },
  { domain: 'linkedin.com', aliases: ['linkedin'] },
  { domain: 'facebook.com', aliases: ['facebook'] },
  { domain: 'instagram.com', aliases: ['instagram'] },
  { domain: 'twitter.com', aliases: ['twitter'] },
  { domain: 'spotify.com', aliases: ['spotify'] },
];

const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'live.com', 'aol.com', 'protonmail.com', 'icloud.com',
  'mail.com', 'yandex.com', 'zoho.com',
];

const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly',
  'is.gd', 'buff.ly', 'rebrand.ly', 'shorturl.at', 'cutt.ly',
];

const URGENCY_PHRASES = [
  'immediately', 'urgent', 'act now', 'account suspended',
  'verify now', 'within 24 hours', 'within 48 hours', 'within 12 hours',
  'final warning', 'limited time', 'will be suspended', 'will be deactivated',
  'will be cancelled', 'failure to verify', 'avoid suspension',
  'permanent suspension', 'act quickly', 'expires today',
  'last chance', 'deadline', 'before it expires', 'requires immediate',
];

const SUSPICIOUS_KEYWORDS = [
  'verify your account', 'verify your identity', 'confirm your delivery',
  'update your payment', 'suspended', 'deactivated', 'flagged for unusual activity',
  'verify', 'confirm your', 'update your', 'validate your',
  'security alert', 'unusual activity', 'account locked',
];

const CREDENTIAL_PHRASES = [
  'password', 'otp', 'pin', 'banking information', 'card information',
  'login credentials', 'credit card', 'cvv', 'social security',
  'account number', 'routing number', 'confirm your login',
  'enter your password', 'provide your password', 'login information',
  'sign-in details', 'authentication code',
];

const ATTACHMENT_PHRASES = [
  'attachment', 'attached file', '.exe', '.zip', '.scr', '.bat',
  'macro', 'enable macros', 'enable content', 'document requires activation',
  'open the attached', 'download the attached', '.docm', '.xlsm',
  'enable editing', 'review the attached',
];

// ── Utilities ──

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

function extractDomainFromEmail(email: string): string {
  const match = email.match(/@([\w.-]+)/);
  return match ? match[1].toLowerCase() : '';
}

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s<>"']+/gi);
  return matches ?? [];
}

function extractDomainFromUrl(url: string): string {
  const match = url.match(/^https?:\/\/([^/:?#]+)/i);
  return match ? match[1].toLowerCase() : '';
}

function isIpAddress(host: string): boolean {
  return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
}

// ── Domain analysis ──

function analyzeDomain(from: string): DomainAnalysis | null {
  const fromDomain = extractDomainFromEmail(from);
  if (!fromDomain) return null;

  // Check against known brands
  let bestBrand: string | null = null;
  let bestSimilarity = 0;
  let bestSubs: { index: number; expectedChar: string; observedChar: string }[] = [];

  for (const brand of KNOWN_BRANDS) {
    // Check if any alias is similar to the fromDomain or a subdomain of it
    for (const alias of brand.aliases) {
      // Check if the domain contains something close to the alias
      const domainParts = fromDomain.split('.');
      for (const part of domainParts) {
        if (part.length < 3 || alias.length < 3) continue;
        const distance = levenshtein(part, alias);
        const maxLen = Math.max(part.length, alias.length);
        const similarity = 1 - distance / maxLen;
        if (similarity > 0.6 && similarity > bestSimilarity && part !== alias) {
          bestSimilarity = similarity;
          bestBrand = brand.domain;
          bestSubs = findSubstitutions(alias, part);
        }
      }
    }
  }

  const isLookalike = bestBrand !== null && bestSimilarity > 0.6;

  return {
    fromDomain,
    matchedBrand: bestBrand,
    expectedDomain: bestBrand,
    observedDomain: fromDomain,
    isLookalike,
    substitutions: bestSubs,
    similarity: bestSimilarity,
  };
}

function findSubstitutions(expected: string, observed: string) {
  const subs: { index: number; expectedChar: string; observedChar: string }[] = [];
  const minLen = Math.min(expected.length, observed.length);
  for (let i = 0; i < minLen; i++) {
    if (expected[i] !== observed[i]) {
      subs.push({ index: i, expectedChar: expected[i], observedChar: observed[i] });
    }
  }
  return subs;
}

// ── URL analysis ──

function analyzeUrl(url: string, fromDomain: string): UrlAnalysis {
  const protocolMatch = url.match(/^(https?:\/\/)/i);
  const protocol = protocolMatch ? protocolMatch[1].toLowerCase() : '';
  const domain = extractDomainFromUrl(url);
  const rest = url.substring(protocol.length + domain.length);
  const pathMatch = rest.match(/^([^?]*)/);
  const path = pathMatch ? pathMatch[1] : '';
  const query = rest.substring(path.length);

  const isHttp = protocol === 'http://';
  const isIp = isIpAddress(domain);
  const shortener = URL_SHORTENERS.find(s => domain === s || domain.endsWith('.' + s));
  const isShortened = !!shortener;

  const flags: string[] = [];
  if (isHttp) flags.push('Unencrypted HTTP');
  if (isIp) flags.push('IP address URL');
  if (isShortened) flags.push('Shortened URL');
  if (domain && fromDomain && domain !== fromDomain) flags.push('Domain mismatch with sender');

  // Suspicious if any flags, or if domain doesn't look like a well-known legit domain
  const isSuspicious = flags.length > 0 || isHttp || isIp || isShortened;

  return { url, protocol, domain, path, query, isHttp, isIp, isShortened, isSuspicious, flags };
}

// ── Main analysis ──

export function analyzeEmail(input: EmailInput): AnalysisResult {
  const evidence: Evidence[] = [];
  let num = 0;
  const subjectLower = input.subject.toLowerCase();
  const bodyLower = input.body.toLowerCase();
  const fromDomain = extractDomainFromEmail(input.from);

  // ── A. Sender anomaly ──
  if (fromDomain) {
    const isFreeEmail = FREE_EMAIL_DOMAINS.includes(fromDomain);
    // Check for suspicious patterns in domain: multiple hyphens, excessive digits, trailing punctuation
    const domainPart = fromDomain.split('.').slice(0, -1).join('.');
    const hyphenCount = (domainPart.match(/-/g) ?? []).length;
    const hasSuspiciousChars = hyphenCount >= 2 || /[\d]{2,}|[-]{2,}|[._-]$/.test(fromDomain);

    if (isFreeEmail && (bodyLower.includes('account') || bodyLower.includes('verify') || bodyLower.includes('suspend'))) {
      const idx = input.from.indexOf(fromDomain);
      num++;
      evidence.push({
        id: 'sender-anomaly',
        number: num,
        label: 'SENDER ANOMALY',
        category: 'sender-anomaly',
        field: 'from',
        matchedText: fromDomain,
        explanation: `The sender uses a free email domain "${fromDomain}" while requesting account verification. Legitimate organizations send from their own domain, not free email services.`,
        whyItMatters: 'Free email domains are commonly used in phishing because they are easy to register. Official communications from banks, services, or institutions come from their own corporate domains.',
        weight: 10,
        start: idx,
        end: idx + fromDomain.length,
      });
    }

    if (hasSuspiciousChars && !isFreeEmail) {
      const idx = input.from.indexOf(fromDomain);
      num++;
      evidence.push({
        id: 'sender-suspicious-chars',
        number: num,
        label: 'SENDER ANOMALY',
        category: 'sender-anomaly',
        field: 'from',
        matchedText: fromDomain,
        explanation: `The sender domain "${fromDomain}" contains suspicious patterns such as excessive numbers or hyphens that are uncommon in legitimate domains.`,
        whyItMatters: 'Phishing domains often add numbers or hyphens to create domains that look plausible but are not official.',
        weight: 10,
        start: idx,
        end: idx + fromDomain.length,
      });
    }
  }

  // ── B. Domain / look-alike ──
  const domainAnalysis = analyzeDomain(input.from);
  if (domainAnalysis?.isLookalike && domainAnalysis.matchedBrand) {
    const idx = input.from.indexOf(fromDomain);
    num++;
    evidence.push({
      id: 'look-alike-domain',
      number: num,
      label: 'LOOK-ALIKE DOMAIN',
      category: 'look-alike-domain',
      field: 'from',
      matchedText: fromDomain,
      explanation: `The domain "${fromDomain}" resembles the trusted brand "${domainAnalysis.matchedBrand}" but contains character substitutions or additional text. Similarity: ${Math.round(domainAnalysis.similarity * 100)}%.`,
      whyItMatters: 'Phishers register domains that look almost identical to legitimate ones, hoping you will not notice the difference at a glance. Always verify the exact spelling of the domain.',
      weight: 30,
      start: idx,
      end: idx + fromDomain.length,
    });
  }

  // ── C. URL analysis ──
  const urls = extractUrls(input.body);
  let primaryUrlAnalysis: UrlAnalysis | null = null;

  if (urls.length > 0) {
    const url = urls[0];
    const urlAnalysis = analyzeUrl(url, fromDomain);
    primaryUrlAnalysis = urlAnalysis;
    const urlIdx = input.body.indexOf(url);

    if (urlAnalysis.isSuspicious) {
      num++;
      evidence.push({
        id: 'suspicious-url',
        number: num,
        label: 'SUSPICIOUS URL',
        category: 'suspicious-url',
        field: 'body',
        matchedText: url,
        explanation: buildUrlExplanation(urlAnalysis),
        whyItMatters: 'Clicking this link could take you to a fake website designed to steal your credentials. Always verify the URL matches the legitimate domain you expect before clicking.',
        weight: 25,
        start: urlIdx,
        end: urlIdx + url.length,
      });
    }
  }

  // ── D. Urgency language ──
  let urgencyFound = false;
  for (const phrase of URGENCY_PHRASES) {
    const idx = bodyLower.indexOf(phrase);
    if (idx !== -1 && !urgencyFound) {
      const matched = input.body.substring(idx, idx + phrase.length);
      num++;
      evidence.push({
        id: `urgency-${num}`,
        number: num,
        label: 'URGENCY LANGUAGE',
        category: 'urgency-language',
        field: 'body',
        matchedText: matched,
        explanation: `The phrase "${matched}" creates pressure to act quickly before the recipient can verify the request.`,
        whyItMatters: 'Urgency is a core social engineering tactic. Legitimate organizations rarely demand immediate action without providing alternative verification channels.',
        weight: 15,
        start: idx,
        end: idx + phrase.length,
      });
      urgencyFound = true;
      break;
    }
  }

  // Also check subject for urgency
  if (!urgencyFound) {
    for (const phrase of URGENCY_PHRASES) {
      const idx = subjectLower.indexOf(phrase);
      if (idx !== -1) {
        const matched = input.subject.substring(idx, idx + phrase.length);
        num++;
        evidence.push({
          id: `urgency-subject-${num}`,
          number: num,
          label: 'URGENCY LANGUAGE',
          category: 'urgency-language',
          field: 'subject',
          matchedText: matched,
          explanation: `The subject line contains "${matched}" which creates pressure to act quickly.`,
          whyItMatters: 'Urgency in the subject line is designed to make you open and act on the email before thinking critically.',
          weight: 15,
          start: idx,
          end: idx + phrase.length,
        });
        urgencyFound = true;
        break;
      }
    }
  }

  // ── E. Suspicious keywords ──
  let keywordFound = false;
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    const idx = bodyLower.indexOf(keyword);
    if (idx !== -1 && !keywordFound) {
      const matched = input.body.substring(idx, idx + keyword.length);
      num++;
      evidence.push({
        id: `keyword-${num}`,
        number: num,
        label: 'SUSPICIOUS KEYWORDS',
        category: 'suspicious-keywords',
        field: 'body',
        matchedText: matched,
        explanation: `The email uses "${matched}" which is commonly found in phishing messages requesting account verification or payment updates.`,
        whyItMatters: 'Phishing emails frequently use these phrases to trick recipients into providing credentials or payment information on fake pages.',
        weight: 10,
        start: idx,
        end: idx + keyword.length,
      });
      keywordFound = true;
      break;
    }
  }

  // ── F. Attachment mentions ──
  for (const phrase of ATTACHMENT_PHRASES) {
    const idx = bodyLower.indexOf(phrase);
    if (idx !== -1) {
      const matched = input.body.substring(idx, idx + phrase.length);
      num++;
      evidence.push({
        id: `attachment-${num}`,
        number: num,
        label: 'SUSPICIOUS ATTACHMENT',
        category: 'attachment',
        field: 'body',
        matchedText: matched,
        explanation: `The email references "${matched}" which may indicate a malicious file or macro-enabled document.`,
        whyItMatters: 'Attachments can contain malware. Executable files, macro-enabled documents, and scripts are common vectors for credential theft and system compromise.',
        weight: 20,
        start: idx,
        end: idx + phrase.length,
      });
      break;
    }
  }

  // ── G. Credential requests ──
  for (const phrase of CREDENTIAL_PHRASES) {
    const idx = bodyLower.indexOf(phrase);
    if (idx !== -1) {
      const matched = input.body.substring(idx, idx + phrase.length);
      num++;
      evidence.push({
        id: `credential-${num}`,
        number: num,
        label: 'CREDENTIAL REQUEST',
        category: 'credential-request',
        field: 'body',
        matchedText: matched,
        explanation: `The email requests "${matched}" which is sensitive information that should never be provided via email.`,
        whyItMatters: 'Legitimate organizations never ask for passwords, PINs, or full card numbers via email. Any request for credentials is a strong phishing indicator.',
        weight: 20,
        start: idx,
        end: idx + phrase.length,
      });
      break;
    }
  }

  // ── Calculate score ──
  const totalWeight = evidence.reduce((sum, e) => sum + e.weight, 0);
  const score = Math.min(100, totalWeight);

  let verdict: Verdict;
  if (score >= 75) verdict = 'CRITICAL RISK';
  else if (score >= 50) verdict = 'HIGH RISK';
  else if (score >= 25) verdict = 'MEDIUM RISK';
  else verdict = 'LOW RISK';

  const indicatorsOfCompromise = evidence.map(e => e.label.toLowerCase().replace(/-/g, ' '));

  const recommendedAction =
    score >= 50
      ? 'Do not click suspicious links. Verify the sender through an independent trusted channel and report the message.'
      : 'No obvious phishing indicators detected. Verify through trusted channels if the request is unexpected.';

  return {
    score,
    verdict,
    evidence,
    indicatorsOfCompromise,
    recommendedAction,
    domainAnalysis,
    urlAnalysis: primaryUrlAnalysis,
  };
}

function buildUrlExplanation(ua: UrlAnalysis): string {
  const parts: string[] = [];
  if (ua.isHttp) parts.push('uses an unencrypted HTTP connection');
  if (ua.isIp) parts.push('uses a raw IP address instead of a domain name');
  if (ua.isShortened) parts.push('uses a URL shortener to hide the destination');
  if (ua.domain && parts.length === 0) parts.push(`points to "${ua.domain}" which does not match a known trusted domain`);
  if (parts.length === 0) parts.push('has an unusual structure');
  return `The link ${parts.join(', ')}. This is a common phishing technique.`;
}
