/** Session flag: user signed in with temp password and must complete CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED. */
export const NEW_PASSWORD_SESSION_KEY = 'cogcare_new_password_required'

export function setPendingNewPasswordFlag() {
  try {
    sessionStorage.setItem(NEW_PASSWORD_SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function clearPendingNewPasswordFlag() {
  try {
    sessionStorage.removeItem(NEW_PASSWORD_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function hasPendingNewPasswordFlag() {
  try {
    return sessionStorage.getItem(NEW_PASSWORD_SESSION_KEY) === '1'
  } catch {
    return false
  }
}
