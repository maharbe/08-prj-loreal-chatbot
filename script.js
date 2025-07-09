/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Store chat history for context
let messages = [
  {
    role: "system",
    content:
      "You are a helpful and friendly assistant for L’Oréal. Only answer questions about L’Oréal products, beauty routines, product recommendations, or beauty-related topics. If a question is not about these, politely reply: 'I'm sorry, I can only help with L’Oréal products, beauty routines, and related beauty advice.' Do not answer unrelated questions.",
  },
  {
    role: "assistant",
    content: "👋 Hello! How can I help you today?",
  },
];

// Show initial message
chatWindow.innerHTML = `<div class="msg ai">${messages[1].content}</div>`;

// Helper: Add message to chat window
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `msg ${sender}`;
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  // Show user message
  addMessage(userText, "user");
  messages.push({ role: "user", content: userText });
  userInput.value = "";

  // Show loading message
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "msg ai";
  loadingMsg.textContent = "Thinking...";
  chatWindow.appendChild(loadingMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Send request to your Cloudflare Worker endpoint
    const response = await fetch(
      "https://lorealchatbot-worker.waltersebraham.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }
    );
    const data = await response.json();
    // Get the assistant's reply
    const aiReply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't get a response.";
    messages.push({ role: "assistant", content: aiReply });
    loadingMsg.remove();
    addMessage(aiReply, "ai");
  } catch (err) {
    loadingMsg.remove();
    addMessage("Sorry, there was a problem connecting to the assistant.", "ai");
  }
});
