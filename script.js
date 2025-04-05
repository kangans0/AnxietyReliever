// Anxiety Quiz Questions
const questions = [
    "I feel nervous before exams.",
    "I have trouble sleeping before important days.",
    "I often feel overwhelmed with studies.",
    "I can’t focus easily when studying.",
    "I procrastinate because of fear of failure.",
    "I feel physical symptoms like sweating, shaking before exams.",
    "I doubt my preparation even if I studied well.",
    "I feel better after talking to someone about my stress.",
    "I have a hard time relaxing before an exam.",
    "I imagine worst-case scenarios before exams."
  ];
  
  // Display Quiz
  const quizContainer = document.getElementById('quiz-questions');
  questions.forEach((q, index) => {
    const questionBlock = document.createElement('div');
    questionBlock.innerHTML = `
      <p><strong>Q${index + 1}:</strong> ${q}</p>
      <label><input type="radio" name="q${index}" value="0" required> Never</label>
      <label><input type="radio" name="q${index}" value="1"> Sometimes</label>
      <label><input type="radio" name="q${index}" value="2"> Often</label>
      <label><input type="radio" name="q${index}" value="3"> Always</label>
      <hr>
    `;
    quizContainer.appendChild(questionBlock);
  });
  
  // Handle Quiz Submission
  document.getElementById('quiz-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const answer = document.querySelector(`input[name="q${i}"]:checked`);
      if (answer) {
        score += parseInt(answer.value);
      }
    }
    const maxScore = questions.length * 3;
    const percentage = (score / maxScore) * 100;
    let message = "";
    if (percentage <= 30) {
      message = `
        <h3>😌 Low Anxiety</h3>
        <p>You're managing well! Keep doing breathing exercises like the <strong>4-7-8 technique</strong> daily before sleep.</p>
        <p><strong>Tip:</strong> Light meditation and short walks are great for you!</p>
      `;
    } else if (percentage <= 70) {
      message = `
        <h3>😟 Medium Anxiety</h3>
        <p>You're doing okay but could use support. Try <strong>Box Breathing</strong> (inhale 4s, hold 4s, exhale 4s, hold 4s).</p>
        <p><strong>Tip:</strong> Add 10-minute guided meditation to your daily routine!</p>
      `;
    } else {
      message = `
        <h3>😰 High Anxiety</h3>
        <p>It’s okay to feel stressed. Focus on <strong>Progressive Muscle Relaxation (PMR)</strong> daily to reduce tension.</p>
        <p><strong>Tip:</strong> Consider talking to a counselor if needed. Journaling your feelings every night helps!</p>
      `;
    }
    document.getElementById('quiz-result').innerHTML = `
      <div style="background: #e1bee7; padding: 20px; border-radius: 15px;">
        <h2>Your Score: ${score} / ${maxScore}</h2>
        ${message}
      </div>
    `;
    addPoints(10); // Bonus points for quiz
  });
  
  // Breathing Exercise
  // Breathing Exercise
let breathingPaused = false;
let breathingTimeout;
let breathingIndex = 0;

function startBreathing() {
  const guide = document.getElementById('breathing-guide');
  guide.textContent = "Get ready...";
  
  const steps = [
    { text: "Breathe in", duration: 4000 },
    { text: "Hold", duration: 4500 },
    { text: "Breathe out", duration: 4000 },
    { text: "Hold", duration: 4500 }
  ];
  
  breathingIndex = 0;

  function nextStep() {
    if (breathingPaused) return; // Pause if needed

    const current = steps[breathingIndex];
    guide.textContent = current.text;
    speak(current.text); // 🔥 Speak the step

    breathingTimeout = setTimeout(() => {
      breathingIndex = (breathingIndex + 1) % steps.length;
      nextStep();
    }, current.duration);
  }

  nextStep();
}

function pauseBreathing() {
  breathingPaused = true;
  clearTimeout(breathingTimeout);
}

function resumeBreathing() {
  if (breathingPaused) {
    breathingPaused = false;
    startBreathing();
  }
}

// 🔊 Function to speak text
// 🔊 Function to speak text with a feminine voice
// 🔊 Updated function to speak text with different voices
// 🔊 Function to speak text with a feminine voice
function speak(text) {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Calm and slow
      utterance.pitch = 1.5; // Higher pitch → more feminine
      utterance.lang = 'en-US';
  
      function setVoice() {
        const voices = synth.getVoices();
        // Try to find a female-like voice
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha') || 
          voice.name.toLowerCase().includes('zira') || 
          voice.name.toLowerCase().includes('google us english')
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        synth.speak(utterance);
      }
  
      if (synth.getVoices().length === 0) {
        // Voices not loaded yet
        synth.onvoiceschanged = setVoice;
      } else {
        // Voices already available
        setVoice();
      }
    }
  }
  
  
  
  
  
  // Get Joke from API
  function getJoke() {
    fetch('https://v2.jokeapi.dev/joke/Any?type=single')
      .then(response => response.json())
      .then(data => {
        document.getElementById('joke-text').textContent = data.joke;
        addPoints(2);
      })
      .catch(error => {
        document.getElementById('joke-text').textContent = "Couldn't fetch a joke, try again!";
      });
  }
  
  // Mood Tracker
  function logMood() {
    const mood = document.getElementById('mood-select').value;
    if (mood !== '') {
      const li = document.createElement('li');
      li.textContent = `${new Date().toLocaleDateString()}: ${mood}`;
      document.getElementById('mood-list').appendChild(li);
      document.getElementById('mood-select').value = ''; // Reset dropdown
      addPoints(3);
    } else {
      alert('Please select a mood before logging!');
    }
  }
  
  // Timer
  let timerDuration = 25 * 60; // default 25 minutes
  let timerInterval;
  let timeLeft = timerDuration;
  let isPaused = false;
  
  function setCustomTimer() {
    const inputMinutes = document.getElementById('timer-minutes').value;
    if (inputMinutes && inputMinutes > 0) {
      timerDuration = inputMinutes * 60;
      timeLeft = timerDuration;
      updateTimerDisplay(timeLeft);
      hideCongrats();
    }
  }
  
  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer-display').textContent = 
      `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
  
  function startTimer() {
    clearInterval(timerInterval); // prevent multiple timers
    isPaused = false;
    timerInterval = setInterval(() => {
      if (!isPaused) {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          showCongrats();
        }
      }
    }, 1000);
  }
  
  function pauseTimer() {
    isPaused = !isPaused; // toggle pause/resume
  }
  
  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = timerDuration;
    updateTimerDisplay(timeLeft);
    hideCongrats();
  }
  
  function showCongrats() {
    document.getElementById('congrats-message').style.display = 'block';
    document.getElementById('congrats-sound').play();
  }
  
  function hideCongrats() {
    document.getElementById('congrats-message').style.display = 'none';
  }
  
  
  // Gamification Points
  let points = 0;
  function addPoints(p) {
    points += p;
    document.getElementById('points').textContent = points;
  }
  