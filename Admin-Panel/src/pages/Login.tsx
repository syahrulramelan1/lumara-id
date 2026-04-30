import { LoginComponent } from "../components";

const Login = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 dark:bg-[#0D0B14] bg-[var(--bg-2)] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-violet-400/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet-300/5 blur-[60px] pointer-events-none" />

      <LoginComponent />
    </div>
  );
};
export default Login;
