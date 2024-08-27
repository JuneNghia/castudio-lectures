const Video = () => {
  return (
    <div className="w-full h-full justify-center flex items-center">
      <div style={{ width: "640px", height: "480px", position: "relative" }}>
        <iframe
          src="https://drive.google.com/file/d/1-OrsePUAkO6VkuTHVCGJ13F1ytpwIu7c/preview"
          width="640"
          height="480"
          seamless={undefined}
          allowFullScreen
        />

        <div
          style={{
            width: "80px",
            height: "80px",
            position: "absolute",
            opacity: 0,
            right: "0px",
            top: "0px",
          }}
        >
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default Video;
