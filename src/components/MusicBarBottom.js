import React, { useState, useRef } from 'react';
import ReactJkMusicPlayer from 'react-jinke-music-player';

function MusicBarBottom() {
    
     {
      return (
        <>
          <ReactJkMusicPlayer
            getAudioInstance={(instance) => {
              this.audioInstance = instance
            }}
          />
          <button onClick={() => this.audioInstance.play()}>play</button>
          <button onClick={() => this.audioInstance.pause()}>pause</button>
          <button onClick={() => this.audioInstance.load()}>reload</button>
          <button onClick={() => this.audioInstance.currentTime = 40}>
            change current play time
          </button>
          <button onClick={() => this.audioInstance.playbackRate = 2}>
            change play back rate
          </button>
          <button onClick={() => this.audioInstance.volume = 0.2}>
            change volume
          </button>
          <button onClick={() => this.audioInstance.destroy()}>
            destroy player
          </button>
          <button onClick={this.audio.togglePlay}>toggle play</button>
          <button onClick={this.audio.clear}>clear audio lists</button>
          <button onClick={this.audio.playNext}>play next</button>
          <button onClick={this.audio.playPrev}>play prev</button>
          <button onClick={() => this.audio.playByIndex(1)}>play by index</button>
          <button onClick={() => this.audio.updatePlayIndex(1)}>
            update play index
          </button>
        </>
      )
    }
  }
  export default MusicBarBottom;