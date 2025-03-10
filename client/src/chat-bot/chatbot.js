document.addEventListener('DOMContentLoaded',function () {
    const chatbotcontainer = document.getElementById('chatbot-container');
    const chatbotclose = document.getElementById('chatbot-close');
    const chatbotinput = document.getElementById('chatbot-inputs');
    const chatbotsend = document.getElementById('chatbot-send');
    const chatbotmessages = document.getElementById('chatbot-messages');

    chatbotclose.addEventListener('click', function () {
        alert('Chatbot Closed by the js');
    });
} );