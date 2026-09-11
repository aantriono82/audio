export const playerMarkup = String.raw`<div class="app teac-rack-app" id="app">
  <!-- Top Chassis Screws & Branding Rail -->
  <header class="titlebar rack-titlebar">
    <div class="brand rack-brand"><span class="brand-emblem">A</span><span>ATIGA</span><b>PRECISION HI-FI</b><span class="version">STUDIO RACK SYSTEM</span></div>
    <div class="title-motto">AMP STEREO CASSETTE DECK &amp; DC SERVO AMPLIFIER</div>
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
    <section class="teac-unit teac-cassette-deck" id="cassette-deck-unit" aria-label="ATIGA AMP Stereo Cassette Deck">
      <!-- Chassis Screws -->
      <div class="unit-screw screw-tl"></div>
      <div class="unit-screw screw-tr"></div>
      <div class="unit-screw screw-bl"></div>
      <div class="unit-screw screw-br"></div>

      <!-- Top Silkscreen Header -->
      <div class="deck-header-row">
        <div class="teac-logo-block">
          <span class="teac-brand-text">ATIGA</span>
          <span class="teac-model-text">AMP</span>
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
            <div class="rocker-sublabel">ON <span class="sym-box">■</span> <span class="sym-box">■</span> OFF</div>
          </div>

          <div class="rotary-switch-block" id="deck-source-rotary" title="Source Selector">
            <div class="rotary-labels">
              <span>A</span><span>B</span><span>C</span>
            </div>
            <div class="rotary-knob knob-small knob-rotary-3pos" data-pos="0">
              <div class="knob-indicator"></div>
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
            <div class="bay-screw bay-screw-left"></div>
            <div class="bay-screw bay-screw-right"></div>
            <!-- Cassette Glass Window -->
            <div class="cassette-glass-window">
              <div class="glass-reflection"></div>
              <div class="glass-crosshairs">
                <span class="ch-h"></span>
                <span class="ch-v1"></span>
                <span class="ch-v-mid"></span>
                <span class="ch-v2"></span>
              </div>

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
          <!-- Top island matrix: SYSTEM / TAPE BIAS/EQ & dbx badge -->
          <div class="console-matrix-panel">
            <!-- Row 1: dbx badge aligned to the top right -->
            <div class="matrix-top-header">
              <div class="dbx-indicator-badge active" id="dbx-badge" title="dbx Dynamic Noise Reduction System" role="button" tabindex="0" aria-label="dbx Noise Reduction">
                <span>dbx</span>
              </div>
            </div>

            <!-- Row 2: Push buttons for Menu, Amplifier, DSP -->
            <div class="matrix-btn-row matrix-btn-row-top">
              <div class="matrix-spacer"></div>
              <div class="matrix-btn-cell">
                <button class="matrix-btn active" id="btn-menu" aria-label="Menu" title="Menu"></button>
              </div>
              <div class="matrix-btn-cell">
                <button class="matrix-btn active" id="btn-amplifier" aria-label="Amplifier" title="Amplifier"></button>
              </div>
              <div class="matrix-btn-cell">
                <button class="matrix-btn" id="btn-dsp" aria-label="DSP" title="DSP"></button>
              </div>
            </div>

            <!-- Row 3: Printed Matrix Legend Plaque -->
            <div class="matrix-chart-card">
              <div class="chart-row chart-row-top">
                <div class="chart-col-head">SYSTEM</div>
                <div class="chart-col-cell" id="matrix-lbl-menu" role="button" tabindex="0" title="Buka / Tutup Daftar Lagu">MENU</div>
                <div class="chart-col-cell" id="matrix-lbl-amplifier" role="button" tabindex="0" title="Tampilkan / Sembunyikan Amplifier">AMPLIFIER</div>
                <div class="chart-col-cell" id="matrix-lbl-dsp" role="button" tabindex="0" title="Buka AIMP Sound Effects DSP">DSP</div>
              </div>
              <div class="chart-row chart-row-bottom">
                <div class="chart-col-head">TAPE (BIAS/EQ)</div>
                <div class="chart-col-cell" id="matrix-lbl-normal" role="button" tabindex="0" title="Pilih Tape Normal">NORMAL</div>
                <div class="chart-col-cell" id="matrix-lbl-cro2" role="button" tabindex="0" title="Pilih Tape CrO₂">Co (CrO₂)</div>
                <div class="chart-col-cell" id="matrix-lbl-metal" role="button" tabindex="0" title="Pilih Tape Metal">METAL</div>
              </div>
            </div>

            <!-- Row 4: Push buttons for Normal, CrO2, Metal -->
            <div class="matrix-btn-row matrix-btn-row-bottom">
              <div class="matrix-spacer"></div>
              <div class="matrix-btn-cell">
                <button class="matrix-btn active" id="btn-tape-normal" aria-label="Tape Normal" title="Normal Bias/EQ"></button>
              </div>
              <div class="matrix-btn-cell">
                <button class="matrix-btn" id="btn-tape-cro2" aria-label="Tape CrO2" title="CrO2 Bias/EQ"></button>
              </div>
              <div class="matrix-btn-cell">
                <button class="matrix-btn" id="btn-tape-metal" aria-label="Tape Metal" title="Metal Bias/EQ"></button>
              </div>
            </div>
          </div>

          <!-- Digital LED Tape Counter & Reset Knob -->
          <div class="tape-counter-row">
            <div class="counter-display-module">
              <span class="counter-legend">TAPE COUNTER</span>
              <div class="counter-cluster">
                <div class="seven-segment-display" id="digital-counter" aria-label="Penghitung pita kaset">
                  <span class="seg-digit" id="counter-m1">0</span>
                  <span class="seg-digit" id="counter-m2">0</span>
                  <span class="seg-dot">.</span>
                  <span class="seg-digit" id="counter-s1">1</span>
                  <span class="seg-digit" id="counter-s2">7</span>
                </div>
                <button class="counter-reset-rect" id="counter-reset-btn" title="Reset Counter" aria-label="Atur ulang penghitung"></button>
              </div>
            </div>
            <div class="counter-knob-module">
              <span class="knob-label-mini">COUNT<br>H.M<br>TIME</span>
              <div class="knob-counter-mode" id="counter-mode-knob">
                <div class="counter-knob-notch"></div>
              </div>
            </div>
          </div>

          <!-- Tactile Piano Transport Keys -->
          <div class="piano-transport-bank" aria-label="Kontrol transport pemutar kaset">
            <div class="piano-btn-col col-rew">
              <span class="piano-label">◄◄</span>
              <button class="piano-key key-narrow" id="previous" data-deck-control="previous" title="Mundur / Lagu Sebelumnya" aria-label="Lagu sebelumnya"></button>
            </div>
            <div class="piano-btn-col col-stop">
              <span class="piano-label">STOP</span>
              <button class="piano-key key-wide" id="stop-btn" data-deck-control="stop" title="Berhenti" aria-label="Berhenti"></button>
            </div>
            <div class="piano-btn-col col-play">
              <span class="piano-label">►</span>
              <button class="piano-key key-wide active" id="play" data-deck-control="play" title="Putar / Jeda" aria-label="Putar"></button>
            </div>
            <div class="piano-btn-col col-ff">
              <span class="piano-label">►►</span>
              <button class="piano-key key-narrow" id="next" data-deck-control="next" title="Maju / Lagu Berikutnya" aria-label="Lagu berikutnya"></button>
            </div>
            <div class="piano-btn-col col-rec">
              <span class="piano-label">REC</span>
              <button class="piano-key key-narrow key-rec" id="rec-btn" data-deck-control="rec" title="Rekam / Impor file audio" aria-label="Impor audio"></button>
            </div>
            <div class="piano-btn-col col-loop">
              <span class="piano-label">LOOP</span>
              <button class="piano-key key-narrow" id="repeat" data-deck-control="loop" title="Ulangi pemutaran" aria-label="Ulangi: mati"></button>
            </div>
            <div class="piano-btn-col col-pause">
              <span class="piano-label">PAUSE</span>
              <button class="piano-key key-narrow" id="pause-btn" data-deck-control="pause" title="Jeda pemutaran" aria-label="Jeda"></button>
            </div>
          </div>
        </div>

        <!-- Deck Right-Center: Twin Vertical Edge VU Meters -->
        <!-- Deck Right-Center: Twin Vertical Edge VU Meters -->
        <div class="deck-vu-section">
          <div class="twin-vu-housing">
            <!-- Left Channel Meter -->
            <div class="vertical-vu-meter meter-left" id="vu-meter-l">
              <div class="vu-glass-sheen"></div>
              <span class="meter-channel-tag">LEFT CHANNEL</span>
              <div class="meter-dial-face">
                <div class="vu-scale-graphic">
                  <svg class="vu-scale-svg" viewBox="0 0 76 130">
                    <path class="scale-arc-green" d="M 46 115 C 41 85, 40 55, 43 36" fill="none" stroke="#16a34a" stroke-width="2.5" />
                    <path class="scale-arc-red" d="M 43 36 C 44 26, 46 16, 49 8" fill="none" stroke="#dc2626" stroke-width="2.5" />
                    <line x1="39" y1="36" x2="47" y2="36" stroke="#000" stroke-width="1.5" />
                  </svg>
                  <div class="vu-scale-nums">
                    <div class="sc-red">
                      <span>5</span>
                      <span>3</span>
                      <span class="sc-zero">0</span>
                    </div>
                    <div class="sc-green">
                      <span>3</span>
                      <span>5</span>
                      <span>7</span>
                      <span>10</span>
                      <span>20</span>
                    </div>
                  </div>
                </div>
                <div class="vu-analog-needle" id="vu-needle-left"></div>
              </div>
              <div class="meter-footer-tag">
                <span class="db-txt">dB</span>
                <span class="peak-txt">PEAK LEVEL</span>
              </div>
            </div>

            <!-- Right Channel Meter -->
            <div class="vertical-vu-meter meter-right" id="vu-meter-r">
              <div class="vu-glass-sheen"></div>
              <span class="meter-channel-tag">RIGHT CHANNEL</span>
              <div class="meter-dial-face">
                <div class="vu-scale-graphic">
                  <svg class="vu-scale-svg" viewBox="0 0 76 130">
                    <path class="scale-arc-green" d="M 30 115 C 35 85, 36 55, 33 36" fill="none" stroke="#16a34a" stroke-width="2.5" />
                    <path class="scale-arc-red" d="M 33 36 C 32 26, 30 16, 27 8" fill="none" stroke="#dc2626" stroke-width="2.5" />
                    <line x1="29" y1="36" x2="37" y2="36" stroke="#000" stroke-width="1.5" />
                  </svg>
                  <div class="vu-scale-nums">
                    <div class="sc-red">
                      <span>5</span>
                      <span>3</span>
                      <span class="sc-zero">0</span>
                    </div>
                    <div class="sc-green">
                      <span>3</span>
                      <span>5</span>
                      <span>7</span>
                      <span>10</span>
                      <span>20</span>
                    </div>
                  </div>
                </div>
                <div class="vu-analog-needle" id="vu-needle-right"></div>
              </div>
              <div class="meter-footer-tag">
                <span class="db-txt">dB</span>
                <span class="peak-txt">PEAK LEVEL</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Deck Far Right: Concentric Volume/Balance, Mute, Mic & Phone Jacks -->
        <!-- Deck Far Right: Concentric Volume/Balance, Mute, Mic & Phone Jacks -->
        <div class="deck-right-controls">
          <div class="dual-concentric-knob-module">
            <div class="volume-balance-header">
              <span class="vb-txt">VOLUME</span>
              <span class="vb-concentric-symbol">
                <i class="vb-line-left"></i>
                <i class="vb-outer-circle"></i>
                <i class="vb-inner-dot"></i>
                <i class="vb-line-right"></i>
              </span>
              <span class="vb-txt">BALANCE</span>
            </div>

            <div class="concentric-dial-outer">
              <!-- Outer scale collar with 0..10 and radial ticks -->
              <div class="concentric-dial-scale">
                <span class="scale-tick sn0">0</span>
                <span class="scale-tick sn1">1</span>
                <span class="scale-tick sn2">2</span>
                <span class="scale-tick sn3">3</span>
                <span class="scale-tick sn4">4</span>
                <span class="scale-tick sn5">5</span>
                <span class="scale-tick sn6">6</span>
                <span class="scale-tick sn7">7</span>
                <span class="scale-tick sn8">8</span>
                <span class="scale-tick sn9">9</span>
                <span class="scale-tick sn10">10</span>

                <div class="dial-radial-ticks">
                  <i class="d-tick dt-m121"></i>
                  <i class="d-tick dt-m94"></i>
                  <i class="d-tick dt-m67"></i>
                  <i class="d-tick dt-m40"></i>
                  <i class="d-tick dt-m13"></i>
                  <i class="d-tick dt-p13"></i>
                  <i class="d-tick dt-p40"></i>
                  <i class="d-tick dt-p67"></i>
                  <i class="d-tick dt-p94"></i>
                  <i class="d-tick dt-p121"></i>
                </div>

                <!-- Raised balance index tab with red vertical line at 10:30 -->
                <div class="balance-index-tab">
                  <div class="balance-red-line"></div>
                </div>
              </div>

              <!-- Inner rotatable 102px volume knob -->
              <div class="knob-concentric-housing">
                <div class="knob-metal-body knob-large-dial" id="deck-volume-knob" title="Putar atau drag untuk mengubah volume">
                  <div class="knob-face-wedge"></div>
                  <div class="knob-indicator-notch" id="deck-vol-pointer"></div>
                </div>
              </div>

              <!-- MUTE push switch nestled right at the bottom edge of the dial -->
              <div class="deck-mute-module">
                <div class="mute-switch-socket">
                  <button class="push-rect-switch" id="mute" aria-label="Bisukan suara" aria-pressed="false">
                    <span class="switch-pip"></span>
                  </button>
                </div>
                <span class="switch-title">MUTE</span>
                <div class="rocker-sublabel">ON <span class="sym-box">■</span> <span class="sym-box">■</span> OFF</div>
              </div>
            </div>
          </div>

          <!-- Bottom 3 jacks -->
          <div class="jack-socket-row">
            <div class="jack-item">
              <div class="phone-jack-socket"><i></i></div>
              <span class="jack-label">L</span>
            </div>
            <div class="jack-item">
              <div class="phone-jack-socket"><i></i></div>
              <span class="jack-label">MIC &nbsp; R</span>
            </div>
            <div class="jack-item">
              <div class="phone-jack-socket jack-phones"><i></i></div>
              <span class="jack-label">PHONES</span>
            </div>
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
    <section class="teac-unit teac-amplifier" id="amplifier-unit" aria-label="ATIGA Integrated DC Servo Amplifier">
      <!-- Chassis Screws -->
      <div class="unit-screw screw-tl"></div>
      <div class="unit-screw screw-tr"></div>
      <div class="unit-screw screw-bl"></div>
      <div class="unit-screw screw-br"></div>

      <!-- Amplifier Header Silkscreen -->
      <div class="amp-header-row">
        <div class="teac-logo-block">
          <span class="teac-brand-text">ATIGA</span>
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
            <div class="rocker-sublabel">ON <span class="sym-box">■</span> <span class="sym-box">■</span> OFF</div>
          </div>
          <div class="jack-item amp-phone-jack">
            <span class="jack-label">PHONES</span>
            <div class="phone-jack-socket"><i></i></div>
          </div>
        </div>

        <!-- Amp Center-Left: VFD / LED Output Power Watts Meter Display -->
        <div class="amp-vfd-display-panel">
          <div class="vfd-bezel-recess">
            <div class="vfd-screen-frame">
              <div class="vfd-glass-streak"></div>
              <div class="vfd-inner-screen">
                <!-- Scale markings in Watts with vertical grid ticks -->
                <div class="watts-scale-row">
                  <div class="watts-col"><span>.003</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>.015</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>0.04</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>0.1</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>0.3</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>0.7</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>2</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>5</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>10</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>20</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>40</span><i class="w-tick"></i></div>
                  <div class="watts-col"><span>80</span><i class="w-tick"></i></div>
                  <div class="watts-col watts-col-unit"><span class="w-sep">|</span><span class="watts-unit">WATTS</span></div>
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
                  <div class="ch-status-indicator">
                    <i class="vfd-led-dot active" id="dot-peak"></i>
                    <span class="peak-text">PEAK</span>
                  </div>
                </div>

                <!-- Center Graticule Ticks -->
                <div class="vfd-center-graticule">
                  <div class="graticule-axis">
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i><i class="gr-sub"></i><i class="gr-sub"></i><i class="gr-sub"></i></div>
                    <div class="gr-col"><i class="gr-maj"></i></div>
                  </div>
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
                  <div class="ch-status-indicator">
                    <span class="vu-text">VU</span>
                    <i class="vfd-led-dot active" id="dot-vu"></i>
                  </div>
                </div>

                <!-- Bottom Graticule Ticks below Right Channel -->
                <div class="vfd-bottom-ticks">
                  <div class="gr-bot-tick"></div><div class="gr-bot-tick"></div><div class="gr-bot-tick"></div>
                  <div class="gr-bot-tick"></div><div class="gr-bot-tick"></div><div class="gr-bot-tick"></div>
                  <div class="gr-bot-tick"></div><div class="gr-bot-tick"></div><div class="gr-bot-tick"></div>
                  <div class="gr-bot-tick"></div><div class="gr-bot-tick"></div><div class="gr-bot-tick"></div>
                </div>

                <!-- Indicator Lamps / Status Cells -->
                <div class="amp-indicator-lamps">
                  <div class="amp-lamp-item"><i class="lamp-dot green active" id="lamp-left"></i><span>LEFT</span></div>
                  <div class="amp-lamp-item"><i class="lamp-dot green active" id="lamp-right"></i><span>RIGHT</span></div>
                  <div class="amp-lamp-item"><i class="lamp-dot green active" id="lamp-stereo"></i><span>STEREO</span></div>
                  <div class="amp-lamp-item"><i class="lamp-dot amber" id="lamp-equalizer"></i><span>EQUALIZER</span></div>
                  <div class="amp-lamp-item"><i class="lamp-dot red" id="lamp-mute"></i><span>MUTE</span></div>
                </div>
              </div>
            </div>

            <!-- Lower Buttons on the VFD Bezel: SPEAKERS & DISPLAY -->
            <div class="vfd-lower-push-buttons">
              <div class="speaker-btn-group">
                <div class="bezel-btn-cell">
                  <span class="bezel-btn-label">LEFT</span>
                  <button class="bezel-push-tab active" id="spk-left" aria-label="Speaker Left"></button>
                </div>
                <div class="bezel-btn-cell">
                  <span class="bezel-btn-label">RIGHT</span>
                  <button class="bezel-push-tab active" id="spk-right" aria-label="Speaker Right"></button>
                </div>
                <div class="bezel-btn-cell">
                  <span class="bezel-btn-label">STEREO</span>
                  <button class="bezel-push-tab active" id="spk-stereo" aria-label="Speaker Stereo"></button>
                </div>
                <span class="btn-group-title">SPEAKERS</span>
              </div>
              <div class="display-btn-group">
                <span class="btn-group-title">DISPLAY</span>
                <div class="bezel-btn-cell">
                  <span class="bezel-btn-label">VU</span>
                  <button class="bezel-push-tab" id="dsp-vu" aria-label="Display VU"></button>
                </div>
                <div class="bezel-btn-cell">
                  <span class="bezel-btn-label">PEAK</span>
                  <button class="bezel-push-tab active" id="dsp-peak" aria-label="Display Peak"></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Amp Center-to-Right: Tone Controls, DSP Knobs & Giant Master Volume -->
        <div class="amp-controls-bank">
          
          <!-- Top Row of Knobs: BASS, TREBLE, PREAMP, BALANCE -->
          <div class="amp-top-knob-row">
            <!-- BASS Knob -->
            <div class="rotary-control-module tone-large-module">
              <span class="knob-label">BASS</span>
              <div class="tone-dial-housing">
                <div class="knob-scale-arc tone-scale-9">
                  <span class="sc-num sc-m12">12</span>
                  <i class="sc-tick st-m126"></i>
                  <span class="sc-num sc-m9">9</span>
                  <i class="sc-tick st-m90"></i>
                  <span class="sc-num sc-m6">6</span>
                  <i class="sc-tick st-m54"></i>
                  <span class="sc-num sc-m3">3</span>
                  <i class="sc-tick st-m18"></i>
                  <span class="sc-num sc-0">0</span>
                  <i class="sc-tick st-p18"></i>
                  <span class="sc-num sc-p3">3</span>
                  <i class="sc-tick st-p54"></i>
                  <span class="sc-num sc-p6">6</span>
                  <i class="sc-tick st-p90"></i>
                  <span class="sc-num sc-p9">9</span>
                  <i class="sc-tick st-p126"></i>
                  <span class="sc-num sc-p12">12</span>
                  <i class="sc-tick st-m162"></i>
                  <i class="sc-tick st-p162"></i>
                </div>
                <div class="knob-metal-body knob-medium" id="knob-bass" data-param="bass" title="Pengatur Bas (-12 s/d +12 dB)">
                  <div class="knob-indicator-line"></div>
                </div>
              </div>
              <div class="knob-sub-signs"><span>−</span><span>+</span></div>
            </div>

            <!-- TREBLE Knob -->
            <div class="rotary-control-module tone-large-module">
              <span class="knob-label">TREBLE</span>
              <div class="tone-dial-housing">
                <div class="knob-scale-arc tone-scale-9">
                  <span class="sc-num sc-m12">12</span>
                  <i class="sc-tick st-m126"></i>
                  <span class="sc-num sc-m9">9</span>
                  <i class="sc-tick st-m90"></i>
                  <span class="sc-num sc-m6">6</span>
                  <i class="sc-tick st-m54"></i>
                  <span class="sc-num sc-m3">3</span>
                  <i class="sc-tick st-m18"></i>
                  <span class="sc-num sc-0">0</span>
                  <i class="sc-tick st-p18"></i>
                  <span class="sc-num sc-p3">3</span>
                  <i class="sc-tick st-p54"></i>
                  <span class="sc-num sc-p6">6</span>
                  <i class="sc-tick st-p90"></i>
                  <span class="sc-num sc-p9">9</span>
                  <i class="sc-tick st-p126"></i>
                  <span class="sc-num sc-p12">12</span>
                  <i class="sc-tick st-m162"></i>
                  <i class="sc-tick st-p162"></i>
                </div>
                <div class="knob-metal-body knob-medium" id="knob-treble" data-param="treble" title="Pengatur Treble (-12 s/d +12 dB)">
                  <div class="knob-indicator-line"></div>
                </div>
              </div>
              <div class="knob-sub-signs"><span>−</span><span>+</span></div>
            </div>

            <!-- PREAMP Knob -->
            <div class="rotary-control-module tone-large-module">
              <span class="knob-label">PREAMP</span>
              <div class="tone-dial-housing">
                <div class="knob-scale-arc tone-scale-9">
                  <span class="sc-num sc-m12">12</span>
                  <i class="sc-tick st-m126"></i>
                  <span class="sc-num sc-m9">9</span>
                  <i class="sc-tick st-m90"></i>
                  <span class="sc-num sc-m6">6</span>
                  <i class="sc-tick st-m54"></i>
                  <span class="sc-num sc-m3">3</span>
                  <i class="sc-tick st-m18"></i>
                  <span class="sc-num sc-0">0</span>
                  <i class="sc-tick st-p18"></i>
                  <span class="sc-num sc-p3">3</span>
                  <i class="sc-tick st-p54"></i>
                  <span class="sc-num sc-p6">6</span>
                  <i class="sc-tick st-p90"></i>
                  <span class="sc-num sc-p9">9</span>
                  <i class="sc-tick st-p126"></i>
                  <span class="sc-num sc-p12">12</span>
                  <i class="sc-tick st-m162"></i>
                  <i class="sc-tick st-p162"></i>
                </div>
                <div class="knob-metal-body knob-medium" id="knob-preamp" data-param="preamp" title="Pengatur Preamp (-12 s/d +12 dB)">
                  <div class="knob-indicator-line"></div>
                </div>
              </div>
              <div class="knob-sub-signs"><span>−</span><span>+</span></div>
            </div>

            <!-- BALANCE Knob -->
            <div class="rotary-control-module tone-large-module">
              <span class="knob-label">BALANCE</span>
              <div class="tone-dial-housing">
                <div class="knob-scale-arc tone-scale-balance">
                  <span class="sc-num sc-b8l">8</span>
                  <i class="sc-tick st-m126"></i>
                  <span class="sc-num sc-b6l">6</span>
                  <i class="sc-tick st-m90"></i>
                  <span class="sc-num sc-b4l">4</span>
                  <i class="sc-tick st-m54"></i>
                  <span class="sc-num sc-b2l">2</span>
                  <i class="sc-tick st-m18"></i>
                  <span class="sc-num sc-b0">0</span>
                  <i class="sc-tick st-p18"></i>
                  <span class="sc-num sc-b2r">2</span>
                  <i class="sc-tick st-p54"></i>
                  <span class="sc-num sc-b4r">4</span>
                  <i class="sc-tick st-p90"></i>
                  <span class="sc-num sc-b6r">6</span>
                  <i class="sc-tick st-p126"></i>
                  <span class="sc-num sc-b8r">8</span>
                  <i class="sc-tick st-m162"></i>
                  <i class="sc-tick st-p162"></i>
                </div>
                <div class="knob-metal-body knob-medium" id="knob-balance" data-param="balance" title="Keseimbangan Kiri / Kanan">
                  <div class="knob-indicator-line"></div>
                </div>
              </div>
              <div class="knob-sub-signs"><span>L</span><span>R</span></div>
            </div>
          </div>

          <!-- Bottom Row: EQUALIZER/DSP dual keys, TRUE BASS, ENHANCER, REVERB, MUTE -->
          <div class="amp-bottom-knob-row">
            <!-- Dual Push Keys: EQUALIZER and DSP -->
            <div class="amp-switch-module amp-dual-keys-block">
              <div class="switch-head-labels"><span>EQUALIZER</span><span>DSP</span></div>
              <div class="amp-dual-keys-housing" id="switch-eq-dsp" title="Buka Ekualiser 10-Band / DSP">
                <button class="amp-dual-key-btn active" id="btn-amp-eq"><span></span></button>
                <button class="amp-dual-key-btn" id="btn-amp-dsp"><span></span></button>
              </div>
              <div class="rocker-sublabel">ON <span class="sym-box">■</span> <span class="sym-box">■</span> OFF</div>
            </div>

            <!-- TRUE BASS Knob -->
            <div class="rotary-control-module mini-module">
              <div class="mini-dial-ticks">
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
              <div class="knob-metal-body knob-small" id="knob-true-bass" data-param="truebass" title="True Bass Enhancer">
                <div class="knob-indicator-line"></div>
              </div>
              <div class="knob-sub-signs mini-signs"><span>−</span><span>+</span></div>
              <span class="knob-label-bottom">TRUE BASS</span>
            </div>

            <!-- ENHANCER Knob -->
            <div class="rotary-control-module mini-module">
              <div class="mini-dial-ticks">
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
              <div class="knob-metal-body knob-small" id="knob-enhancer" data-param="enhancer" title="Sound Enhancer / Clarity">
                <div class="knob-indicator-line"></div>
              </div>
              <div class="knob-sub-signs mini-signs"><span>−</span><span>+</span></div>
              <span class="knob-label-bottom">ENHANCER</span>
            </div>

            <!-- REVERB Knob -->
            <div class="rotary-control-module mini-module">
              <div class="mini-dial-ticks">
                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
              <div class="knob-metal-body knob-small" id="knob-reverb" data-param="reverb" title="Studio Reverb Effect">
                <div class="knob-indicator-line"></div>
              </div>
              <div class="knob-sub-signs mini-signs"><span>−</span><span>+</span></div>
              <span class="knob-label-bottom">REVERB</span>
            </div>

            <!-- MUTE Push Switch -->
            <div class="amp-switch-module amp-mute-block">
              <span class="switch-head-labels">MUTE</span>
              <div class="amp-mute-recess">
                <button class="push-rect-switch" id="amp-mute-switch" title="Bisukan Suara">
                  <span class="switch-pip"></span>
                </button>
              </div>
              <div class="rocker-sublabel">ON <span class="sym-box">■</span> <span class="sym-box">■</span> OFF</div>
            </div>
          </div>

        </div>

        <!-- Amp Far Right: GIANT MASTER VOLUME KNOB -->
        <div class="amp-master-volume-section">
          <div class="vol-dial-housing">
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
              <!-- intermediate radial tick marks -->
              <div class="gv-ticks-ring">
                <i class="gvt gt-m154"></i>
                <i class="gvt gt-m126"></i>
                <i class="gvt gt-m98"></i>
                <i class="gvt gt-m70"></i>
                <i class="gvt gt-m42"></i>
                <i class="gvt gt-m14"></i>
                <i class="gvt gt-p14"></i>
                <i class="gvt gt-p42"></i>
                <i class="gvt gt-p70"></i>
                <i class="gvt gt-p98"></i>
                <i class="gvt gt-p126"></i>
                <i class="gvt gt-p154"></i>
              </div>
            </div>
            <div class="giant-metal-knob" id="giant-master-volume" title="Master Volume (Putar atau Drag)">
              <div class="giant-knob-notch" id="giant-vol-notch"></div>
            </div>
          </div>
        </div>

      </div>
      <!-- Amp Chassis Bottom Feet -->
      <div class="chassis-foot foot-left"></div>
      <div class="chassis-foot foot-right"></div>
    </section>

    <!-- ========================================================= -->
    <!-- UNIT 3: TEAC / ATIGA INTEGRATED HI-FI PLAYLIST DECK       -->
    <!-- (Placed directly below Integrated DC Servo Amplifier)     -->
    <!-- ========================================================= -->
    <section class="teac-unit-playlist open" id="tape-drawer" aria-label="Daftar Lagu dan Antrean">
      <!-- Top Toolbar: Tabs, Search, Dropdown Category, Sort, Add -->
      <div class="playlist-deck-header">
        <div class="playlist-deck-tabs">
          <button type="button" class="pl-tab-btn active" id="track-tab">
            <span>Daftar lagu</span>
            <span class="pl-tab-badge" id="track-count">6</span>
          </button>
          <button type="button" class="pl-tab-btn" id="queue-tab">
            <span>Antrean</span>
            <span class="pl-tab-badge" id="queue-count">0</span>
          </button>
        </div>

        <div class="playlist-deck-tools">
          <label class="pl-search-box">
            <span data-icon="search"></span>
            <input id="search" placeholder="Cari lagu atau artis…" aria-label="Cari lagu atau artis" autocomplete="off" />
            <kbd>/</kbd>
          </label>

          <div class="pl-select-wrap">
            <select id="view-select" aria-label="Pilih kategori lagu" class="pl-view-select">
              <option value="all">Semua lagu</option>
              <option value="favorites">Favorit</option>
              <option value="recent">Terakhir diputar</option>
              <option value="smart:frequent">Sering diputar</option>
              <option value="smart:unplayed">Belum diputar</option>
            </select>
            <span class="pl-select-arrow" data-icon="chevron"></span>
          </div>

          <button type="button" class="icon-button pl-tool-btn" id="sort" aria-label="Urutkan lagu berdasarkan judul" title="Urutkan berdasarkan judul" data-icon="sort"></button>
          <button type="button" class="icon-button pl-tool-btn" id="play-session" aria-label="Tambah musik" title="Tambah musik" data-icon="plus"></button>
        </div>
      </div>

      <!-- Main Horizontal Track Table -->
      <div class="track-table-wrap">
        <table class="track-table">
          <thead>
            <tr>
              <th class="number-col">#</th>
              <th class="title-col">JUDUL LAGU</th>
              <th class="album-col">ALBUM</th>
              <th class="format-col">FORMAT</th>
              <th class="duration-col"><span data-icon="clock" aria-label="Durasi"></span></th>
              <th class="actions-col"></th>
            </tr>
          </thead>
          <tbody id="tracks"></tbody>
        </table>
        <div class="empty-state" id="empty" hidden>
          <span data-icon="music"></span>
          <h3>Daftar lagu kosong.</h3>
          <p>Tarik file audio ke sini atau klik Tambah Musik untuk memuat kaset.</p>
        </div>
      </div>

      <!-- Footer Info and Drop Prompt -->
      <div class="playlist-deck-footer">
        <div class="pl-footer-left">
          <span id="library-total">6 lagu · 18 menit</span>
        </div>
        <div class="pl-footer-center">
          <button type="button" class="pl-drop-prompt" id="import-prompt" title="Tarik atau klik untuk memuat file audio">
            <span data-icon="upload"></span>
            <span>Tarik file musik ke sini untuk menambah koleksi &nbsp;·&nbsp; MP3 &nbsp;·&nbsp; WAV &nbsp;·&nbsp; OGG &nbsp;·&nbsp; FLAC</span>
          </button>
        </div>
        <div class="pl-footer-right">
          <span class="pl-ready-indicator"><i></i> Siap untuk didengarkan</span>
        </div>
      </div>

      <!-- Hidden interop container for secondary bindings -->
      <div class="legacy-bindings" hidden style="display:none !important;" aria-hidden="true">
        <span id="all-count">0</span>
        <span id="favorite-count">0</span>
        <span id="view-title">Semua musik</span>
        <span id="collection-summary"></span>
        <nav id="playlist-nav"></nav>
        <div id="now-art" data-art="0"><span class="art-title"></span></div>
        <span id="now-title"></span>
        <span id="now-artist"></span>
        <span id="now-quality"></span>
        <span id="now-format"></span>
        <button id="now-favorite"></button>
        <span id="duration"></span>
        <div id="next-track"></div>
        <canvas id="spectrum"></canvas>
        <button id="eq-toggle"></button>
        <span id="preset-label"></span>
        <button id="import-folder"></button>
        <button id="import"></button>
        <button id="new-playlist"></button>
        <span id="spectrum-status"></span>
      </div>
    </section>

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
    <span><i></i> POWER ON <span class="status-separator">/</span> ATIGA DC SERVO DRIVE</span>
    <span>ATIGA AMP STEREO CASSETTE DECK <span class="status-separator">·</span> PRECISION AUDIO</span>
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
      <div class="eyebrow">ATIGA / TONE CONTROL &amp; DSP</div>
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
    <h2>ATIGA AMP &amp; DC SERVO AMPLIFIER<span>.</span></h2>
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

<!-- AIMP Sound Effects / DSP Manager Dialog -->
<dialog id="dsp-dialog" class="aimp-dsp-dialog" aria-labelledby="aimp-dialog-title">
  <!-- Window Titlebar -->
  <div class="aimp-titlebar" id="aimp-titlebar">
    <div class="aimp-titlebar-text" id="aimp-dialog-title">Sound Effects</div>
    <button type="button" class="aimp-titlebar-close" id="aimp-close-x" aria-label="Close Sound Effects">
      <svg viewBox="0 0 10 10" width="10" height="10">
        <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  </div>

  <!-- AIMP Header -->
  <div class="aimp-header">
    <div class="aimp-logo">
      <svg class="aimp-logo-icon" viewBox="0 0 40 40" width="32" height="32" aria-hidden="true">
        <polygon points="5,35 20,5 35,35" fill="#0078d7" />
        <polygon points="20,15 12,32 28,32" fill="#ffffff" />
        <polygon points="20,23 16,30 24,30" fill="#0078d7" />
      </svg>
      <span class="aimp-logo-text">ATIGA AMP</span>
    </div>
    <div class="aimp-subtitle">DSP Manager</div>
  </div>

  <!-- Tabs Navigation -->
  <nav class="aimp-tabs" role="tablist" aria-label="DSP Manager Tabs">
    <button type="button" class="aimp-tab active" data-tab="general" role="tab" aria-selected="true" id="aimp-tab-general">General</button>
    <button type="button" class="aimp-tab" data-tab="equalizer" role="tab" aria-selected="false" id="aimp-tab-equalizer">Equalizer</button>
    <button type="button" class="aimp-tab" data-tab="volume" role="tab" aria-selected="false" id="aimp-tab-volume">Volume</button>
    <button type="button" class="aimp-tab" data-tab="mixing" role="tab" aria-selected="false" id="aimp-tab-mixing">Mixing</button>
    <button type="button" class="aimp-tab" data-tab="remove-silence" role="tab" aria-selected="false" id="aimp-tab-remove-silence">Remove Silence</button>
  </nav>

  <!-- Frame Content -->
  <div class="aimp-tab-content-frame">
    <!-- Tab 1: General (Active) -->
    <div class="aimp-panel active" id="aimp-panel-general" role="tabpanel" aria-labelledby="aimp-tab-general">
      <!-- 3 Columns Sliders Grid -->
      <div class="aimp-sliders-grid">
        <!-- Column 1 -->
        <div class="aimp-slider-col">
          <!-- Echo -->
          <div class="aimp-slider-group" data-slider="echo">
            <div class="aimp-slider-label">Echo</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-echo" min="0" max="100" value="0" step="1" title="Echo (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <!-- Reverb -->
          <div class="aimp-slider-group" data-slider="reverb">
            <div class="aimp-slider-label">Reverb</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-reverb" min="0" max="100" value="0" step="1" title="Reverb (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <!-- Flanger -->
          <div class="aimp-slider-group" data-slider="flanger">
            <div class="aimp-slider-label">Flanger</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-flanger" min="0" max="100" value="0" step="1" title="Flanger (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2 -->
        <div class="aimp-slider-col">
          <!-- Chorus -->
          <div class="aimp-slider-group" data-slider="chorus">
            <div class="aimp-slider-label">Chorus</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-chorus" min="0" max="100" value="0" step="1" title="Chorus (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <!-- Bass -->
          <div class="aimp-slider-group" data-slider="bass">
            <div class="aimp-slider-label">Bass</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-bass" min="-12" max="12" value="0" step="1" title="Bass (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <!-- Stereo enhancer -->
          <div class="aimp-slider-group" data-slider="stereo-enhancer">
            <div class="aimp-slider-label">Stereo enhancer</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-stereo" min="0" max="100" value="0" step="1" title="Stereo enhancer (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3 -->
        <div class="aimp-slider-col">
          <!-- Speed -->
          <div class="aimp-slider-group" data-slider="speed">
            <div class="aimp-slider-label">Speed</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-speed" min="50" max="150" value="100" step="1" title="Speed (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <!-- Tempo -->
          <div class="aimp-slider-group" data-slider="tempo">
            <div class="aimp-slider-label">Tempo</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-tempo" min="50" max="150" value="100" step="1" title="Tempo (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <!-- Pitch -->
          <div class="aimp-slider-group" data-slider="pitch">
            <div class="aimp-slider-label">Pitch</div>
            <div class="aimp-slider-track-wrap">
              <div class="aimp-ticks aimp-ticks-top">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <input type="range" class="aimp-slider" id="aimp-slider-pitch" min="-12" max="12" value="0" step="1" title="Pitch (Right click to reset)" />
              <div class="aimp-ticks aimp-ticks-bottom">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Click Reset Hint -->
      <div class="aimp-reset-hint">* You can reset values by right mouse click</div>

      <!-- Checkboxes -->
      <div class="aimp-checkbox-list">
        <label class="aimp-checkbox-item">
          <input type="checkbox" id="aimp-check-voice-remover" />
          <span class="aimp-checkbox-text">Voice Remover (for Stereo Only)</span>
        </label>
        <label class="aimp-checkbox-item">
          <input type="checkbox" id="aimp-check-fade-pause" checked />
          <span class="aimp-checkbox-text">Use sound fading (Pause / Resume)</span>
        </label>
        <label class="aimp-checkbox-item">
          <input type="checkbox" id="aimp-check-fade-nav" checked />
          <span class="aimp-checkbox-text">Use sound fading on navigation within track</span>
        </label>
      </div>
    </div>

    <!-- Tab 2: Equalizer -->
    <div class="aimp-panel" id="aimp-panel-equalizer" role="tabpanel" aria-labelledby="aimp-tab-equalizer" hidden>
      <div class="aimp-subpanel-row">
        <label for="aimp-eq-preset">Preset:
          <select id="aimp-eq-preset" class="aimp-sub-select">
            <option value="Flat">Flat</option>
            <option value="Warm">Warm</option>
            <option value="Bass Boost">Bass Boost</option>
            <option value="Vocal">Vocal</option>
            <option value="Bright">Bright</option>
            <option value="Custom">Custom</option>
          </select>
        </label>
        <button type="button" class="aimp-btn-mini" id="aimp-eq-reset-btn">Reset</button>
      </div>
      <div class="aimp-eq-grid" id="aimp-eq-grid"></div>
    </div>

    <!-- Tab 3: Volume -->
    <div class="aimp-panel" id="aimp-panel-volume" role="tabpanel" aria-labelledby="aimp-tab-volume" hidden>
      <div class="aimp-subpanel-stack">
        <div class="aimp-sub-slider-item">
          <div class="aimp-sub-slider-header">
            <span>Preamp</span>
            <span id="aimp-preamp-val">0 dB</span>
          </div>
          <input type="range" class="aimp-slider" id="aimp-slider-preamp" min="-12" max="12" value="0" step="1" />
        </div>
        <div class="aimp-sub-slider-item">
          <div class="aimp-sub-slider-header">
            <span>Balance</span>
            <span id="aimp-balance-val">0 (Center)</span>
          </div>
          <input type="range" class="aimp-slider" id="aimp-slider-balance" min="-1" max="1" value="0" step="0.05" />
        </div>
        <label class="aimp-checkbox-item">
          <input type="checkbox" id="aimp-check-replaygain" checked />
          <span class="aimp-checkbox-text">Apply ReplayGain if available</span>
        </label>
      </div>
    </div>

    <!-- Tab 4: Mixing -->
    <div class="aimp-panel" id="aimp-panel-mixing" role="tabpanel" aria-labelledby="aimp-tab-mixing" hidden>
      <div class="aimp-subpanel-stack">
        <div class="aimp-sub-slider-item">
          <div class="aimp-sub-slider-header">
            <span>Crossfade</span>
            <span id="aimp-crossfade-val">0 s</span>
          </div>
          <input type="range" class="aimp-slider" id="aimp-slider-crossfade" min="0" max="12" value="0" step="1" />
        </div>
        <label class="aimp-checkbox-item">
          <input type="checkbox" id="aimp-check-gapless" checked />
          <span class="aimp-checkbox-text">Gapless playback / preload next track</span>
        </label>
      </div>
    </div>

    <!-- Tab 5: Remove Silence -->
    <div class="aimp-panel" id="aimp-panel-remove-silence" role="tabpanel" aria-labelledby="aimp-tab-remove-silence" hidden>
      <div class="aimp-subpanel-stack">
        <label class="aimp-checkbox-item">
          <input type="checkbox" id="aimp-check-skip-silence" />
          <span class="aimp-checkbox-text">Remove silence at head and tail of tracks</span>
        </label>
        <div class="aimp-sub-slider-item">
          <div class="aimp-sub-slider-header">
            <span>Silence Threshold</span>
            <span id="aimp-silence-thresh-val">-45 dB</span>
          </div>
          <input type="range" class="aimp-slider" id="aimp-slider-silence" min="-60" max="-30" value="-45" step="1" />
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Footer Bar -->
  <div class="aimp-footer">
    <button type="button" class="aimp-btn" id="aimp-reset-all">Reset to Defaults</button>
    <button type="button" class="aimp-btn" id="aimp-close-btn">Close</button>
  </div>
</dialog>

<div role="status" id="toast" class="toast" hidden></div>
<audio id="audio" preload="auto"></audio>
`;
