interface PlayPauseButtonProps {
    isPlaying: boolean;
    onTogglePlayPause: () => void;
  }
  
  const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ isPlaying, onTogglePlayPause }) => (
    <div className="flex justify-center mt-4">
      <button
        onClick={onTogglePlayPause}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
  
  export default PlayPauseButton;
  