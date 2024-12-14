interface CaptionInputProps {
    timestamp: string;
    caption: string;
    isValidTimestamp: boolean | null;
    isValidCaption: boolean | null;
    onTimestampChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCaptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddCaption: (e: React.FormEvent) => void;
  }
  
  const CaptionInput: React.FC<CaptionInputProps> = ({
    timestamp,
    caption,
    isValidTimestamp,
    isValidCaption,
    onTimestampChange,
    onCaptionChange,
    onAddCaption,
  }) => (
    <form onSubmit={onAddCaption} className="flex flex-col items-center mb-4">
      <div className="w-full mb-4">
        <input
          type="text"
          value={timestamp}
          onChange={onTimestampChange}
          placeholder="Enter timestamp (hh:mm:ss)"
          className={`w-full p-2 border ${isValidTimestamp === false ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {isValidTimestamp === false && timestamp && (
          <p className="text-red-500 mt-2 text-sm">Please enter a valid timestamp (hh:mm:ss).</p>
        )}
      </div>
  
      <div className="w-full mb-4">
        <input
          type="text"
          value={caption}
          onChange={onCaptionChange}
          placeholder="Enter caption text"
          className={`w-full p-2 border ${isValidCaption === false ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {isValidCaption === false && caption && (
          <p className="text-red-500 mt-2 text-sm">Caption cannot be empty.</p>
        )}
      </div>
  
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Add Caption
      </button>
    </form>
  );
  
  export default CaptionInput;
  