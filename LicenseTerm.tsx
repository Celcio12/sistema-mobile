import { motion } from 'motion/react';
import { ShieldCheck, FileText } from 'lucide-react';

export default function LicenseTerm({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-[#1A2235] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/5" />
          <ShieldCheck className="w-16 h-16 text-[#FF7A00] mx-auto mb-4 relative z-10" />
          <h1 className="text-2xl font-black text-white relative z-10">Termo de Licença</h1>
          <p className="text-white/70 text-sm mt-2 relative z-10">Sistema de Gestão de Cantina Mobile v2.0.0</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-2xl p-4 h-64 overflow-y-auto text-sm text-gray-600 space-y-4 border border-gray-100">
            <p><strong>1. Aceitação dos Termos</strong><br/>Ao acessar e utilizar este aplicativo, você concorda em cumprir estes termos de serviço.</p>
            <p><strong>2. Uso da Licença</strong><br/>É concedida permissão para uso exclusivo do sistema de gestão para a cantina designada.</p>
            <p><strong>3. Privacidade e Dados</strong><br/>Todos os dados de vendas, funcionários e lucros são armazenados de forma segura e são de responsabilidade do administrador.</p>
            <p><strong>4. Restrições</strong><br/>Não é permitido modificar, copiar ou distribuir o código fonte deste aplicativo.</p>
            <p><strong>5. Atualizações</strong><br/>O desenvolvedor (Celcio Pinto) reserva-se o direito de atualizar o sistema para melhorias de segurança e performance.</p>
          </div>

          <div className="mt-6">
            <button 
              onClick={onAccept}
              className="w-full bg-[#FF7A00] hover:bg-[#E66A00] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Li e Aceito os Termos</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
