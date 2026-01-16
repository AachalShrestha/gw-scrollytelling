import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { forwardRef } from "react";
const Copy = forwardRef(({ distanceTraveled, reachedPlanet, planetReached }, ref)=> {
  const textRefs = useRef([]);
  const waveVideoRef = useRef(null);

  const texts = [
    { start: 12, end: 50 },
    { start: 50, end: 90 },
    { start: 90, end: 130 },
    { start: 130, end: 190 },
    { start: 190, end: 260 },
    { start: 260, end: 300 },
    { start: 300, end: 370 },
    { start: 370, end: 410 },
    { start: 410, end: 480 },
    { start: 480, end: 530 },
    { start: 530 , end: 580 },
    { start: 620 , end: 680 },
    { start: 860 , end: 1000 },
    { start: 960 , end: 1050 },
  ];

  // initial opacity
  useLayoutEffect(() => {
    textRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0 });
    });
  }, []);

 useEffect(() => {


  textRefs.current.forEach((el, i) => {
    if (!el) return;

    const { start, end } = texts[i];
    const isActive = distanceTraveled >= start && distanceTraveled < end;

    gsap.to(el, {
      opacity: isActive ? 1 : 0,
      duration: 1,
      overwrite: "auto",
    });
    if (i === 3) {
      // Play video when second text is active
      if (isActive) {
        const video = waveVideoRef.current;
        if (!video) return;

        // Make sure it's visible play-wise
        video.muted = true;
        video.playsInline = true;

        video
          .play()
          .then(() => {
            // Only animate AFTER playback starts
            gsap.to(video, {
              opacity: 0.2,
              duration: 1,
              ease: "power2.out",
            });
          })
          .catch((err) => {
            console.warn("Video play blocked:", err);
          });

      } else {
        const video = waveVideoRef.current;
        if (!video) return;

        gsap.to(video, {
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            video.pause();
            video.currentTime = 0;
          },
        });
      }

    }

  });

/*   // Animate background ONCE
  gsap.to(document.body, {
    backgroundColor: titleActive ? "#8bb8ccff" : "#000000",
    color: titleActive ? "#000000ff" : "#ffffffff",
    duration: 1.5,
    ease: "power2.out",
    overwrite: "auto",
  }); */

}, [distanceTraveled]);


  return (
    <div className="copy-container">
      <div className="travelCopy">
        <div ref={el => (textRefs.current[0] = el)} className="t-copy t-copy-1">
          <p>All set? <br />It’s a long journey ahead.</p>
        </div>

        <div ref={el => (textRefs.current[1] = el)} className="t-copy t-copy-2">
          <p>While we travel, let’s take a moment to understand…</p>
        </div>

        <div ref={el => (textRefs.current[2] = el)} className="t-copy t-copy-title1">
          <h1>GRAVITATIONAL <br />WAVES</h1>
        </div>

        <div ref={el => (textRefs.current[3] = el)} className="t-copy t-copy-3">
          <p>Gravitational waves are ripples in spacetime created by violent cosmic events</p>
        </div>

        <div ref={el => (textRefs.current[4] = el)} className="t-copy t-copy-4">
          <p>They travel across the universe,<br />carrying information about their origin</p>
        </div>
        <div ref={el => (textRefs.current[5] = el)} className="t-copy t-copy-5">
          <p>In 2015, scientists detected these ripples for the first time.</p>
        </div>
        <div ref={el => (textRefs.current[6] = el)} className="t-copy t-copy-6">
          <p>The signal was captured by LIGO,<br />the Laser Interferometer Gravitational-Wave Observatory.</p>
        </div>
        <div ref={el => (textRefs.current[7] = el)} className="t-copy t-copy-7">
          <p>Two detectors on Earth, <br /> measuring changes smaller than an аtom.</p>
        </div>
        <div ref={el => (textRefs.current[8] = el)} className="t-copy t-copy-8">
          <p>Oh look we’ve reached the edge of our galaxy… <br /> and we’re still not halfway there.</p>
        </div>
        <div ref={el => (textRefs.current[9] = el)} className="t-copy t-copy-9">
          <p>The entire signal lasted only <strong>0.2 seconds.</strong></p>
        </div>
        <div ref={el => (textRefs.current[10] = el)} className="t-copy t-copy-10">
          <p>Yet it had been traveling through space<strong>for 1.3 billion years.</strong></p>
        </div>
        <div ref={el => (textRefs.current[11] = el)} className="t-copy t-copy-11">
          <p>Hold on<br />We're getting closer!</p>
        </div>
        <div ref={el => (textRefs.current[12] = el)} className="t-copy t-copy-12">
          <p>We’ve reached the source of the signal!</p>
        </div>

      </div>
      <div className={planetReached ? 'reachedPlanetCopy visible' : 'reachedPlanetCopy'} ref={ref} >
        <div className="reachedPlanetText">
          <h1>{reachedPlanet.name}</h1>
          <p>{reachedPlanet.description}</p>
        </div>
      </div>
       <video
        id="wave-video"
        className="video-background"
        autoPlay
        loop
        muted
        playsInline
        ref={waveVideoRef}
      >
        <source src="/space-wave2.mp4" type="video/mp4" />
      </video>
    </div>
  );
});
export default Copy;