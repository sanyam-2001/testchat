const server = io();
const urlParams = new URLSearchParams(window.location.search);

server.on('reqUsername', (req) => {
    server.emit('username', urlParams.get('username'))
})

server.on('newUser', user => {
    const htm = `
    <div class="notice my-2">
        <h6 class="text-center">${user} has Joined the Chat</h6>
    </div>`
    document.getElementById('msg-container').innerHTML += htm
})

document.getElementById('msgBtn').addEventListener('click', () => {
    const text = document.getElementById('val').value;
    const htm = `
    <div class="message my-2 p-2 text-right">
        <div class="user h6">${urlParams.get('username')}</div>
        <div class="txt">${text}</div>
    </div>`
    server.emit('message', JSON.stringify({ user: urlParams.get('username'), text: text }))
    document.getElementById('msg-container').innerHTML += htm
    document.getElementById('msg-container').scrollTop = document.getElementById('msg-container').scrollHeight;
    document.getElementById('val').value = ""



})


server.on('newMessage', msg => {
    const pmsg = JSON.parse(msg)
    const htm = `
    <div class="message my-2 p-2">
        <div class="user h6">${pmsg.user}</div>
        <div class="txt">${pmsg.text}</div>
    </div>`
    document.getElementById('msg-container').innerHTML += htm
    document.getElementById('msg-container').scrollTop = document.getElementById('msg-container').scrollHeight


})

