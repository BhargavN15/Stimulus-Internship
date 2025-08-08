const chatMessagesContainer = document.getElementById("chatBox")
const userInputField = document.getElementById("userInput")
const toggleChatButton = document.getElementById("chatToggle")
const chatPopupContainer = document.getElementById("chatContainer")
const dotsTypingAnimation = document.getElementById("typingIndicator")
const sendMessageButton = document.getElementById("sendButton")

const suggestedQuickReplies = [
  "What is Stimulus?",
  "How do I register?",
  "Contact info",
  "What services do you offer?"
]

let conversationContext = null

toggleChatButton.addEventListener("click", () => {
  const chatIsOpen = chatPopupContainer.style.display === "flex"
  chatPopupContainer.style.display = chatIsOpen ? "none" : "flex"
})

sendMessageButton.addEventListener("click", handleSendMessage)

userInputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSendMessage()
  }
})

function handleSendMessage() {
  const userMessage = userInputField.value.trim()
  if (userMessage === "") return

  showMessageInChat(userMessage, "user")
  userInputField.value = ""
  dotsTypingAnimation.style.display = "flex"

  setTimeout(function () {
    generateBotResponse(userMessage)
    dotsTypingAnimation.style.display = "none"
  }, 1000)
}

function showMessageInChat(messageText, senderType) {
  const messageBubble = document.createElement("div")
  messageBubble.classList.add("message", senderType)
  messageBubble.innerHTML = messageText
  chatMessagesContainer.insertBefore(messageBubble, dotsTypingAnimation)
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
}

function generateBotResponse(userMessage) {
  const lowercaseMessage = userMessage.toLowerCase();
  let foundMatch = false;

  for (let responseItem of responseList) {
    const isMatch = responseItem.keywords.some(function (keyword) {
      return lowercaseMessage.includes(keyword);
    });

    if (isMatch) {
      showMessageInChat(responseItem.response, "bot");

      if (responseItem.followUpPrompt) {
        showMessageInChat(responseItem.followUpPrompt, "bot");
      }

      if (responseItem.keywords.includes("register")) {
        conversationContext = "register";
      } else if (responseItem.keywords.includes("stimulus")) {
        conversationContext = "stimulus";
      } else if (responseItem.keywords.includes("services")) {
        conversationContext = "services";
      } else if (responseItem.keywords.includes("contact")) {
        conversationContext = "contact";
      } else if (responseItem.keywords.includes("apply")) {
        conversationContext = "apply";
      } else if (responseItem.keywords.includes("location")) {
        conversationContext = "location";
      }

      foundMatch = true;
      break;
    }
  }

  if (!foundMatch) {
    if (conversationContext) {
      handleFollowUpResponse(userMessage);
    } else {
      showMessageInChat("Sorry, I don't understand that yet.", "bot");
    }
  }

  updateQuickReplyButtons();
}

function handleFollowUpResponse(userReply) {
  const reply = userReply.toLowerCase();

  if (reply.includes("yes") || reply.includes("yeah") || reply.includes("sure") || reply.includes("ok")) {
    if (conversationContext === "register") {
      showMessageInChat("Great! You can reach out via <a href='mailto:founder@stimulus.org.in'>founder@stimulus.org.in</a> or visit our <a href='https://stimulus.org.in/contact' target='_blank'>contact page</a>.", "bot");
    } else if (conversationContext === "stimulus") {
      showMessageInChat("Stimulus helps businesses grow through strategic guidance and practical advisory. Let me know if you'd like to get in touch.", "bot");
    } else if (conversationContext === "services") {
      showMessageInChat("Awesome! Feel free to reach us through <a href='mailto:founder@stimulus.org.in'>email</a> or check our <a href='https://stimulus.org.in/contact' target='_blank'>contact page</a>.", "bot");
    } else if (conversationContext === "contact") {
      showMessageInChat("Opening the <a href='https://stimulus.org.in/contact' target='_blank'>contact page</a> for you!", "bot");
      window.open("https://stimulus.org.in/contact", "_blank");
    } else if (conversationContext === "apply") {
      showMessageInChat("You can get started by sending us an email: <a href='mailto:founder@stimulus.org.in'>founder@stimulus.org.in</a>", "bot");
    } else if (conversationContext === "location") {
      showMessageInChat("Feel free to contact our team through email or visit our contact page to connect!", "bot");
    } else {
      showMessageInChat("Glad to hear it! Let me know if there’s anything else you need.", "bot");
    }
  } else if (reply.includes("no")) {
    showMessageInChat("No problem! I'm here if you need anything else.", "bot");
  } else {
    showMessageInChat("Got it. Could you tell me more about what you're looking for?", "bot");
  }

  conversationContext = null;
}


function updateQuickReplyButtons() {
  const quickReplySection = document.querySelector(".quickReplies")
  quickReplySection.innerHTML = ""

  for (let i = 0; i < suggestedQuickReplies.length; i++) {
    const suggestionText = suggestedQuickReplies[i]
    const replyButton = document.createElement("button")
    replyButton.classList.add("quickButton")
    replyButton.textContent = suggestionText
    replyButton.addEventListener("click", function () {
      userInputField.value = suggestionText
      handleSendMessage()
    })
    quickReplySection.appendChild(replyButton)
  }
}

updateQuickReplyButtons()
