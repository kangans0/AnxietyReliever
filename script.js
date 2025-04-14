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

// Gamification Points
let points = 0;

function addPoints(amount) {
    points += amount;
    console.log(`Points: ${points}`);
}

// Initialize Tabs, Quiz, Chart Library, and Widgets
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

    // Initialize Chart.js for mood tracker
    loadChartJSLibrary();

    // Initialize meditation widget
    initMeditationWidget();
});

// Load Chart.js dynamically
function loadChartJSLibrary() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => console.log('Chart.js loaded');
    document.head.appendChild(script);
}

// Tab Switching
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
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
            <p><strong>Tip:</strong> Open the meditation widget for a calming session!</p>
        `;
    } else {
        message = `
            <h3>😰 High Anxiety</h3>
            <p>It's okay to feel stressed. Focus on <strong>Progressive Muscle Relaxation (PMR)</strong> daily to reduce tension.</p>
            <p><strong>Tip:</strong> Try the meditation widget to relax your mind!</p>
        `;
    }
    document.getElementById('quiz-result').innerHTML = `
        <div style="background: #A8E6CF; padding: 20px; border-radius: 15px;">
            <h2>Your Score: ${score} / ${maxScore}</h2>
            ${message}
        </div>
    `;
    addPoints(10);
});

// Breathing Exercise with Animation
let breathingPaused = false;
let breathingTimeout;
let breathingIndex = 0;

function startBreathing() {
    const guide = document.getElementById('breathing-guide');
    const circle = document.getElementById('breathing-circle');
    guide.textContent = "Get ready...";
    circle.classList.add('animate');

    const steps = [
        { text: "Breathe in", duration: 4000 },
        { text: "Hold", duration: 4500 },
        { text: "Breathe out", duration: 4000 },
        { text: "Hold", duration: 4500 }
    ];

    breathingIndex = 0;

    function nextStep() {
        if (breathingPaused) return;

        const current = steps[breathingIndex];
        guide.textContent = current.text;
        speak(current.text);

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
    document.getElementById('breathing-circle').classList.remove('animate');
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
        utterance.rate = 0.9;
        utterance.pitch = 1.5;
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

// Get Joke with Animation
function getJoke() {
    const jokeText = document.getElementById('joke-text');
    jokeText.classList.remove('fade-in');
    jokeText.classList.add('fade-out');
    setTimeout(() => {
        fetch('https://v2.jokeapi.dev/joke/Any?type=single')
            .then(response => response.json())
            .then(data => {
                jokeText.textContent = data.joke;
                jokeText.classList.remove('fade-out');
                jokeText.classList.add('fade-in');
                addPoints(2);
            })
            .catch(error => {
                jokeText.textContent = "Couldn't fetch a joke, try again!";
                jokeText.classList.remove('fade-out');
                jokeText.classList.add('fade-in');
            });
    }, 500);
}

// Mood Tracker with Chart
let moodData = JSON.parse(localStorage.getItem('moodData')) || [];

function logMood() {
    const mood = document.getElementById('mood-select').value;
    if (mood !== '') {
        const li = document.createElement('li');
        const timestamp = new Date().toLocaleDateString();
        li.textContent = `${timestamp}: ${mood}`;
        document.getElementById('mood-list').appendChild(li);
        moodData.push({ mood, timestamp });
        localStorage.setItem('moodData', JSON.stringify(moodData));
        document.getElementById('mood-select').value = '';
        addPoints(3);
    } else {
        alert('Please select a mood before logging!');
    }
}

function showMoodChart() {
    const canvas = document.getElementById('mood-chart');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');

    const moodCounts = {};
    moodData.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(moodCounts),
            datasets: [{
                data: Object.values(moodCounts),
                backgroundColor: ['#A8E6CF', '#DCE2AA', '#FFCCBC', '#FFAB91', '#F28C82', '#E6EE9C']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Timer with Progress Circle
let timerDuration = 25 * 60;
let timerInterval;
let timeLeft = timerDuration;
let isPaused = false;

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function setCustomTimer() {
    const inputMinutes = document.getElementById('timer-minutes').value;
    if (inputMinutes && inputMinutes > 0) {
        timerDuration = inputMinutes * 60;
        timeLeft = timerDuration;
        updateTimerDisplay(timeLeft);
        setProgress(100);
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
    clearInterval(timerInterval);
    isPaused = false;
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            const percent = (timeLeft / timerDuration) * 100;
            setProgress(percent);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showCongrats();
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = !isPaused;
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = timerDuration;
    updateTimerDisplay(timeLeft);
    setProgress(100);
    hideCongrats();
}

function showCongrats() {
    document.getElementById('congrats-message').style.display = 'block';
    document.getElementById('congrats-sound').play();
}

function hideCongrats() {
    document.getElementById('congrats-message').style.display = 'none';
}

// Motivational Quotes
const quotes = [
    "You are capable of amazing things!",
    "One step at a time, you've got this!",
    "Breathe deeply, and let the stress melt away.",
    "Your hard work will pay off, keep going!",
    "Believe in yourself, you're stronger than you think."
];

function showMotivationalQuote() {
    const quoteText = document.getElementById('motivational-quote');
    quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('quote-modal').style.display = 'none';
}

// Meditation Widget
let currentMeditation = null;
let meditationInterval = null;

function initMeditationWidget() {
    const meditationButton = document.getElementById('meditation-button');
    const meditationWidget = document.getElementById('meditation-widget');
    const minimizeMeditation = document.getElementById('minimize-meditation');
    const meditationSelect = document.getElementById('meditation-select');

    meditationButton.addEventListener('click', function() {
        meditationWidget.style.display = 'flex';
        meditationButton.style.display = 'none';
        meditationWidget.classList.add('active');
    });

    minimizeMeditation.addEventListener('click', function() {
        meditationWidget.style.display = 'none';
        meditationButton.style.display = 'flex';
        meditationWidget.classList.remove('active');
        stopMeditation(); // Stop playback when minimizing
    });

    meditationSelect.addEventListener('change', () => {
        stopMeditation();
    });
}

function playMeditation() {
    const meditationSelect = document.getElementById('meditation-select').value;
    const player = document.getElementById('meditation-content');
    if (!meditationSelect) {
        alert('Please select a meditation!');
        return;
    }

    if (!currentMeditation) {
        currentMeditation = new Audio();
        const meditationTracks = {
            'mindfulness-5min': 'https://cdn.pixabay.com/audio/2023/01/06/audio_4e56d23d21.mp3',
            'relaxation-10min': 'https://cdn.pixabay.com/audio/2022/03/15/audio_2b7e0bcfa9.mp3'
        };
        currentMeditation.src = meditationTracks[meditationSelect];
        currentMeditation.addEventListener('ended', () => {
            stopMeditation();
            addPoints(5);
            showMessage('Great job completing your meditation! 🎉');
        });
    }

    currentMeditation.play();
    player.classList.add('playing');
    updateMeditationProgress();
}

function pauseMeditation() {
    if (currentMeditation) {
        currentMeditation.pause();
        document.getElementById('meditation-content').classList.remove('playing');
        clearInterval(meditationInterval);
    }
}

function stopMeditation() {
    if (currentMeditation) {
        currentMeditation.pause();
        currentMeditation.currentTime = 0;
        document.getElementById('meditation-content').classList.remove('playing');
        clearInterval(meditationInterval);
        updateMeditationProgress(true);
    }
}

function updateMeditationProgress(reset = false) {
    const progress = document.getElementById('meditation-progress');
    const timeDisplay = document.getElementById('meditation-time');

    if (reset) {
        progress.value = 0;
        timeDisplay.textContent = '0:00 / 0:00';
        return;
    }

    clearInterval(meditationInterval);
    meditationInterval = setInterval(() => {
        if (currentMeditation && !currentMeditation.paused) {
            const current = currentMeditation.currentTime;
            const duration = currentMeditation.duration || 300;
            const percent = (current / duration) * 100;
            progress.value = percent;

            const currentMin = Math.floor(current / 60);
            const currentSec = Math.floor(current % 60);
            const durationMin = Math.floor(duration / 60);
            const durationSec = Math.floor(duration % 60);
            timeDisplay.textContent = `${currentMin}:${String(currentSec).padStart(2, '0')} / ${durationMin}:${String(durationSec).padStart(2, '0')}`;
        }
    }, 1000);
}

// Function to display the message
function showMessage(msg) {
    const motivationDiv = document.getElementById('motivation-message');
    motivationDiv.textContent = msg;
    motivationDiv.style.display = 'block';
    setTimeout(() => {
        motivationDiv.style.display = 'none';
    }, 3000);
}

// Chatbot functionality
function initChatbot() {
    const chatButton = document.getElementById('chat-button');
    const chatWidget = document.getElementById('chat-widget');
    const minimizeChat = document.getElementById('minimize-chat');
    const sendMessage = document.getElementById('send-message');
    const userMessageInput = document.getElementById('user-message');
    const chatMessages = document.getElementById('chat-messages');

    chatButton.addEventListener('click', function() {
        chatWidget.style.display = 'flex';
        chatButton.style.display = 'none';
        chatWidget.classList.add('active');
    });

    minimizeChat.addEventListener('click', function() {
        chatWidget.style.display = 'none';
        chatButton.style.display = 'flex';
        chatWidget.classList.remove('active');
    });

    function sendUserMessage() {
        const message = userMessageInput.value.trim();
        if (message !== '') {
            addMessage(message, 'user');
            userMessageInput.value = '';
            getBotResponse(message).then(botResponse => {
                addMessage(botResponse, 'bot');
            }).catch(error => {
                addMessage("Sorry, I couldn't process that. Try again!", 'bot');
            });
            addPoints(1);
        }
    }

    sendMessage.addEventListener('click', sendUserMessage);

    userMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Gemini API integration
async function getBotResponse(message) {
    const apiKey = 'AIzaSyBvHsgoW9YGEIGMfnOfyrUnt16w2jaHftU'; // Replace with your Gemini API key
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    const systemPrompt = `
        You are an Anxiety Support Bot designed to help students manage exam-related stress. 
        Provide empathetic, concise, and practical responses. 
        Offer suggestions like opening the meditation widget, breathing exercises, study tips, or positive encouragement. 
        Avoid complex jargon and keep the tone warm and supportive. 
        If the user expresses negative feelings, acknowledge them gently and suggest a specific action from the website (e.g., meditation widget, breathing exercise, mood tracker, or joke section).
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
        return 'Oops, something went wrong. How about opening the meditation widget to relax?';
    }
}
