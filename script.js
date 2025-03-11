document.getElementById('send-btn').addEventListener('click', function() {
            sendMessage();
        });

        document.getElementById('user-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function sendMessage() {
            const userInput = document.getElementById('user-input').value;
            if (userInput.trim() === "") return;

            addMessageToChatBox('user', userInput);
            document.getElementById('user-input').value = '';

            const thinkingText = document.getElementById('thinking-text');
            thinkingText.style.display = 'block';

            fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userInput })
            })
            .then(response => response.json())
            .then(data => {
                thinkingText.style.display = 'none';
                typeMessage('bot', data.reply);
            })
            .catch(error => {
                console.error("Error:", error);
                thinkingText.style.display = 'none';
                addMessageToChatBox('bot', 'Sorry, something went wrong. Please try again.');
            });
        }

        function addMessageToChatBox(sender, message) {
            const chatBox = document.getElementById('chat-box');
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', sender);
            messageElement.innerHTML = message;
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function typeMessage(sender, message) {
            const chatBox = document.getElementById('chat-box');
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', sender);
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;

            let index = 0;
            const typingSpeed = 20;
            let isTyping = true;

            const stopButton = document.createElement('button');
            stopButton.textContent = 'Stop';
            stopButton.classList.add('stop-button');
            stopButton.addEventListener('click', () => {
                isTyping = false;
                stopButton.remove();
            });
            chatBox.appendChild(stopButton);

            function type() {
                if (index < message.length && isTyping) {
                    if (message.charAt(index) === '\n') {
                        messageElement.innerHTML += '<br>';
                    } else {
                        messageElement.textContent += message.charAt(index);
                    }
                    index++;
                    chatBox.scrollTop = chatBox.scrollHeight;
                    setTimeout(type, typingSpeed);
                } else {
                    if (stopButton) stopButton.remove();
                }
            }

            type();
        }