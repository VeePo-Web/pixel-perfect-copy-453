import React, { useState } from "react";

interface PasswordGateProps {
  onUnlock: () => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "hickoryandrose1") {
      sessionStorage.setItem("hr_site_unlocked", "true");
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 w-full max-w-xs text-center"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="font-script text-5xl text-primary leading-none">&amp;</span>
          <h1 className="font-serif-wedding text-2xl tracking-wide text-foreground">
            Hickory &amp; Rose
          </h1>
        </div>
        <label
          htmlFor="site-password"
          className="font-sans-wedding text-xs font-medium tracking-[0.25em] uppercase text-muted-foreground"
        >
          Private Preview
        </label>
        <input
          id="site-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-11 px-4 rounded-md bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center font-sans-wedding"
          placeholder="Enter password"
          autoFocus
        />
        {error && (
          <p className="text-destructive text-sm font-sans-wedding">Incorrect password</p>
        )}
        <button
          type="submit"
          className="w-full h-11 rounded-md bg-primary text-primary-foreground font-sans-wedding tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default PasswordGate;
