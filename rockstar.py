import re

def add_rockstar_features():
    with open('index (2).html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add CSS
    css_additions = """
  /* Concert Lights */
  .concert-lights {
    position: fixed;
    top: -10vh; left: 0; right: 0;
    height: 120vh;
    pointer-events: none;
    z-index: 2;
    overflow: hidden;
    opacity: 0.7;
    mix-blend-mode: screen;
  }
  .light-beam {
    position: absolute;
    top: -20vh;
    width: 200vw;
    height: 150vh;
    transform-origin: top center;
  }
  .beam-left {
    left: -50vw;
    background: radial-gradient(ellipse at top center, rgba(100, 150, 255, 0.45) 0%, transparent 60%);
    animation: scanLeft 8s ease-in-out infinite alternate;
  }
  .beam-right {
    right: -50vw;
    background: radial-gradient(ellipse at top center, rgba(255, 100, 150, 0.45) 0%, transparent 60%);
    animation: scanRight 10s ease-in-out infinite alternate;
  }
  @keyframes scanLeft {
    0% { transform: rotate(-35deg); }
    100% { transform: rotate(15deg); }
  }
  @keyframes scanRight {
    0% { transform: rotate(35deg); }
    100% { transform: rotate(-15deg); }
  }

  /* Interaction Buttons */
  .action-btn {
    background: rgba(40, 40, 40, 0.6);
    backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: 50%;
    width: 60px; height: 60px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 24px; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .action-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(255,255,255,0.4);
  }
  .action-btn:active {
    transform: scale(0.95);
  }
"""
    content = content.replace('</style>', css_additions + '\n</style>')

    # 2. Add Lights HTML right after <body>
    lights_html = """
  <div class="concert-lights">
    <div class="light-beam beam-left"></div>
    <div class="light-beam beam-right"></div>
  </div>"""
    content = re.sub(r'(<body.*?>)', r'\1' + lights_html, content)

    # 3. Add Buttons into .bottom-right
    buttons_html = """
      <button class="action-btn" id="clap-btn" aria-label="Clap" title="Clapping Sound">👏</button>
      <button class="action-btn" id="dialogue-btn" aria-label="Dialogue" title="Play Famous Dialogue">🎤</button>
    """
    content = content.replace('<div class="bottom-right"></div>', f'<div class="bottom-right">\n{buttons_html}\n    </div>')

    # 4. Add JavaScript
    js_additions = """
    // --- Rockstar Features ---
    var clapAudio = new Audio('https://actions.google.com/sounds/v1/crowds/small_crowd_applause.ogg');
    var dialogues = [
      'https://actions.google.com/sounds/v1/human_voices/human_voice_clip_1.ogg', // PLACEHOLDER 1
      'https://actions.google.com/sounds/v1/human_voices/human_voice_clip_2.ogg', // PLACEHOLDER 2
      'https://actions.google.com/sounds/v1/human_voices/human_voice_clip_3.ogg'  // PLACEHOLDER 3
    ];
    var currentDialogueIndex = 0;
    var dialogueAudio = new Audio();

    document.getElementById('clap-btn').addEventListener('click', function() {
      clapAudio.currentTime = 0;
      clapAudio.play();
    });

    document.getElementById('dialogue-btn').addEventListener('click', function() {
      if (!dialogueAudio.paused) {
        dialogueAudio.pause();
      }
      dialogueAudio.src = dialogues[currentDialogueIndex];
      dialogueAudio.play();
      currentDialogueIndex = (currentDialogueIndex + 1) % dialogues.length;
    });
"""
    content = content.replace('</script>', js_additions + '\n  </script>')

    with open('index (2).html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    add_rockstar_features()
