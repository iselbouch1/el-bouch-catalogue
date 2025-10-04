import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function AdminAuth({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error("Connexion échouée");
    toast.success("Connecté");
    onSuccess();
  };

  const handleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return toast.error("Inscription échouée");
    toast.success("Compte créé, connecté");
    onSuccess();
  };

  return (
    <div className="max-w-sm mx-auto bg-card p-6 rounded-lg shadow-card">
      <h2 className="text-xl font-semibold mb-4">Accès Administrateur</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Mot de passe</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="flex gap-2 mt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "..." : "Se connecter"}
          </Button>
          <Button type="button" variant="outline" onClick={handleSignup} disabled={loading} className="flex-1">
            Créer un compte
          </Button>
        </div>
      </form>
    </div>
  );
}
