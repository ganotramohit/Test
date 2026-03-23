import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, KeyRound, ShieldX, Sparkles } from 'lucide-react';
import {
  defaultPasskeyEligibilityInput,
  evaluatePasskeyEligibility,
  type PasskeyEligibilityInput,
  type PasskeyEligibilityReason,
  type PasskeyStageStatus
} from '../lib/passkeyEligibility';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ToggleField {
  key: Exclude<keyof PasskeyEligibilityInput, 'recentPasswordResetHours'>;
  label: string;
  description: string;
}

const TOGGLE_FIELDS: ToggleField[] = [
  {
    key: 'hasPayPalAccount',
    label: 'Has PayPal account',
    description: 'Passkey checkout requires an existing PayPal account.'
  },
  {
    key: 'isLoggedIn',
    label: 'Signed in to PayPal',
    description: 'User has started account sign-in during checkout.'
  },
  {
    key: 'guestCheckoutSelected',
    label: 'Guest checkout selected',
    description: 'Guest flow bypasses account authentication.'
  },
  {
    key: 'deviceSupportsPasskeys',
    label: 'Device supports passkeys',
    description: 'Device can store and use passkeys.'
  },
  {
    key: 'browserSupportsWebAuthn',
    label: 'Browser supports WebAuthn',
    description: 'Browser provides required WebAuthn APIs.'
  },
  {
    key: 'platformAuthenticatorAvailable',
    label: 'Platform authenticator available',
    description: 'Biometric/PIN authenticator is reachable.'
  },
  {
    key: 'screenLockEnabled',
    label: 'Screen lock enabled',
    description: 'Device lock protects passkey material.'
  },
  {
    key: 'privateBrowsing',
    label: 'Private browsing mode',
    description: 'Incognito/private mode may limit local credential access.'
  },
  {
    key: 'passkeyAlreadyEnrolled',
    label: 'Passkey already enrolled',
    description: 'User has an existing passkey on the PayPal account.'
  },
  {
    key: 'accountLimited',
    label: 'Account has active limitation',
    description: 'Account controls can block passkey checkout.'
  },
  {
    key: 'riskReviewRequired',
    label: 'Risk review required',
    description: 'Session needs fallback verification.'
  },
  {
    key: 'regionSupported',
    label: 'Region supports passkey checkout',
    description: 'Passkey checkout is enabled in this market.'
  },
  {
    key: 'merchantSupportsPasskeys',
    label: 'Merchant integration supports passkeys',
    description: 'Merchant checkout has passkeys enabled.'
  }
];

const SCENARIOS: Array<{ label: string; patch: Partial<PasskeyEligibilityInput> }> = [
  {
    label: 'All eligible',
    patch: { ...defaultPasskeyEligibilityInput }
  },
  {
    label: 'Guest checkout path',
    patch: { guestCheckoutSelected: true, isLoggedIn: false }
  },
  {
    label: 'Unsupported browser',
    patch: { browserSupportsWebAuthn: false }
  },
  {
    label: 'Account risk hold',
    patch: { riskReviewRequired: true, accountLimited: true }
  },
  {
    label: 'No passkey enrolled',
    patch: { passkeyAlreadyEnrolled: false }
  }
];

export function PasskeyEligibilityFlow() {
  const [input, setInput] = useState<PasskeyEligibilityInput>(defaultPasskeyEligibilityInput);
  const result = useMemo(() => evaluatePasskeyEligibility(input), [input]);

  const updateToggle = (key: ToggleField['key'], value: boolean) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  const applyScenario = (scenario: Partial<PasskeyEligibilityInput>) => {
    setInput(prev => ({ ...prev, ...scenario }));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <Card className="h-full">
        <CardHeader className="space-y-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Passkey checkout eligibility simulator</CardTitle>
              <CardDescription>
                Toggle session conditions to see live reasons why a shopper is or is not eligible to checkout with a
                PayPal passkey.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map(scenario => (
              <Button
                key={scenario.label}
                variant="outline"
                className="h-8 px-3 text-xs"
                onClick={() => applyScenario(scenario.patch)}
                type="button"
              >
                {scenario.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {TOGGLE_FIELDS.map(field => (
              <label
                key={field.key}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-slate-50/70 p-3 transition-colors hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-slate-900"
                  checked={Boolean(input[field.key])}
                  onChange={event => updateToggle(field.key, event.target.checked)}
                />
                <span className="space-y-0.5">
                  <span className="block text-sm font-semibold text-slate-800">{field.label}</span>
                  <span className="block text-xs text-slate-600">{field.description}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50/70 p-3">
            <Label htmlFor="reset-hours">Hours since password reset</Label>
            <div className="flex items-center gap-3">
              <Input
                id="reset-hours"
                type="number"
                min={0}
                max={240}
                value={input.recentPasswordResetHours}
                onChange={event =>
                  setInput(prev => ({
                    ...prev,
                    recentPasswordResetHours: Number.isNaN(Number(event.target.value))
                      ? 0
                      : Math.max(0, Number(event.target.value))
                  }))
                }
                className="max-w-[130px]"
              />
              <p className="text-xs text-slate-600">
                Sessions within 24 hours of reset may require extra verification before passkey checkout.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Live eligibility decision</CardTitle>
              <Badge variant={result.eligible ? 'success' : 'warning'}>
                {result.eligible ? 'Eligible' : 'Not eligible'}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{result.summary}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.stages.map(stage => (
              <StageRow key={stage.id} stage={stage} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why passkey checkout is blocked</CardTitle>
            <CardDescription>
              Blocking reasons must be resolved before PayPal can offer passkey authentication at checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.blockingReasons.length === 0 ? (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                No blocking reasons found. This user can continue with passkey checkout.
              </p>
            ) : (
              result.blockingReasons.map(reason => <ReasonCard key={reason.code} reason={reason} />)
            )}
          </CardContent>
        </Card>

        {result.advisoryReasons.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Advisory conditions</CardTitle>
              <CardDescription>These do not block passkey use but can impact reliability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.advisoryReasons.map(reason => (
                <ReasonCard key={reason.code} reason={reason} />
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function StageRow({ stage }: { stage: PasskeyStageStatus }) {
  const icon =
    stage.status === 'pass' ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
    ) : stage.status === 'review' ? (
      <Info className="h-4 w-4 text-sky-600" />
    ) : (
      <ShieldX className="h-4 w-4 text-rose-600" />
    );

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            {icon}
            {stage.title}
          </div>
          <p className="text-xs text-slate-600">{stage.description}</p>
        </div>
        <Badge
          variant={stage.status === 'pass' ? 'success' : stage.status === 'review' ? 'neutral' : 'warning'}
          className="capitalize"
        >
          {stage.status}
        </Badge>
      </div>
      {stage.reasons.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
          {stage.reasons.map(reason => (
            <li key={reason.code}>{reason.title}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-slate-500">No issues detected at this stage.</p>
      )}
    </div>
  );
}

function ReasonCard({ reason }: { reason: PasskeyEligibilityReason }) {
  return (
    <div
      className={`rounded-md border p-3 ${
        reason.severity === 'blocking' ? 'border-rose-200 bg-rose-50/60' : 'border-sky-200 bg-sky-50/60'
      }`}
    >
      <div className="flex items-start gap-2">
        {reason.severity === 'blocking' ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 text-rose-600" />
        ) : (
          <Sparkles className="mt-0.5 h-4 w-4 text-sky-600" />
        )}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">{reason.title}</p>
          <p className="text-xs text-slate-700">{reason.explanation}</p>
          <p className="text-xs font-medium text-slate-800">Next step: {reason.nextStep}</p>
        </div>
      </div>
    </div>
  );
}
