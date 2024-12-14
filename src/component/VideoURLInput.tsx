interface VideoUrlInputProps {
    videoUrl: string;
    isValidUrl: boolean | null;
    onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
  }
  
  const VideoUrlInput: React.FC<VideoUrlInputProps> = ({ videoUrl, isValidUrl, onUrlChange, onSubmit }) => (
    <form onSubmit={onSubmit} className="flex flex-col items-center mb-4">
      <div className="w-full mb-4">
        <input
          type="text"
          value={videoUrl}
          onChange={onUrlChange}
          placeholder="Enter video URL"
          className={`w-full p-2 border ${isValidUrl === false ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {isValidUrl === false && videoUrl && (
          <p className="text-red-500 mt-2 text-sm">Please enter a valid video URL (MP4 or YouTube).</p>
        )}
      </div>
  
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Load Video
      </button>
    </form>
  );
  
  export default VideoUrlInput;
  