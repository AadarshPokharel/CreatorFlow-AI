export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-grid-fade bg-[size:44px_44px] opacity-[0.07]" />
      <div className="relative w-full max-w-md">{children}</div>
    </main>
  );
}
