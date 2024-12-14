interface CaptionDisplayProps {
    captionToDisplay: string;
  }
  
  const CaptionDisplay: React.FC<CaptionDisplayProps> = ({ captionToDisplay }) => (
    captionToDisplay ? (
      <div className="absolute bottom-10 bg-red-950 left-0 right-0 text-center text-white bg-opacity-60 p-2 rounded-lg">
        {captionToDisplay}
      </div>
    ) : null
  );
  
  export default CaptionDisplay;
  