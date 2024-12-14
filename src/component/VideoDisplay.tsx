interface VideoDisplayProps {
    videoUrl: string;
    videoType: 'mp4' | 'youtube' | null;
  }
  
  const VideoDisplay = ({ videoUrl, videoType,extractYouTubeVideoId }:any) => (
    <div className="relative mt-6">
      {videoType === 'mp4' && (
        <video controls className="w-full rounded-lg shadow-lg">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
  
      {videoType === 'youtube' && videoUrl && (
        <div id="youtube-player" className="w-full h-[315px]">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${extractYouTubeVideoId(videoUrl)}?enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
  
  export default VideoDisplay;
