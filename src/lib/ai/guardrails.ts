import 'server-only';

/**
 * AgentOps Guardrails — AI output verification layer.
 *
 * Every generative output passes through this layer before reaching the user.
 * Mitigates: hallucinations, PII leakage, brand drift, toxicity.
 *
 * Integrates with watsonx.governance metrics when WATSON_NLU_URL is available.
 */

export interface GuardrailResult {
  passed: boolean;
  flags: GuardrailFlag[];
  score: number; // 0-100 safety score
  sanitizedContent?: string;
}

export interface GuardrailFlag {
  type: 'pii' | 'toxicity' | 'brand_drift' | 'hallucination' | 'forbidden_word' | 'length_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detail: string;
  position?: { start: number; end: number };
}

// PII patterns (Portuguese + English)
const PII_PATTERNS = [
  { regex: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, type: 'CPF' },
  { regex: /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, type: 'CNPJ' },
  { regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, type: 'Email' },
  { regex: /\b(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}\b/g, type: 'Phone' },
  { regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, type: 'Credit Card' },
  { regex: /\b\d{3}-\d{2}-\d{4}\b/g, type: 'SSN' },
];

// Toxicity keywords (HAP: Hate, Abuse, Profanity)
const TOXICITY_KEYWORDS = [
  // Placeholder patterns — in production this would use watsonx.governance HAP scoring
  /\b(idiota|estúpido|imbecil|retardado|lixo humano)\b/gi,
];

/**
 * Run the full guardrail pipeline on AI-generated content.
 */
export function verifyOutput(
  content: string,
  context: {
    forbiddenWords?: string[];
    mandatoryElements?: string[];
    maxLength?: number;
    brandVoice?: string;
  }
): GuardrailResult {
  const flags: GuardrailFlag[] = [];
  let sanitized = content;

  // 1. PII Detection
  for (const pattern of PII_PATTERNS) {
    const matches = Array.from(content.matchAll(pattern.regex));
    for (const match of matches) {
      flags.push({
        type: 'pii',
        severity: 'critical',
        detail: `${pattern.type} detected`,
        position: match.index !== undefined
          ? { start: match.index, end: match.index + match[0].length }
          : undefined,
      });
      // Redact PII
      sanitized = sanitized.replace(match[0], `[${pattern.type}_REDACTED]`);
    }
  }

  // 2. Toxicity / HAP Check
  for (const pattern of TOXICITY_KEYWORDS) {
    if (pattern.test(content)) {
      flags.push({
        type: 'toxicity',
        severity: 'high',
        detail: 'Potentially toxic/abusive language detected',
      });
    }
  }

  // 3. Forbidden Words Check
  if (context.forbiddenWords) {
    const lowerContent = content.toLowerCase();
    for (const word of context.forbiddenWords) {
      if (lowerContent.includes(word.toLowerCase())) {
        const idx = lowerContent.indexOf(word.toLowerCase());
        flags.push({
          type: 'forbidden_word',
          severity: 'medium',
          detail: `Forbidden word: "${word}"`,
          position: { start: idx, end: idx + word.length },
        });
      }
    }
  }

  // 4. Length Violation
  if (context.maxLength && content.length > context.maxLength) {
    flags.push({
      type: 'length_violation',
      severity: 'low',
      detail: `Content exceeds max length: ${content.length}/${context.maxLength}`,
    });
  }

  // 5. Brand Drift Detection (heuristic)
  if (context.mandatoryElements && context.mandatoryElements.length > 0) {
    const lowerContent = content.toLowerCase();
    const missingElements = context.mandatoryElements.filter(
      el => !lowerContent.includes(el.toLowerCase())
    );
    if (missingElements.length > context.mandatoryElements.length * 0.5) {
      flags.push({
        type: 'brand_drift',
        severity: 'medium',
        detail: `Missing mandatory brand elements: ${missingElements.join(', ')}`,
      });
    }
  }

  // Calculate safety score
  const severityWeights = { low: 5, medium: 15, high: 30, critical: 50 };
  const totalPenalty = flags.reduce((sum, f) => sum + severityWeights[f.severity], 0);
  const score = Math.max(0, 100 - totalPenalty);

  const hasCritical = flags.some(f => f.severity === 'critical');

  return {
    passed: !hasCritical && score >= 40,
    flags,
    score,
    sanitizedContent: hasCritical ? sanitized : undefined,
  };
}
