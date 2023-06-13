export default function AppContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="aspect-[9/16] w-screen min-[500px]:h-screen min-[500px]:w-auto">
      {children}
    </div>
  );
}
