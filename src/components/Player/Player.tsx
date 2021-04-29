import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Like } from "../../assets/Like";
import { Play } from "../../assets/Play";
import { Pause } from "../../assets/Pause";
import { Volume } from "../../assets/Volume";
import styles from "./Player.module.scss";
import Sound from "react-sound";
import { millisToMinutesAndSeconds } from "../../utils/msToMinutes";

type PlayerProps = {
  playPause: any;
  song: any;
  playing: boolean;
};

const Player = ({ playPause, song, playing }: PlayerProps) => {
  const [position, setPosition] = useState("0:00");
  const [progress, setProgres] = useState(0);
  const [volume, setVolume] = useState(70);
  const volumeRef = useRef<HTMLDivElement | null>(null);

  const handleVolumeChange = (event: any) => {
    if (volumeRef.current) {
      const right = volumeRef.current.getBoundingClientRect().right;
      const left = volumeRef.current.getBoundingClientRect().left;
      const pos = event.screenX;

      const scale = right - left;
      const input = pos - left;
      const percent = Math.round((input * 100) / scale);

      setVolume(percent);
    }
  };

  if (!song) {
    return null;
  } else {
    return (
      <div className={styles.Player}>
        <footer>
          <div className={styles.Song}>
            <div className={styles.Img}>
              <img src={song.track.album.images[0].url} alt="song" />
            </div>
            <div className={styles.Infos}>
              <div className={styles.Name}>{song.track.name}</div>
              <div className={styles.Artist}>{song.track.artists[0].name}</div>
            </div>
            <div className={styles.Like}>
              <Like />
            </div>
          </div>

          <div className={styles.Controls}>
            <div>
              <button onClick={playPause}>
                {playing ? <Pause /> : <Play />}
              </button>
            </div>
            <div className={styles.BarContainer}>
              <div>{position}</div>
              <div className={styles.Wrapper}>
                <div className={styles.Bar}>
                  <div
                    className={styles.Progress}
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                  />
                </div>
                <button style={{ left: `${progress}%` }} />
              </div>
              <div>0:30</div>
            </div>
          </div>

          <div className={styles.Volume}>
            <div>
              <button>
                <Volume />
              </button>
            </div>

            <div
              className={styles.Wrapper}
              onClick={handleVolumeChange}
              ref={volumeRef}
            >
              <div className={styles.Bar}>
                <div
                  className={styles.Progress}
                  style={{ transform: `translateX(-${100 - volume}%)` }}
                />
              </div>
              <button style={{ left: `${volume}%` }} />
            </div>
          </div>
        </footer>
        <Sound
          url={song.track.preview_url}
          playStatus={playing ? "PLAYING" : "PAUSED"}
          //@ts-ignore
          onPlaying={({ position }) => {
            setPosition(millisToMinutesAndSeconds(position));
            setProgres((position * 100) / 30000);
          }}
          onFinishedPlaying={() => playPause()}
          volume={volume}
        />
      </div>
    );
  }
};

const mapStateToProps = (state: {
  playing: { song: any; playing: boolean };
}) => {
  return {
    song: state.playing.song,
    playing: state.playing.playing,
  };
};

const mapDispatchToProps = (dispatch: (arg0: { type: string }) => any) => {
  return {
    playPause: () => dispatch({ type: "playpause" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
