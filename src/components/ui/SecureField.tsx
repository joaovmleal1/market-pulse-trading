import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface SecureFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (key: string, value: string) => void;
  disabled?: boolean; // ✅ nova prop
}

const SecureField = ({ label, name, value, onChange, disabled = false }: SecureFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full relative space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-white">{label}</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="text-sm max-w-xs">
              Essas informações são criptografadas e o valor exibido não é o real, apenas uma representação segura.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          className="bg-gray-700 text-white border-gray-600 pr-10"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled} // ✅ campo desativado
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled} // ✅ botão desativado
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default SecureField;