import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal, Server, Code, Cpu, BookOpen, Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface DocumentationPageProps {
  onBack: () => void;
}

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm" />
      <div className="relative bg-gray-900 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">{language}</span>
          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
          </button>
        </div>
        <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
        <Icon size={20} className="text-gray-700" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export default function DocumentationPage({ onBack }: DocumentationPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Development Guide</h1>
        </motion.div>

        {/* Quick Start */}
        <Section title="Quick Start (5 Minutes)" icon={Terminal}>
          <p className="text-gray-600 mb-4">
            Get the complete HRouter stack running with backend, frontend, and ML models.
          </p>
          <CodeBlock code={`# 1. Clone and setup
git clone https://github.com/Rohithdgrr/HACKATHON.git
cd HACKATHON

# 2. Install Python dependencies
pip install -e .

# 3. Install frontend dependencies
cd web/hackathon_repo
npm install

# 4. Set API keys
echo "GEMINI_API_KEY=your_key" > .env
cd ../..
export API_KEYS='your-nvidia-api-key'

# 5. Start services (in separate terminals)
python -m openclaw_router --config openclaw_router/config_nvidia.yaml --port 8080
cd web/hackathon_repo && npm run dev

# Open http://localhost:3000`} />
        </Section>

        {/* Prerequisites */}
        <Section title="Prerequisites" icon={BookOpen}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-2">Required Software</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Python 3.10+</li>
                <li>• Node.js 18+</li>
                <li>• Git</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-2">API Keys</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• NVIDIA API (build.nvidia.com)</li>
                <li>• Google Gemini (aistudio.google.com)</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Terminal Setup */}
        <Section title="Terminal Setup (4 Terminals)" icon={Server}>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 mb-2">Terminal 1: Backend API (Port 8080)</h4>
              <CodeBlock code={`cd HACKATHON
source venv/bin/activate  # Windows: venv\\Scripts\\activate
export API_KEYS='your-nvidia-api-key'
python -m openclaw_router --config openclaw_router/config_nvidia.yaml --port 8080`} />
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h4 className="font-bold text-green-900 mb-2">Terminal 2: Frontend (Port 3000)</h4>
              <CodeBlock code={`cd HACKATHON/web/hackathon_repo
echo "GEMINI_API_KEY=your_key" > .env
npm run dev`} />
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <h4 className="font-bold text-purple-900 mb-2">Terminal 3: ML Training (Optional)</h4>
              <CodeBlock code={`cd HACKATHON
source venv/bin/activate
hrouter train --router knnrouter --config configs/model_config_train/knnrouter.yaml`} />
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <h4 className="font-bold text-orange-900 mb-2">Terminal 4: Jupyter (Optional)</h4>
              <CodeBlock code="jupyter notebook notebooks/" />
            </div>
          </div>
        </Section>

        {/* Backend Setup */}
        <Section title="Backend Setup" icon={Server}>
          <p className="text-gray-600 mb-4">Install Python package and configure API keys.</p>
          <CodeBlock code={`# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# Install package
pip install -e .

# With GPU support (optional)
pip install -e ".[router-r1]"

# Set API keys
export API_KEYS='your-nvidia-api-key'

# Test
python -c "import llmrouter; print('✓ Installed')"`} />
        </Section>

        {/* Frontend Setup */}
        <Section title="Frontend Setup" icon={Code}>
          <p className="text-gray-600 mb-4">Install Node.js dependencies and configure environment.</p>
          <CodeBlock code={`cd web/hackathon_repo

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_gemini_api_key_here
EOF

# Start dev server
npm run dev

# Build for production
npm run build`} />
        </Section>

        {/* ML Models Setup */}
        <Section title="ML Models Setup" icon={Cpu}>
          <p className="text-gray-600 mb-4">Train custom router models for intelligent routing.</p>
          <CodeBlock code={`# Train a router
hrouter train --router knnrouter --config configs/model_config_train/knnrouter.yaml

# Evaluate on test set
hrouter evaluate --router knnrouter --config configs/model_config_test/knnrouter.yaml

# Load in backend
cp knnrouter.pkl openclaw_router/
python -m openclaw_router --config openclaw_router/config_ml.yaml --port 8080`} />
        </Section>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-cyan-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-gray-200"
        >
          <h3 className="font-bold text-gray-900 mb-4">Documentation Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'README.md', desc: 'Project overview and quick start' },
              { name: 'DEVELOPMENT.md', desc: 'Complete development setup guide' },
              { name: 'ARCHITECTURE.md', desc: 'System architecture and design' },
              { name: 'BACKEND.md', desc: 'Backend API documentation' },
              { name: 'MLMODELS.md', desc: 'ML router implementations' },
              { name: 'FEATURES.md', desc: 'Complete feature list' },
            ].map((doc) => (
              <a
                key={doc.name}
                href={`https://github.com/Rohithdgrr/HACKATHON/blob/main/${doc.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <BookOpen size={16} className="text-purple-500" />
                <div>
                  <span className="font-mono text-sm font-medium">{doc.name}</span>
                  <p className="text-xs text-gray-500">{doc.desc}</p>
                </div>
                <ExternalLink size={14} className="ml-auto text-gray-400" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center"
        >
          <p className="text-green-800 font-medium">
            ✅ All services running? Open{' '}
            <a href="http://localhost:3000" className="underline font-mono text-green-900">
              http://localhost:3000
            </a>{' '}
            in your browser!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
