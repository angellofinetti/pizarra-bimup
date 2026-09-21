import Sidebar from './components/Sidebar';
import LearningCanvas from './components/LearningCanvas';

function App() {
  return (
    <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative h-full">
        <LearningCanvas />
      </main>
    </div>
  );
}

export default App;
