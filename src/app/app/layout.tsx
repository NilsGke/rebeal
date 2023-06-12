export default function AppContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container max-w-3xl h-screen">{children}</div>;
}
