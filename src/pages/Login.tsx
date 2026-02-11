import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      if (!name.trim() || name.trim().length < 2) {
        return toast.error("Nome deve ter ao menos 2 caracteres");
      }

      if (!EMAIL_REGEX.test(email.trim())) {
        return toast.error("Informe um e-mail válido");
      }

      if (password.length < 4) {
        return toast.error("Senha deve ter ao menos 4 caracteres");
      }

      const err = register(name.trim(), email.trim().toLowerCase(), password);
      return err
        ? toast.error(err)
        : toast.success("Conta criada com sucesso!");
    }

    if (!email.trim() || !password) {
      return toast.error("Preencha todos os campos");
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return toast.error("Informe um e-mail válido");
    }

    const err = login(email.trim().toLowerCase(), password);
    return err ? toast.error(err) : toast.success("Bem-vindo de volta!");
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-primary">JHP</span> Produtos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRegister ? "Crie sua conta" : "Acesse sua conta"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border bg-card p-6"
        >
          {isRegister && (
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                maxLength={100}
                minLength={2}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              maxLength={100}
              minLength={4}
            />
          </div>

          <Button type="submit" className="w-full">
            {isRegister ? "Criar Conta" : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary font-semibold hover:underline"
          >
            {isRegister ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
