// components/task-manager-description.tsx
const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <span className="text-2xl">{icon}</span>
    <div>
      <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

export const TaskManagerDescription = () => (
  <div
    id="feature-description"
    className="max-w-4xl mx-auto mt-12 px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-opacity duration-500"
  >
    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
      Why FocusFlow?
    </h3>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <FeatureCard
          title="Deep Focus Sessions"
          description="Eliminate distractions with timed focus sessions that help you enter a state of flow."
          icon="🎯"
        />
        <FeatureCard
          title="Smart Timing"
          description="Research-backed timer intervals maximize productivity and prevent burnout."
          icon="⏱️"
        />
      </div>
      <div className="space-y-4">
        <FeatureCard
          title="Progress Tracking"
          description="Visual progress indicators help you stay motivated and on track."
          icon="📈"
        />
        <FeatureCard
          title="Flexible Durations"
          description="Customize focus durations to match your workflow and attention span."
          icon="🔄"
        />
      </div>
    </div>
  </div>
);
