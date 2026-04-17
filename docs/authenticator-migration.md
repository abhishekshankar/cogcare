# Migrating to `Authenticator` / `useAuthenticator`

The CogCare app uses a **custom** auth flow: [`src/pages/LoginPage.jsx`](../src/pages/LoginPage.jsx) calls `signIn` from `aws-amplify/auth`, handles `CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED` via [`src/lib/authFlags.js`](../src/lib/authFlags.js) and [`CreatePasswordCard`](../src/components/CreatePasswordCard.jsx) on the dashboard, and guards routes with [`src/components/ProtectedRoute.jsx`](../src/components/ProtectedRoute.jsx).

You might migrate to **`@aws-amplify/ui-react`** primitives if you want prebuilt UI, built-in challenge steps, and less custom routing logic.

## What you would change

1. **`Authenticator` or `Authenticator.Provider`**
   - Wrap the router (or the subtree that needs auth) with `Authenticator` from `@aws-amplify/ui-react`, **or** use `Authenticator.Provider` + `useAuthenticator()` for headless control.
   - Keep **`Amplify.configure(outputs)`** as today ([`src/lib/amplifyConfigure.js`](../src/lib/amplifyConfigure.js)).

2. **Routes**
   - Replace the standalone `/login` page with either:
     - An embedded `<Authenticator>` on a layout that redirects signed-in users to `/dashboard`, or
     - Cognito Hosted UI (different product choice—not required for `Authenticator`).

3. **New-password challenge**
   - Map `CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED` using Amplify UI’s challenge handling (often via `formFields` / `services` overrides), **or** keep `CreatePasswordCard` but drive it from `useAuthenticator`’s `route` / `nextStep` instead of manual `authFlags`.

4. **`ProtectedRoute`**
   - Replace custom `getCurrentUser()` checks with `useAuthenticator`’s `authStatus` (`configuring` | `authenticated` | `unauthenticated`) where appropriate, still handling the **pending password** edge case if you keep a custom card.

5. **Styling**
   - Amplify UI has its own theme tokens; you would restyle via [`ThemeProvider` / `Theme`](https://ui.docs.amplify.aws/react/theming) to match CogCare’s palette, or use the **headless** hooks and keep your existing JSX.

## Tradeoffs

| Stay custom (current) | Migrate to Authenticator |
|------------------------|---------------------------|
| Full control over layout and copy | Faster to add MFA, reset password flows, and standard challenges |
| Smaller bundle if UI package unused heavily | Larger dependency; theming work to match brand |
| You already implemented new-password-on-dashboard | Need to re-validate all flows (quiz → email → login → password → dashboard) |

## Suggested order of work

1. Add `Authenticator` on a **feature branch** only around `/login`, without deleting `CreatePasswordCard` until parity is tested.
2. Run **`npm run test:e2e`** with `E2E_EMAIL` / `E2E_PASSWORD` against a sandbox user; extend tests for new-password if needed.
3. Remove dead code (`authFlags` paths) only after manual QA matches current behavior.

This is an **optional** refactor; the custom flow is valid for production if maintained.
