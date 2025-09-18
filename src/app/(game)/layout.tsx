export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="bg-background">{children}</main>;
}
