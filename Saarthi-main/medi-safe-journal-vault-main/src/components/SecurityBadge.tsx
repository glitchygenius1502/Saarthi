
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Lock } from "lucide-react";

export const SecurityBadge = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-900 hover:from-green-300 hover:to-emerald-300 border-2 border-green-300 px-4 py-2 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
              <Lock className="w-4 h-4 mr-2" />
              AES-256 Encrypted
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-900 hover:from-blue-300 hover:to-cyan-300 border-2 border-blue-300 px-4 py-2 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
              <Shield className="w-4 h-4 mr-2" />
              HIPAA Compliant
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 shadow-xl">
          <div className="max-w-xs p-4">
            <p className="font-bold mb-3 text-amber-900 text-lg">🔒 Security Features:</p>
            <ul className="text-sm space-y-2 text-amber-800">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                End-to-end encryption
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Biometric authentication
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Access logs tracking
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                GDPR & NDHM compliant
              </li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
