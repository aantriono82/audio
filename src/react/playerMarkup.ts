export const playerMarkup = String.raw`<div class="app teac-rack-app" id="app">
  <!-- Top Chassis Screws & Branding Rail -->
  <header class="titlebar rack-titlebar">
    <div class="brand rack-brand"><span class="brand-emblem">T</span><span>TEAC</span><b>PRECISION HI-FI</b><span class="version">STUDIO RACK SYSTEM</span></div>
    <div class="title-motto">V-3RX STEREO CASSETTE DECK &amp; DC SERVO AMPLIFIER</div>
    <div class="title-actions">
      <span class="local-indicator"><i></i> HIGH FIDELITY</span>
      <button class="icon-button" id="toggle-drawer-top" title="Buka / Tutup Arsip Kaset" aria-label="Buka arsip kaset" data-icon="library"></button>
      <button class="icon-button" id="compact" title="Mode ringkas" aria-label="Mode ringkas" data-icon="minimize"></button>
      <button class="icon-button" id="help" title="Panduan dan pintasan" aria-label="Panduan dan pintasan" data-icon="help"></button>
    </div>
  </header>

  <!-- MAIN HI-FI RACK STACK -->
  <div class="hifi-rack-container" id="hifi-rack">
    
    <!-- ========================================================= -->
    <!-- UNIT 1: TEAC V-3RX STEREO CASSETTE DECK                   -->
    <!-- ========================================================= -->
    <section class="teac-unit teac-cassette-deck" id="cassette-deck-unit" aria-label="TEAC V-3RX Stereo Cassette Deck">
      <!-- Chassis Screws -->
      <div class="unit-screw screw-tl"></div>
      <div class="unit-screw screw-tr"></div>
      <div class="unit-screw screw-bl"></div>
      <div class="unit-screw screw-br"></div>

      <!-- Top Silkscreen Header -->
      <div class="deck-header-row">
        <div class="teac-logo-block">
          <span class="teac-brand-text">TEAC</span>
          <span class="teac-model-text">V-3RX</span>
          <span class="teac-sub-text">Stereo Cassette Deck</span>
        </div>
      </div>

      <!-- Deck Main Body Layout -->
      <div class="deck-main-panel">
        
        <!-- Deck Left: Power, ABC Selector, Open Button -->
        <div class="deck-left-column">
          <div class="power-switch-module">
            <button class="rocker-power-btn active" id="deck-power-btn" aria-label="Power Cassette Deck" aria-pressed="true">
              <span class="rocker-lens">POWER</span>
              <span class="rocker-metal"></span>
            </button>
            <div class="rocker-sublabel">ON <span class="arr-up">▲</span> <span class="arr-down">▼</span> OFF</div>
          </div>

          <div class="rotary-switch-block" id="deck-source-rotary" title="Source Selector">
            <div class="rotary-knob knob-small knob-rotary-3pos" data-pos="0">
              <div class="knob-indicator"></div>
            </div>
            <div class="rotary-labels">
              <span>A</span><span>B</span><span>C</span>
            </div>
          </div>

          <div class="eject-module">
            <span class="eject-label">OPEN</span>
            <button class="square-tactile-btn" id="deck-eject-btn" title="Buka pintu kaset / Impor musik" aria-label="Buka kompartemen kaset">
              <span class="btn-face"></span>
            </button>
          </div>
        </div>

        <!-- Deck Center-Left: Cassette Door & BASF Tape -->
        <div class="cassette-door-bay" id="cassette-door-bay">
          <div class="bay-recess">
            <!-- Cassette Glass Window -->
            <div class="cassette-glass-window">
              <div class="glass-reflection"></div>
              <div class="glass-crosshairs">
                <span class="ch-h1"></span><span class="ch-h2"></span><span class="ch-v"></span>
              </div>
              <div class="glass-screws"><i></i><i></i><i></i><i></i></div>

              <!-- BASF CR-E II 90 Cassette Tape Shell -->
              <div class="basf-cassette" id="basf-cassette">
                <div class="cassette-top-strip">
                  <div class="strip-lines"></div>
                  <div class="strip-meta">
                    <span>STEREO</span>
                    <span class="cassette-active-title" id="cassette-current-title">Amber Skies</span>
                    <span>NOISE RED.</span>
                    <span>NO.</span>
                  </div>
                </div>

                <!-- Tape Center Cutout with Reels -->
                <div class="cassette-middle-window">
                  <div class="tape-reel reel-left" id="deck-reel-left">
                    <div class="spool-core"></div>
                    <div class="spool-teeth"><i></i><i></i><i></i><i></i><i></i><i></i></div>
                  </div>
                  <div class="tape-pack-window">
                    <div class="tape-ribbon-pack" id="tape-pack-left"></div>
                    <div class="tape-view-gap"></div>
                    <div class="tape-ribbon-pack pack-yellow" id="tape-pack-right"></div>
                  </div>
                  <div class="tape-reel reel-right" id="deck-reel-right">
                    <div class="spool-core"></div>
                    <div class="spool-teeth"><i></i><i></i><i></i><i></i><i></i><i></i></div>
                  </div>
                </div>

                <!-- Cassette Label Section -->
                <div class="cassette-brand-strip">
                  <div class="side-num-left">1</div>
                  <div class="basf-logo-group">
                    <span class="basf-box"><i class="basf-dot"></i>BASF</span>
                    <span class="basf-model">CR-E II 90</span>
                    <span class="iec-badge">[IEC II]</span>
                  </div>
                  <div class="side-num-right">1</div>
                </div>

                <div class="cassette-bottom-roller-holes">
                  <span class="roller-hole"></span>
                  <span class="roller-hole center-hole"></span>
                  <span class="roller-hole"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Deck Center: System/Menu, Digital Red Counter, Piano Keys -->
        <div class="deck-center-console">
          <!-- Top island buttons: SYSTEM, MENU, AMPLIFIER, DSP & TAPE BIAS/EQ -->
          <div class="console-subpanel">
            <div class="sys-btn-grid">
              <div class="sys-col"><button class="mini-bezel-btn" id="btn-system">SYSTEM</button><span class="col-sub">TAPE (BIAS/EQ)</span></div>
              <div class="sys-col"><button class="mini-bezel-btn" id="btn-menu">MENU</button><span class="col-sub">NORMAL</span></div>
              <div class="sys-col"><button class="mini-bezel-btn" id="btn-amplifier">AMPLIFIER</button><span class="col-sub">Co (CrO₂)</span></div>
              <div class="sys-col"><button class="mini-bezel-btn" id="btn-dsp">DSP</button><span class="col-sub">METAL</span></div>
            </div>
            <!-- Green DBX Badge -->
            <div class="dbx-indicator-badge active" id="dbx-badge" title="dbx Dynamic Noise Reduction System">
              <span>dbx</span>
            </div>
          </div>

          <!-- Digital LED Tape Counter & Reset Knob -->
          <div class="tape-counter-row">
            <div class="counter-recess">
              <span class="counter-legend">TAPE COUNTER</span>
              <div class="seven-segment-display" id="digital-counter" aria-label="Penghitung pita kaset">
                <span class="seg-digit" id="counter-m1">0</span>
                <span class="seg-digit" id="counter-m2">0</span>
                <span class="seg-colon">:</span>
                <span class="seg-digit" id="counter-s1">0</span>
                <span class="seg-digit" id="counter-s2">0</span>
              </div>
            </div>
            <div class="counter-knob-block">
              <span class="knob-label-mini">COUNT<br>H.M<br>TIME</span>
              <button class="knob-rotary-reset" id="counter-reset-btn" title="Reset Counter" aria-label="Atur ulang penghitung"></button>
            </div>
          </div>

          <!-- Tactile Piano Transport Keys -->
          <div class="piano-transport-bank" aria-label="Kontrol transport pemutar kaset">
            <!-- REW Key -->
            <button class="piano-key" id="previous" data-deck-control="previous" title="Mundur / Lagu Sebelumnya" aria-label="Lagu sebelumnya">
              <span class="piano-symbol">◄◄</span>
            </button>
            <!-- STOP Key -->
            <button class="piano-key" id="stop-btn" data-deck-control="stop" title="Berhenti" aria-label="Berhenti">
              <span class="piano-label">STOP</span>
            </button>
            <!-- PLAY Key (wider key) -->
            <button class="piano-key piano-key-wide" id="play" data-deck-control="play" title="Putar / Jeda" aria-label="Putar">
              <span class="piano-symbol">►</span>
            </button>
            <!-- FF Key -->
            <button class="piano-key" id="next" data-deck-control="next" title="Maju / Lagu Berikutnya" aria-label="Lagu berikutnya">
              <span class="piano-symbol">►►</span>
            </button>
            <!-- REC Key -->
            <button class="piano-key key-rec" id="rec-btn" data-deck-control="rec" title="Rekam / Impor file audio" aria-label="Impor audio">
              <span class="piano-label">REC</span>
            </button>
            <!-- LOOP Key -->
            <button class="piano-key" id="repeat" data-deck-control="loop" title="Ulangi pemutaran" aria-label="Ulangi: mati">
              <span class="piano-label">LOOP</span>
            </button>
            <!-- PAUSE Key -->
            <button class="piano-key" id="pause-btn" data-deck-control="pause" title="Jeda pemutaran" aria-label="Jeda">
              <span class="piano-label">PAUSE</span>
            </button>
          </div>
        </div>

        <!-- Deck Right-Center: Twin Vertical Edge VU Meters -->
        <div class="deck-vu-section">
          <div class="twin-vu-housing">
            <!-- Left Channel Meter -->
            <div class="vertical-vu-meter meter-left" id="vu-meter-l">
              <span class="meter-channel-tag">LEFT CHANNEL</span>
              <div class="meter-dial-face">
                <div class="vu-graduations">
                  <div class="scale-red-zone">
                    <span>+5</span><span>+3</span><span>0</span>
                  </div>
                  <div class="scale-green-zone">
                    <span>3</span><span>5</span><span>7</span><span>10</span><span>20</span>
                  </div>
                </div>
                <div class="vu-arc-line"></div>
                <div class="vu-analog-needle" id="vu-needle-left"></div>
              </div>
              <span class="meter-foot-label">dB<br><small>PEAK LEVEL</small></span>
            </div>

            <!-- Right Channel Meter -->
            <div class="vertical-vu-meter meter-right" id="vu-meter-r">
              <span class="meter-channel-tag">RIGHT CHANNEL</span>
              <div class="meter-dial-face">
                <div class="vu-graduations">
                  <div class="scale-red-zone">
                    <span>+5</span><span>+3</span><span>0</span>
                  </div>
                  <div class="scale-green-zone">
                    <span>3</span><span>5</span><span>7</span><span>10</span><span>20</span>
                  </div>
                </div>
                <div class="vu-arc-line"></div>
                <div class="vu-analog-needle" id="vu-needle-right"></div>
              </div>
              <span class="meter-foot-label">dB<br><small>PEAK LEVEL</small></span>
            </div>
          </div>
        </div>

        <!-- Deck Far Right: Concentric Volume/Balance, Mute, Mic & Phone Jacks -->
        <div class="deck-right-controls">
          <div class="dual-concentric-knob-module">
            <span class="knob-title-top">VOLUME <span class="dot-sep">•</span> BALANCE</span>
            <div class="concentric-dial-scale">
              <div class="scale-tick t0">0</div>
              <div class="scale-tick t1">1</div>
              <div class="scale-tick t2">2</div>
              <div class="scale-tick t3">3</div>
              <div class="scale-tick t4">4</div>
              <div class="scale-tick t5">5</div>
              <div class="scale-tick t6">6</div>
              <div class="scale-tick t7">7</div>
              <div class="scale-tick t8">8</div>
              <div class="scale-tick t9">9</div>
              <div class="scale-tick t10">10</div>
            </div>
            <div class="knob-metal-body knob-large-dial" id="deck-volume-knob" title="Putar atau drag untuk mengubah volume">
              <div class="knob-red-indicator" id="deck-vol-pointer"></div>
            </div>
          </div>

          <div class="deck-mute-module">
            <span class="switch-title">MUTE</span>
            <button class="push-rect-switch" id="mute" aria-label="Bisukan suara" aria-pressed="false">
              <span class="switch-pip"></span>
            </button>
            <span class="switch-state-text">ON <span class="arr-up">▲</span> <span class="arr-down">▼</span> OFF</span>
          </div>

          <div class="jack-socket-row">
            <div class="jack-item"><div class="phone-jack-socket"><i></i></div><span>L MIC</span></div>
            <div class="jack-item"><div class="phone-jack-socket"><i></i></div><span>R</span></div>
            <div class="jack-item"><div class="phone-jack-socket jack-phones"><i></i></div><span>PHONES</span></div>
          </div>
        </div>

      </div>
      <!-- Deck Chassis Bottom Feet -->
      <div class="chassis-foot foot-left"></div>
      <div class="chassis-foot foot-right"></div>
    </section>

    <!-- ========================================================= -->
    <!-- UNIT 2: TEAC INTEGRATED DC SERVO AMPLIFIER                -->
    <!-- ========================================================= -->
    <section class="teac-unit teac-amplifier" id="amplifier-unit" aria-label="TEAC Integrated DC Servo Amplifier">
      <!-- Chassis Screws -->
      <div class="unit-screw screw-tl"></div>
      <div class="unit-screw screw-tr"></div>
      <div class="unit-screw screw-bl"></div>
      <div class="unit-screw screw-br"></div>

      <!-- Amplifier Header Silkscreen -->
      <div class="amp-header-row">
        <div class="teac-logo-block">
          <span class="teac-brand-text">TEAC</span>
          <span class="teac-sub-text">Integrated DC Servo Amplifier</span>
        </div>
      </div>

      <!-- Amplifier Main Body Layout -->
      <div class="amp-main-panel">
        
        <!-- Amp Left Column: Power & Phones Jack -->
        <div class="amp-left-column">
          <div class="power-switch-module">
            <button class="rocker-power-btn active" id="amp-power-btn" aria-label="Power Amplifier" aria-pressed="true">
              <span class="rocker-lens">POWER</span>
              <span class="rocker-metal"></span>
            </button>
            <div class="rocker-sublabel">ON <span class="arr-up">▲</span> <span class="arr-down">▼</span> OFF</div>
          </div>
          <div class="jack-item amp-phone-jack">
            <div class="phone-jack-socket"><i></i></div>
            <span>PHONES</span>
          </div>
        </div>

        <!-- Amp Center-Left: VFD / LED Output Power Watts Meter Display -->
        <div class="amp-vfd-display-panel">
          <div class="vfd-bezel-recess">
            <div class="vfd-inner-screen">
              <!-- Scale markings in Watts -->
              <div class="watts-scale-row">
                <span>.003</span><span>.015</span><span>0.04</span><span>0.1</span><span>0.3</span><span>0.7</span><span>2</span><span>5</span><span>10</span><span>20</span><span>40</span><span>80</span>
                <span class="watts-unit">WATTS</span>
              </div>

              <!-- Left Channel Bar -->
              <div class="watts-channel-row">
                <span class="ch-label">LEFT</span>
                <div class="watts-bar-track" id="watts-track-left">
                  <div class="watts-seg green"></div><div class="watts-seg green"></div><div class="watts-seg green"></div>
                  <div class="watts-seg green"></div><div class="watts-seg green"></div><div class="watts-seg green"></div>
                  <div class="watts-seg amber"></div><div class="watts-seg amber"></div><div class="watts-seg amber"></div>
                  <div class="watts-seg red"></div><div class="watts-seg red"></div><div class="watts-seg red"></div>
                </div>
                <span class="peak-text">PEAK</span>
              </div>

              <!-- Center Graticule Ticks -->
              <div class="vfd-center-graticule">
                <span>||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||</span>
              </div>

              <!-- Right Channel Bar -->
              <div class="watts-channel-row">
                <span class="ch-label">RIGHT</span>
                <div class="watts-bar-track" id="watts-track-right">
                  <div class="watts-seg green"></div><div class="watts-seg green"></div><div class="watts-seg green"></div>
                  <div class="watts-seg green"></div><div class="watts-seg green"></div><div class="watts-seg green"></div>
                  <div class="watts-seg amber"></div><div class="watts-seg amber"></div><div class="watts-seg amber"></div>
                  <div class="watts-seg red"></div><div class="watts-seg red"></div><div class="watts-seg red"></div>
                </div>
                <span class="vu-text">VU</span>
              </div>

              <!-- Indicator Lamps: LEFT, RIGHT, STEREO, EQUALIZER, MUTE -->
              <div class="amp-indicator-lamps">
                <div class="amp-lamp-item"><i class="lamp-dot green active"></i><span>LEFT</span></div>
                <div class="amp-lamp-item"><i class="lamp-dot green active"></i><span>RIGHT</span></div>
                <div class="amp-lamp-item"><i class="lamp-dot green active"></i><span>STEREO</span></div>
                <div class="amp-lamp-item"><i class="lamp-dot amber" id="lamp-equalizer"></i><span>EQUALIZER</span></div>
                <div class="amp-lamp-item"><i class="lamp-dot red" id="lamp-mute"></i><span>MUTE</span></div>
              </div>
            </div>

            <!-- Lower Buttons on the VFD Bezel: SPEAKERS & DISPLAY -->
            <div class="vfd-lower-push-buttons">
              <div class="speaker-btn-group">
                <button class="bezel-push-tab active" id="spk-left">LEFT</button>
                <button class="bezel-push-tab active" id="spk-right">RIGHT</button>
                <button class="bezel-push-tab active" id="spk-stereo">STEREO</button>
                <span class="btn-group-label">SPEAKERS</span>
              </div>
              <div class="display-btn-group">
                <span class="btn-group-label">DISPLAY</span>
                <button class="bezel-push-tab" id="dsp-vu">VU</button>
                <button class="bezel-push-tab active" id="dsp-peak">PEAK</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Amp Center-to-Right: Tone Controls, DSP Knobs & Giant Master Volume -->
        <div class="amp-controls-bank">
          
          <!-- Top Row of Knobs: BASS, TREBLE, PREAMP, BALANCE -->
          <div class="amp-top-knob-row">
            <!-- BASS Knob -->
            <div class="rotary-control-module">
              <span class="knob-label">BASS</span>
              <div class="knob-scale-arc">
                <span>12</span><span>3</span><span>0</span><span>3</span><span>12</span>
              </div>
              <div class="knob-metal-body knob-medium" id="knob-bass" data-param="bass" title="Pengatur Bas (-12 s/d +12 dB)">
                <div class="knob-indicator-line"></div>
              </div>
              <span class="knob-sub-sign">−&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+</span>
            </div>

            <!-- TREBLE Knob -->
            <div class="rotary-control-module">
              <span class="knob-label">TREBLE</span>
              <div class="knob-scale-arc">
                <span>12</span><span>3</span><span>0</span><span>3</span><span>12</span>
              </div>
              <div class="knob-metal-body knob-medium" id="knob-treble" data-param="treble" title="Pengatur Treble (-12 s/d +12 dB)">
                <div class="knob-indicator-line"></div>
              </div>
              <span class="knob-sub-sign">−&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+</span>
            </div>

            <!-- PREAMP Knob -->
            <div class="rotary-control-module">
              <span class="knob-label">PREAMP</span>
              <div class="knob-scale-arc">
                <span>12</span><span>3</span><span>0</span><span>3</span><span>12</span>
              </div>
              <div class="knob-metal-body knob-medium" id="knob-preamp" data-param="preamp" title="Pengatur Preamp (-12 s/d +12 dB)">
                <div class="knob-indicator-line"></div>
              </div>
              <span class="knob-sub-sign">−&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+</span>
            </div>

            <!-- BALANCE Knob -->
            <div class="rotary-control-module">
              <span class="knob-label">BALANCE</span>
              <div class="knob-scale-arc">
                <span>2</span><span>1</span><span>0</span><span>1</span><span>2</span>
              </div>
              <div class="knob-metal-body knob-medium" id="knob-balance" data-param="balance" title="Keseimbangan Kiri / Kanan">
                <div class="knob-indicator-line"></div>
              </div>
              <span class="knob-sub-sign">L&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R</span>
            </div>
          </div>

          <!-- Bottom Row: EQUALIZER/DSP, TRUE BASS, ENHANCER, REVERB, MUTE -->
          <div class="amp-bottom-knob-row">
            <!-- EQUALIZER / DSP Switch -->
            <div class="amp-switch-module">
              <div class="switch-head-labels"><span>EQUALIZER</span><span>DSP</span></div>
              <button class="horiz-slider-switch" id="switch-eq-dsp" title="Buka Ekualiser 10-Band / DSP">
                <span class="slider-thumb"></span>
              </button>
              <div class="rocker-sublabel">ON <span class="arr-up">▲</span> <span class="arr-down">▼</span> OFF</div>
            </div>

            <!-- TRUE BASS Knob -->
            <div class="rotary-control-module mini-module">
              <div class="knob-metal-body knob-small" id="knob-true-bass" data-param="truebass" title="True Bass Enhancer">
                <div class="knob-indicator-line"></div>
              </div>
              <span class="knob-sub-sign">−&nbsp;&nbsp;&nbsp;+</span>
              <span class="knob-label-bottom">TRUE BASS</span>
            </div>

            <!-- ENHANCER Knob -->
            <div class="rotary-control-module mini-module">
              <div class="knob-metal-body knob-small" id="knob-enhancer" data-param="enhancer" title="Sound Enhancer / Clarity">
                <div class="knob-indicator-line"></div>
              </div>
              <span class="knob-sub-sign">−&nbsp;&nbsp;&nbsp;+</span>
              <span class="knob-label-bottom">ENHANCER</span>
            </div>

            <!-- REVERB Knob -->
            <div class="rotary-control-module mini-module">
              <div class="knob-metal-body knob-small" id="knob-reverb" data-param="reverb" title="Studio Reverb Effect">
                <div class="knob-indicator-line"></div>
              </div>
              <span class="knob-sub-sign">−&nbsp;&nbsp;&nbsp;+</span>
              <span class="knob-label-bottom">REVERB</span>
            </div>

            <!-- MUTE Switch -->
            <div class="amp-switch-module amp-mute-block">
              <span class="switch-head-labels">MUTE</span>
              <button class="push-rect-switch" id="amp-mute-switch" title="Bisukan Suara">
                <span class="switch-pip"></span>
              </button>
              <div class="rocker-sublabel">ON <span class="arr-up">▲</span> <span class="arr-down">▼</span> OFF</div>
            </div>
          </div>

        </div>

        <!-- Amp Far Right: GIANT MASTER VOLUME KNOB -->
        <div class="amp-master-volume-section">
          <span class="master-vol-title">VOLUME</span>
          <div class="giant-knob-dial-scale">
            <span class="gv-tick gv0">0</span>
            <span class="gv-tick gv1">1</span>
            <span class="gv-tick gv2">2</span>
            <span class="gv-tick gv3">3</span>
            <span class="gv-tick gv4">4</span>
            <span class="gv-tick gv5">5</span>
            <span class="gv-tick gv6">6</span>
            <span class="gv-tick gv7">7</span>
            <span class="gv-tick gv8">8</span>
            <span class="gv-tick gv9">9</span>
            <span class="gv-tick gv10">10</span>
          </div>
          <div class="giant-metal-knob" id="giant-master-volume" title="Master Volume (Putar atau Drag)">
            <div class="giant-knob-notch" id="giant-vol-notch"></div>
          </div>
        </div>

      </div>
      <!-- Amp Chassis Bottom Feet -->
      <div class="chassis-foot foot-left"></div>
      <div class="chassis-foot foot-right"></div>
    </section>

  </div>

  <!-- ========================================================= -->
  <!-- INTEGRATED HI-FI TAPE ARCHIVE / MUSIC LIBRARY DRAWER     -->
  <!-- ========================================================= -->
  <div class="tape-archive-drawer" id="tape-drawer">
    <!-- Drawer Header & Handle -->
    <div class="drawer-handle-bar" id="drawer-toggle-handle">
      <div class="handle-grip"><span></span><span></span><span></span></div>
      <span class="handle-title">▲ OPEN TEAC TAPE ARCHIVE &amp; PROGRAM INDEX</span>
      <div class="handle-actions">
        <span class="drawer-status-led"><i></i> ARCHIVE READY</span>
      </div>
    </div>

    <!-- Drawer Content Panel -->
    <div class="drawer-content-wrap">
      <!-- Sidebar / Source Navigator -->
      <aside class="sidebar rack-sidebar">
        <div class="side-brand">
          <span>TEAC</span><strong>TAPE INDEX</strong><small>LOCAL AUDIO ARCHIVE</small>
        </div>
        <div class="sidebar-heading">SOURCE SELECTOR</div>
        <nav aria-label="Koleksi musik">
          <button class="nav-item active" data-view="all"><span data-icon="library"></span>Semua musik<span class="nav-count" id="all-count">6</span></button>
          <button class="nav-item" data-view="favorites"><span data-icon="heart"></span>Favorit<span class="nav-count" id="favorite-count">0</span></button>
          <button class="nav-item" data-view="recent"><span data-icon="history"></span>Terakhir diputar</button>
        </nav>
        <div class="sidebar-heading playlist-heading">DAFTAR PUTAR <button class="icon-button small" id="new-playlist" title="Buat daftar putar" aria-label="Buat daftar putar" data-icon="plus"></button></div>
        <nav id="playlist-nav" aria-label="Daftar putar"></nav>
        <div class="sidebar-footer">
          <div class="collection-icon" data-icon="folder"></div>
          <strong>LOCAL STORAGE</strong>
          <p>Koleksi lagu tetap tersimpan<br>di peramban Anda.</p>
          <button class="folder-button" id="import-folder"><span data-icon="folder-plus"></span> PILIH FOLDER</button>
          <button class="folder-button mt-6" id="import"><span data-icon="plus"></span> LOAD TAPE FILE</button>
        </div>
      </aside>

      <!-- Main Library Table -->
      <main class="library rack-library">
        <div class="page-heading">
          <div>
            <div class="eyebrow"><span></span> CASSETTE BAY / SIDE 1</div>
            <h1 id="view-title">Semua musik<span>.</span></h1>
            <p id="collection-summary">Koleksi pribadi dengan sentuhan hi-fi klasik.</p>
          </div>
          <button class="primary-button" id="play-session"><span data-icon="plus"></span> TAMBAH MUSIK</button>
        </div>

        <div class="library-toolbar">
          <div class="track-tabs">
            <button class="track-tab active" id="track-tab">TAPE INDEX <span id="track-count">6</span></button>
            <button class="track-tab" id="queue-tab">PLAY QUEUE <span id="queue-count">0</span></button>
          </div>
          <div class="table-actions">
            <label class="search">
              <span data-icon="search"></span>
              <input id="search" placeholder="Cari judul lagu atau artis…" aria-label="Cari lagu atau artis" autocomplete="off" />
              <kbd>/</kbd>
            </label>
            <button class="icon-button" id="sort" aria-label="Urutkan lagu berdasarkan judul" title="Urutkan berdasarkan judul" data-icon="sort"></button>
          </div>
        </div>

        <div class="track-table-wrap">
          <table class="track-table">
            <thead>
              <tr>
                <th class="number-col">#</th>
                <th>PROGRAM / TITLE</th>
                <th class="album-col">ALBUM</th>
                <th class="format-col">TAPE</th>
                <th class="duration-col"><span data-icon="clock" aria-label="Durasi"></span></th>
                <th class="actions-col"></th>
              </tr>
            </thead>
            <tbody id="tracks"></tbody>
          </table>
          <div class="empty-state" id="empty" hidden>
            <span data-icon="music"></span>
            <h3>Tape bay kosong.</h3>
            <p>Tambahkan file atau folder musik untuk mulai memutar.</p>
          </div>
        </div>

        <div class="library-bottom">
          <span id="library-total">6 lagu demo</span>
          <span><i></i> CASSETTE DECK READY</span>
        </div>
      </main>

      <!-- Now Playing & Frequency Spectrum Panel -->
      <aside class="now-panel rack-now-panel">
        <div class="panel-heading">PROGRAM MONITOR <span class="tiny-bars"><i></i><i></i><i></i></span></div>

        <!-- Album Art Card -->
        <div class="album-art large-art" id="now-art" data-art="0">
          <div class="art-grid"></div>
          <span class="art-label">NOW PLAYING<br><small>TEAC PRECISION HI-FI</small></span>
          <div class="art-sun"></div>
          <div class="art-horizon"></div>
          <span class="art-title">AFTER HOURS<span>ATIGA SESSIONS</span></span>
          <span class="art-corner">A</span>
        </div>

        <div class="now-track">
          <div>
            <small>PROGRAM / TITLE</small>
            <h2 id="now-title">Amber Skies</h2>
            <p id="now-artist">Atiga Sessions</p>
          </div>
          <button class="icon-button" id="now-favorite" aria-label="Tambahkan ke favorit" data-icon="heart"></button>
        </div>

        <div class="audio-tags">
          <span id="now-format">WAV</span>
          <span id="now-quality">HIGH BIAS</span>
          <span>STEREO</span>
        </div>

        <!-- Real-time Audio Spectrum Box -->
        <section class="spectrum-box">
          <div class="instrument-heading">
            <span>SPECTRUM ANALYZER</span>
            <span class="live-label" id="spectrum-status">STANDBY</span>
          </div>
          <canvas id="spectrum" aria-label="Spektrum frekuensi audio"></canvas>
          <div class="frequency-labels">
            <span>60</span><span>250</span><span>1K</span><span>4K</span><span>16K</span>
          </div>
        </section>

        <!-- DSP & Next Program Info -->
        <button class="eq-toggle" id="eq-toggle" aria-expanded="false">
          <span data-icon="sliders"></span>
          <span>DSP MANAGER <small id="preset-label">Datar</small></span>
          <span class="eq-status">10 BAND</span>
          <span data-icon="chevron"></span>
        </button>

        <div class="next-up">
          <div class="panel-heading">NEXT PROGRAM <button class="text-button" id="show-queue">QUEUE <span>↗</span></button></div>
          <div class="next-track" id="next-track"></div>
        </div>
      </aside>
    </div>
  </div>

  <!-- Standard Hidden Controls for App Engine Interop -->
  <footer class="player hidden-player" style="display:none;" aria-hidden="true">
    <div class="player-track">
      <div class="mini-art" id="player-art" data-art="0"><span>AA</span></div>
      <div>
        <strong id="player-title">Amber Skies</strong>
        <span id="player-artist">Atiga Sessions</span>
      </div>
      <button class="icon-button" id="player-favorite" aria-label="Favorit"></button>
    </div>
    <div class="transport">
      <button id="shuffle" aria-label="Acak"></button>
      <div class="seek-row">
        <time id="elapsed">00:00</time>
        <input type="range" id="seek" min="0" max="100" step="0.1" value="0" aria-label="Posisi pemutaran" />
        <time id="duration">00:32</time>
      </div>
    </div>
    <div class="player-tools">
      <input type="range" id="volume" min="0" max="1" step="0.01" value="0.7" aria-label="Volume" />
      <button id="player-eq" aria-label="Ekualiser"></button>
      <button id="player-queue" aria-label="Antrean"></button>
    </div>
  </footer>

  <!-- Status Bar -->
  <div class="statusbar">
    <span><i></i> POWER ON <span class="status-separator">/</span> TEAC DC SERVO DRIVE</span>
    <span>TEAC V-3RX STEREO CASSETTE DECK <span class="status-separator">·</span> PRECISION AUDIO</span>
  </div>
</div>

<!-- Native and Dialog Inputs -->
<input type="file" id="file-input" accept="audio/*,.flac,.ogg,.m4a,.opus,.aiff,.webm" multiple hidden />
<input type="file" id="folder-input" webkitdirectory multiple hidden />
<div class="drop-overlay" id="drop-overlay" hidden>
  <span data-icon="music"></span>
  <h2>Load your tape.</h2>
  <p>Lepaskan file audio untuk memuat kaset ke deck.</p>
</div>

<!-- Dialogs: Equalizer, Playlist, Track Options, Help -->
<dialog id="eq-dialog">
  <form method="dialog" class="dialog-heading">
    <div>
      <div class="eyebrow">TEAC / TONE CONTROL &amp; DSP</div>
      <h2>Ekualiser Grafis<span>.</span></h2>
    </div>
    <button class="icon-button" aria-label="Tutup ekualiser" data-icon="close"></button>
  </form>
  <div class="eq-controls">
    <label>Prasetel
      <select id="eq-preset">
        <option value="Flat">Datar</option>
        <option value="Warm">Hangat</option>
        <option value="Bass Boost">Penguat bas</option>
        <option value="Vocal">Vokal</option>
        <option value="Bright">Cerah</option>
        <option value="Custom">Kustom</option>
      </select>
    </label>
    <button class="text-button" id="eq-reset">Atur ulang</button>
  </div>
  <div class="eq-bands" id="eq-bands"></div>
  <p class="dialog-note">Sesuaikan respon frekuensi 10-band. Karakter suara langsung diterapkan saat audio diputar.</p>
</dialog>

<dialog id="playlist-dialog">
  <form id="playlist-form">
    <div class="dialog-heading">
      <h2>Daftar putar baru<span>.</span></h2>
      <button type="button" class="icon-button" id="close-playlist" aria-label="Tutup" data-icon="close"></button>
    </div>
    <label class="field-label" for="playlist-name">Nama daftar putar</label>
    <input id="playlist-name" class="text-input" placeholder="Misalnya: Kaset Pilihan" maxlength="48" required />
    <button class="primary-button form-submit" type="submit">Buat daftar putar <span data-icon="plus"></span></button>
  </form>
</dialog>

<dialog id="track-dialog">
  <form method="dialog" class="dialog-heading">
    <h2 id="track-dialog-title">Opsi lagu</h2>
    <button class="icon-button" aria-label="Tutup" data-icon="close"></button>
  </form>
  <div id="track-options"></div>
</dialog>

<dialog id="help-dialog">
  <form method="dialog" class="dialog-heading">
    <h2>TEAC V-3RX &amp; DC SERVO AMPLIFIER<span>.</span></h2>
    <button class="icon-button" aria-label="Tutup panduan" data-icon="close"></button>
  </form>
  <p>Sistem pemutar musik vintage Hi-Fi dengan cassette deck mekanis dan amplifier terintegrasi. Gunakan tombol tuts piano untuk kontrol playback, knob putar untuk mengatur volume, bass, treble, dan balance.</p>
  <div class="shortcut-list">
    <span>Putar / Jeda <kbd>Spasi</kbd></span>
    <span>Cari koleksi <kbd>/</kbd></span>
    <span>Lagu berikutnya <kbd>Alt →</kbd></span>
    <span>Lagu sebelumnya <kbd>Alt ←</kbd></span>
  </div>
  <p>Semua file audio yang diimpor diproses lokal di peramban Anda.</p>
</dialog>

<div role="status" id="toast" class="toast" hidden></div>
<audio id="audio" preload="auto"></audio>
`;
