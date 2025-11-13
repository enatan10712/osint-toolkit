import { Clock } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
      <div className="bg-cyber-darker p-8 rounded-xl border border-cyber-blue/30 max-w-md w-full">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-cyber-blue/10 mb-4">
          <Clock className="h-8 w-8 text-cyber-blue" />
        </div>
        <h2 className="text-2xl font-bold text-cyber-blue mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{description}</p>
        <div className="mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyber-blue bg-cyber-blue/10">
                  Coming Soon
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-cyber-blue">
                  75%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cyber-darker">
              <div 
                style={{ width: '75%' }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyber-blue"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
