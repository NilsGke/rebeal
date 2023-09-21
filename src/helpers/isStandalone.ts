/**
 * returns boolean indicating if running in installed PWA
 */
export default function isStandalone() {
  const mqStandAlone = "(display-mode: standalone)";
  return (
    (navigator as any).standalone || window.matchMedia(mqStandAlone).matches
  );
}
