import { Redirect } from 'expo-router';

export default function Index() {
  // Punto de entrada: en v0 saltamos directos al onboarding.
  // Cuando haya sesión persistida, esto leerá el store y decidirá
  // entre (auth) / onboarding / (tabs).
  return <Redirect href="/onboarding/welcome" />;
}
