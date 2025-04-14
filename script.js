// Anxiety Quiz Questions
const questions = [
    "I feel nervous before exams.",
    "I have trouble sleeping before important days.",
    "I often feel overwhelmed with studies.",
    "I can't focus easily when studying.",
    "I procrastinate because of fear of failure.",
    "I feel physical symptoms like sweating, shaking before exams.",
    "I doubt my preparation even if I studied well.",
    "I feel better after talking to someone about my stress.",
    "I have a hard time relaxing before an exam.",
    "I imagine worst-case scenarios before exams."
  ];
  
  // Initialize Tabs and Quiz
  document.addEventListener('DOMContentLoaded', function() {
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
  
    // Initialize tabs
    initTabs();
  
    // Initialize chatbot
    initChatbot();
  });
  
  // Tab Switching
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
  
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
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
        <p>It's okay to feel stressed. Focus on <strong>Progressive Muscle Relaxation (PMR)</strong> daily to reduce tension.</p>
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
      speak(current.text); // Speak the step
  
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
  
  // Function to speak text
  function speak(text) {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Calm and slow
      utterance.pitch = 1.5; // Higher pitch → more feminine
      utterance.lang = 'en-US';
  
      function setVoice() {
        const voices = synth.getVoices();
        const voiceSelect = document.getElementById('voice-select');
        const selectedVoice = voiceSelect ? voiceSelect.value : 'feminine';
        
        let targetVoice;
        if (selectedVoice === 'male') {
          targetVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('daniel') || 
            voice.name.toLowerCase().includes('david')
          );
        } else {
          targetVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('samantha') || 
            voice.name.toLowerCase().includes('zira') || 
            voice.name.toLowerCase().includes('google us english')
          );
        }
        
        if (targetVoice) {
          utterance.voice = targetVoice;
        }
        synth.speak(utterance);
      }
  
      if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = setVoice;
      } else {
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
  
  // Chatbot functionality
  function initChatbot() {
    const chatButton = document.getElementById('chat-button');
    const chatWidget = document.getElementById('chat-widget');
    const minimizeChat = document.getElementById('minimize-chat');
    const sendMessage = document.getElementById('send-message');
    const userMessageInput = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');
  
    // Toggle chat widget visibility
    chatButton.addEventListener('click', function() {
      chatWidget.style.display = 'flex';
      chatButton.style.display = 'none';
    });
  
    // Minimize chat widget
    minimizeChat.addEventListener('click', function() {
      chatWidget.style.display = 'none';
      chatButton.style.display = 'flex';
    });
  
    // Send message function
    function sendUserMessage() {
      const message = userMessageInput.value.trim();
      if (message !== '') {
        // Add user message to chat
        addMessage(message, 'user');
        userMessageInput.value = '';
        
        // Get bot response from Gemini API
        getBotResponse(message).then(botResponse => {
          addMessage(botResponse, 'bot');
        }).catch(error => {
          addMessage("Sorry, I couldn't process that. Try again!", 'bot');
        });
  
        // Add points for interaction
        addPoints(1);
      }
    }
  
    // Send message on button click
    sendMessage.addEventListener('click', sendUserMessage);
  
    // Send message on Enter key
    userMessageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendUserMessage();
      }
    });
  
    // Add a message to the chat
    function addMessage(message, sender) {
      const messageElement = document.createElement('div');
      messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
  
  // Gemini API integration
  async function getBotResponse(message) {
    const apiKey = 'AIzaSyBvHsgoW9YGEIGMfnOfyrUnt16w2jaHftU'; // Replace with your Gemini API key (secure in production)
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
    // Define the system prompt to customize the bot's behavior
    const systemPrompt = `
      You are an Anxiety Support Bot designed to help students manage exam-related stress. 
      Provide empathetic, concise, and practical responses. 
      Offer suggestions like breathing exercises, study tips, or positive encouragement. 
      Avoid complex jargon and keep the tone warm and supportive. 
      If the user expresses negative feelings, acknowledge them gently and suggest a specific action from the website (e.g., breathing exercise, mood tracker, or joke section).
    `;
  
    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `User: ${message}` }
              ]
            }
          ]
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch response from Gemini API');
      }
  
      const data = await response.json();
      const botResponse = data.candidates[0].content.parts[0].text.trim();
      return botResponse;
  
    } catch (error) {
      console.error('Error with Gemini API:', error);
      return 'Oops, something went wrong. How about trying our breathing exercise to relax?';
    }
  }
