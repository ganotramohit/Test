export type PasskeyReasonCode =
  | 'NO_PAYPAL_ACCOUNT'
  | 'SIGN_IN_REQUIRED'
  | 'GUEST_CHECKOUT'
  | 'DEVICE_NOT_SUPPORTED'
  | 'BROWSER_NOT_SUPPORTED'
  | 'AUTHENTICATOR_UNAVAILABLE'
  | 'SCREEN_LOCK_REQUIRED'
  | 'PRIVATE_BROWSING_LIMITATION'
  | 'PASSKEY_NOT_ENROLLED'
  | 'ACCOUNT_LIMITATION'
  | 'RISK_REVIEW_REQUIRED'
  | 'RECENT_PASSWORD_RESET'
  | 'REGION_NOT_SUPPORTED'
  | 'MERCHANT_NOT_ENABLED';

export type PasskeyReasonSeverity = 'blocking' | 'advisory';
export type PasskeyStageId = 'device' | 'account' | 'checkout' | 'security';

export interface PasskeyEligibilityInput {
  hasPayPalAccount: boolean;
  isLoggedIn: boolean;
  guestCheckoutSelected: boolean;
  deviceSupportsPasskeys: boolean;
  browserSupportsWebAuthn: boolean;
  platformAuthenticatorAvailable: boolean;
  screenLockEnabled: boolean;
  privateBrowsing: boolean;
  passkeyAlreadyEnrolled: boolean;
  accountLimited: boolean;
  riskReviewRequired: boolean;
  recentPasswordResetHours: number;
  regionSupported: boolean;
  merchantSupportsPasskeys: boolean;
}

export interface PasskeyEligibilityReason {
  code: PasskeyReasonCode;
  title: string;
  explanation: string;
  nextStep: string;
  severity: PasskeyReasonSeverity;
  stage: PasskeyStageId;
}

export interface PasskeyStageStatus {
  id: PasskeyStageId;
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'review';
  reasons: PasskeyEligibilityReason[];
}

export interface PasskeyEligibilityResult {
  eligible: boolean;
  blockingReasons: PasskeyEligibilityReason[];
  advisoryReasons: PasskeyEligibilityReason[];
  allReasons: PasskeyEligibilityReason[];
  stages: PasskeyStageStatus[];
  summary: string;
}

const STAGES: Record<PasskeyStageId, { title: string; description: string }> = {
  device: {
    title: 'Device and browser checks',
    description: 'Confirms passkey and WebAuthn support on the current device/browser.'
  },
  account: {
    title: 'PayPal account readiness',
    description: 'Verifies account state and whether the user can authenticate with a passkey.'
  },
  checkout: {
    title: 'Checkout context checks',
    description: 'Validates that the selected checkout flow can offer passkey sign-in.'
  },
  security: {
    title: 'Security and risk controls',
    description: 'Applies temporary security controls before passkey checkout can proceed.'
  }
};

const RECENT_PASSWORD_RESET_COOLDOWN_HOURS = 24;

function buildReason(
  code: PasskeyReasonCode,
  severity: PasskeyReasonSeverity,
  stage: PasskeyStageId
): PasskeyEligibilityReason {
  switch (code) {
    case 'NO_PAYPAL_ACCOUNT':
      return {
        code,
        stage,
        severity,
        title: 'No PayPal account found',
        explanation: 'Passkey checkout requires an existing PayPal account.',
        nextStep: 'Create a PayPal account, then return to checkout and sign in.'
      };
    case 'SIGN_IN_REQUIRED':
      return {
        code,
        stage,
        severity,
        title: 'User is not signed in',
        explanation: 'Passkey authentication can only start after account sign-in is initiated.',
        nextStep: 'Select Sign in with PayPal, then continue with passkey.'
      };
    case 'GUEST_CHECKOUT':
      return {
        code,
        stage,
        severity,
        title: 'Guest checkout selected',
        explanation: 'Guest checkout bypasses account authentication, so passkeys are unavailable.',
        nextStep: 'Switch from Guest checkout to PayPal account sign-in.'
      };
    case 'DEVICE_NOT_SUPPORTED':
      return {
        code,
        stage,
        severity,
        title: 'Device does not support passkeys',
        explanation: 'The current device cannot create or use passkeys.',
        nextStep: 'Try a supported device with modern biometric or PIN-based authentication.'
      };
    case 'BROWSER_NOT_SUPPORTED':
      return {
        code,
        stage,
        severity,
        title: 'Browser lacks WebAuthn support',
        explanation: 'Passkeys depend on WebAuthn APIs that are unavailable in this browser version.',
        nextStep: 'Update to the latest version of Chrome, Safari, Edge, or Firefox.'
      };
    case 'AUTHENTICATOR_UNAVAILABLE':
      return {
        code,
        stage,
        severity,
        title: 'No platform authenticator available',
        explanation: 'The browser cannot reach a biometric/PIN authenticator to verify the passkey.',
        nextStep: 'Enable biometric or device PIN authentication and try again.'
      };
    case 'SCREEN_LOCK_REQUIRED':
      return {
        code,
        stage,
        severity,
        title: 'Device screen lock is disabled',
        explanation: 'Most passkey providers require an active lock screen for credential protection.',
        nextStep: 'Turn on device screen lock (PIN/Face ID/fingerprint) before retrying.'
      };
    case 'PRIVATE_BROWSING_LIMITATION':
      return {
        code,
        stage,
        severity,
        title: 'Private browsing may block stored passkeys',
        explanation: 'Private/incognito sessions can limit access to locally stored credentials.',
        nextStep: 'Retry in a regular browser window for consistent passkey access.'
      };
    case 'PASSKEY_NOT_ENROLLED':
      return {
        code,
        stage,
        severity,
        title: 'No passkey enrolled on this account',
        explanation: 'Passkey checkout is only available after the user has set up a passkey.',
        nextStep: 'Sign in with another method, then enroll a passkey in PayPal security settings.'
      };
    case 'ACCOUNT_LIMITATION':
      return {
        code,
        stage,
        severity,
        title: 'Account limitation is active',
        explanation: 'Limited accounts may have authentication restrictions during checkout.',
        nextStep: 'Resolve account limitations in PayPal Resolution Center first.'
      };
    case 'RISK_REVIEW_REQUIRED':
      return {
        code,
        stage,
        severity,
        title: 'Temporary risk review required',
        explanation: 'Additional risk controls require fallback verification for this session.',
        nextStep: 'Complete the requested verification and retry passkey checkout.'
      };
    case 'RECENT_PASSWORD_RESET':
      return {
        code,
        stage,
        severity,
        title: 'Password was reset recently',
        explanation: 'Recent credential resets can trigger a temporary passkey cooldown.',
        nextStep: `Wait ${RECENT_PASSWORD_RESET_COOLDOWN_HOURS} hours after reset or complete fallback verification.`
      };
    case 'REGION_NOT_SUPPORTED':
      return {
        code,
        stage,
        severity,
        title: 'Passkey checkout not supported in this region',
        explanation: 'Passkey checkout availability may vary by market and compliance requirements.',
        nextStep: 'Use another available sign-in method for this checkout.'
      };
    case 'MERCHANT_NOT_ENABLED':
      return {
        code,
        stage,
        severity,
        title: 'Merchant integration has not enabled passkeys',
        explanation: 'The current checkout integration is not configured to present passkey auth.',
        nextStep: 'Use standard PayPal login or complete checkout on a merchant with passkey-enabled integration.'
      };
    default: {
      const exhaustiveCheck: never = code;
      throw new Error(`Unhandled passkey reason code: ${String(exhaustiveCheck)}`);
    }
  }
}

export const defaultPasskeyEligibilityInput: PasskeyEligibilityInput = {
  hasPayPalAccount: true,
  isLoggedIn: true,
  guestCheckoutSelected: false,
  deviceSupportsPasskeys: true,
  browserSupportsWebAuthn: true,
  platformAuthenticatorAvailable: true,
  screenLockEnabled: true,
  privateBrowsing: false,
  passkeyAlreadyEnrolled: true,
  accountLimited: false,
  riskReviewRequired: false,
  recentPasswordResetHours: 48,
  regionSupported: true,
  merchantSupportsPasskeys: true
};

function getReasons(input: PasskeyEligibilityInput): PasskeyEligibilityReason[] {
  const reasons: PasskeyEligibilityReason[] = [];

  if (!input.deviceSupportsPasskeys) {
    reasons.push(buildReason('DEVICE_NOT_SUPPORTED', 'blocking', 'device'));
  }
  if (!input.browserSupportsWebAuthn) {
    reasons.push(buildReason('BROWSER_NOT_SUPPORTED', 'blocking', 'device'));
  }
  if (!input.platformAuthenticatorAvailable) {
    reasons.push(buildReason('AUTHENTICATOR_UNAVAILABLE', 'blocking', 'device'));
  }
  if (!input.screenLockEnabled) {
    reasons.push(buildReason('SCREEN_LOCK_REQUIRED', 'blocking', 'device'));
  }
  if (input.privateBrowsing) {
    reasons.push(buildReason('PRIVATE_BROWSING_LIMITATION', 'advisory', 'device'));
  }

  if (!input.hasPayPalAccount) {
    reasons.push(buildReason('NO_PAYPAL_ACCOUNT', 'blocking', 'account'));
  }
  if (!input.isLoggedIn) {
    reasons.push(buildReason('SIGN_IN_REQUIRED', 'blocking', 'account'));
  }
  if (!input.passkeyAlreadyEnrolled) {
    reasons.push(buildReason('PASSKEY_NOT_ENROLLED', 'blocking', 'account'));
  }
  if (input.accountLimited) {
    reasons.push(buildReason('ACCOUNT_LIMITATION', 'blocking', 'account'));
  }

  if (input.guestCheckoutSelected) {
    reasons.push(buildReason('GUEST_CHECKOUT', 'blocking', 'checkout'));
  }
  if (!input.regionSupported) {
    reasons.push(buildReason('REGION_NOT_SUPPORTED', 'blocking', 'checkout'));
  }
  if (!input.merchantSupportsPasskeys) {
    reasons.push(buildReason('MERCHANT_NOT_ENABLED', 'blocking', 'checkout'));
  }

  if (input.riskReviewRequired) {
    reasons.push(buildReason('RISK_REVIEW_REQUIRED', 'blocking', 'security'));
  }
  if (input.recentPasswordResetHours < RECENT_PASSWORD_RESET_COOLDOWN_HOURS) {
    reasons.push(buildReason('RECENT_PASSWORD_RESET', 'blocking', 'security'));
  }

  return reasons;
}

function summarize(result: {
  eligible: boolean;
  blockingReasons: PasskeyEligibilityReason[];
  advisoryReasons: PasskeyEligibilityReason[];
}): string {
  if (result.eligible) {
    if (result.advisoryReasons.length > 0) {
      return 'Passkey checkout is eligible, but there are advisory conditions worth addressing for reliability.';
    }
    return 'Passkey checkout is fully eligible for this user and session.';
  }

  const topReason = result.blockingReasons[0];
  return `Passkey checkout is not eligible right now because of ${topReason.title.toLowerCase()}.`;
}

export function evaluatePasskeyEligibility(input: PasskeyEligibilityInput): PasskeyEligibilityResult {
  const allReasons = getReasons(input);
  const blockingReasons = allReasons.filter(reason => reason.severity === 'blocking');
  const advisoryReasons = allReasons.filter(reason => reason.severity === 'advisory');
  const eligible = blockingReasons.length === 0;

  const stages = (Object.keys(STAGES) as PasskeyStageId[]).map(stageId => {
    const stageReasons = allReasons.filter(reason => reason.stage === stageId);
    const hasBlocking = stageReasons.some(reason => reason.severity === 'blocking');
    const hasAdvisory = stageReasons.some(reason => reason.severity === 'advisory');

    let status: PasskeyStageStatus['status'] = 'pass';
    if (hasBlocking) {
      status = 'fail';
    } else if (hasAdvisory) {
      status = 'review';
    }

    return {
      id: stageId,
      title: STAGES[stageId].title,
      description: STAGES[stageId].description,
      status,
      reasons: stageReasons
    };
  });

  return {
    eligible,
    blockingReasons,
    advisoryReasons,
    allReasons,
    stages,
    summary: summarize({ eligible, blockingReasons, advisoryReasons })
  };
}
