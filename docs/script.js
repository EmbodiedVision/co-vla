const tasks = {
  stack: { label: 'Stack', number: '01', instruction: 'Put the red cube on top of the blue cube.', rate: '97.5%' },
  pick: { label: 'Pick & place', number: '02', instruction: 'Pick up the cube and place it in the cup.', rate: '100%' },
  sort: { label: 'Sort', number: '03', instruction: 'Put the red cube in the right cup and the blue cube in the left cup.', rate: '100%' },
  fold: { label: 'Fold', number: '04', instruction: 'Fold the blue cloth two times in half.', rate: '100%' }
};

// Refresh cached videos and posters when their local copies are synchronized.
const mediaVersion = '4896f4333cbe';

function activateTab(button) {
  button.closest('[role="tablist"]').querySelectorAll('[role="tab"]').forEach(tab => {
    const active = tab === button;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.getElementById(button.getAttribute('aria-controls')).setAttribute('aria-labelledby', button.id);
}

// Standard tab keyboard interaction: arrows, Home, and End.
document.querySelectorAll('[role="tablist"]').forEach(list => {
  list.addEventListener('keydown', event => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[next].focus();
    tabs[next].click();
  });
});

let currentTask = 'stack';
const taskVideo = document.getElementById('task-video');
function updateVideo() {
  const task = tasks[currentTask];
  const round = document.getElementById('video-round').value;
  const filename = `${currentTask}-round${round}`;
  taskVideo.pause();
  taskVideo.poster = `assets/images/${filename}.jpg?v=${mediaVersion}`;
  taskVideo.querySelector('source').src = `assets/videos/${filename}.mp4?v=${mediaVersion}`;
  taskVideo.setAttribute('aria-label', `${task.label} comparison, round ${round}`);
  taskVideo.load();
  document.getElementById('task-kicker').textContent = `Task ${task.number} / ${task.label}`;
  document.getElementById('task-title').textContent = task.instruction;
  document.getElementById('task-rate').textContent = task.rate;
}
document.querySelectorAll('[data-task]').forEach(button => {
  button.addEventListener('click', () => {
    activateTab(button);
    currentTask = button.dataset.task;
    updateVideo();
  });
});
document.getElementById('video-round').addEventListener('change', updateVideo);

document.getElementById('copy-citation').addEventListener('click', async event => {
  const button = event.currentTarget;
  const code = document.getElementById('bibtex');
  try {
    await navigator.clipboard.writeText(code.textContent.trim());
    button.textContent = 'Copied ✓';
    document.getElementById('copy-status').textContent = 'BibTeX copied to clipboard.';
    setTimeout(() => { button.textContent = 'Copy BibTeX ⧉'; }, 2000);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.getElementById('copy-status').textContent = 'Citation selected. Press Control+C or Command+C to copy.';
    button.textContent = 'Selected · press Ctrl/Cmd+C';
  }
});
