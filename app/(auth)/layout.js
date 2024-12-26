export const metadata = {
  title: "Next Auth",
  description: "Next.js Authentication",
};

export default function AuthLayout({ children }) {
  return (
    <>
      <header id="auth-header">
        <p>Welcome Back</p>
        <form>
          <button>Logout</button>
        </form>
      </header>
      {children}
    </>
  );
}
