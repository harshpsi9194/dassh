
import { Github, ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  onBackClick: () => void;
}

const AboutPage = ({ onBackClick }: AboutPageProps) => {
  const handleGitHubClick = () => {
    window.open('https://github.com/dassh-project', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <button
          onClick={onBackClick}
          className="cyber-button mb-8 glow-on-hover"
        >
          <ArrowLeft size={18} className="mr-2" />
          BACK TO MAIN
        </button>

        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-cyber">
              <span className="text-cyber-accent cyber-glow">About</span>
              <br />
              <span className="text-cyber-primary cyber-glow">DASSH</span>
            </h1>
          </div>

          {/* Purpose and Vision */}
          <div className="cyber-bg-card p-8 rounded-lg border border-cyber-border">
            <h2 className="text-2xl font-bold text-cyber-accent mb-4 cyber-glow-sm">
              Purpose & Vision
            </h2>
            <p className="text-cyber-text leading-relaxed mb-4">
              DASSH (Dynamic AI-Powered Software Solutions Hub) is a revolutionary platform designed to democratize game development through artificial intelligence. Our mission is to empower creators of all skill levels to bring their gaming visions to life using nothing more than natural language descriptions.
            </p>
            <p className="text-cyber-text leading-relaxed">
              We envision a future where the barrier between imagination and creation is dissolved, where anyone can become a game developer by simply describing their ideas in plain English.
            </p>
          </div>

          {/* Core Technologies */}
          <div className="cyber-bg-card p-8 rounded-lg border border-cyber-border">
            <h2 className="text-2xl font-bold text-cyber-accent mb-6 cyber-glow-sm">
              Core Technologies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-cyber-primary mb-2">Frontend Stack</h3>
                <ul className="text-cyber-text space-y-1">
                  <li>• React 18 with TypeScript</li>
                  <li>• Vite for lightning-fast development</li>
                  <li>• Tailwind CSS for responsive design</li>
                  <li>• Shadcn/UI for consistent components</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyber-primary mb-2">AI & Backend</h3>
                <ul className="text-cyber-text space-y-1">
                  <li>• Advanced Language Models</li>
                  <li>• Real-time code generation</li>
                  <li>• Cloud-based processing</li>
                  <li>• Scalable architecture</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyber-primary mb-2">Game Engine</h3>
                <ul className="text-cyber-text space-y-1">
                  <li>• WebGL-powered rendering</li>
                  <li>• Physics simulation</li>
                  <li>• Audio processing</li>
                  <li>• Multi-platform deployment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyber-primary mb-2">Developer Tools</h3>
                <ul className="text-cyber-text space-y-1">
                  <li>• Real-time preview</li>
                  <li>• Version control integration</li>
                  <li>• Collaborative editing</li>
                  <li>• Asset management</li>
                </ul>
              </div>
            </div>
          </div>

          {/* GitHub Repository */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cyber-accent mb-6 cyber-glow-sm">
              Open Source
            </h2>
            <p className="text-cyber-text mb-6 max-w-2xl mx-auto">
              DASSH is built with transparency and community collaboration in mind. 
              Explore our codebase, contribute to development, or fork the project for your own use.
            </p>
            <button
              onClick={handleGitHubClick}
              className="cyber-button text-lg px-8 py-3 glow-on-hover"
            >
              <Github size={24} className="mr-3" />
              VIEW ON GITHUB
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
