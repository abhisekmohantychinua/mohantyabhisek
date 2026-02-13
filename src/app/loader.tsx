export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <video autoPlay loop muted playsInline className="w-20 h-20">
        <source src="/loader.webm" type="video/webm" />
        <source src="/loader.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
