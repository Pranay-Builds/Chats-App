import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Verify() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Email verified. Please log in.");
    navigate("/login", { replace: true });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      Verifying your email…
    </div>
  );
}
