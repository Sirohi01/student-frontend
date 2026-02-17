import SubjectManager from '../components/planner/SubjectManager';
import TaskList from '../components/planner/TaskList';

const Planner = () => {
    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Planner 📅</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Manage your subjects and tasks efficiently.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
                {/* Left Column: Subjects */}
                <div className="lg:col-span-1 h-full overflow-hidden">
                    <SubjectManager />
                </div>

                {/* Right Column: Tasks */}
                <div className="lg:col-span-2 h-full overflow-hidden">
                    <TaskList />
                </div>
            </div>
        </div>
    );
};

export default Planner;
