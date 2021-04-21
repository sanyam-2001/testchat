window.onbeforeunload = function () {
    return "";
}
const urlParams = new URLSearchParams(window.location.search);
const Pusername = urlParams.get('username');
const Proom = urlParams.get('room');
document.getElementById('roomname').innerText = Proom;
if (localStorage.getItem(Proom) === null) {
    localStorage.setItem(Proom, "");
}
else {
    document.querySelector('.message-box').innerHTML += localStorage.getItem(Proom)
}
function updateLocalStorage(str) {
    let curr = localStorage.getItem(Proom)
    curr += str;
    localStorage.setItem(Proom, curr);
}


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


const socket = io();
//Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        document.getElementById('messageBtn').click()
    }
})
document.getElementById('messageBtn').addEventListener('click', () => {
    const date = new Date(Date.now());
    const dt = date.getDate();
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const month = date.getMonth()
    const val = document.getElementById('value');
    val.classList.remove('invalid');
    val.classList.add('valid');
    if (val.value === "") {
        val.classList.add('invalid');
    }
    else {
        socket.emit('sendMessage', { type: 'text', username: Pusername, timestamp: Date.now(), txt: val.value, room: Proom });
        const htm =
            `
        <div style="display: flex;justify-content:flex-end">
            <div class="message">
                <div class="username">
                    You <span style="color: rgb(209, 209, 209);"> <br>[${dayNames[day]}-${monthNames[month]} ${dt}-${hours}:${minutes}]</span>
                </div>
                <hr>
                <div class="txt">${val.value}</div>
            </div>
        </div>
        `
        updateLocalStorage(htm);
        document.querySelector('.message-box').innerHTML += htm;
        document.querySelector('.message-box').scrollTop = document.querySelector('.message-box').scrollHeight;
        val.value = ""

    }
})

socket.on('connect', () => {
    socket.emit('handshake', { username: Pusername, room: Proom });
})

socket.on('message', (message) => {
    const date = new Date(message.timestamp);
    const dt = date.getDate();
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const month = date.getMonth()

    if (message.type === 'join') {
        const htm =
            `
        <div class="notice">
            <div class="noticemsg">${message.username} Has Joined the Chat <br> [${dayNames[day]}-${monthNames[month]} ${dt}-${hours}:${minutes}]</div>
        </div>
        `

        document.querySelector('.message-box').innerHTML += htm;
    }
    if (message.type === 'text') {
        const htm =
            `
        <div style="display: flex;">
            <div class="message">
                <div class="username">
                    ${message.username} <span style="color: rgb(209, 209, 209);"> <br>[${dayNames[day]}-${monthNames[month]} ${dt}-${hours}:${minutes}]</span>
                </div>
                <hr>
                <div class="txt">${message.txt}</div>
            </div>
        </div>
        `
        updateLocalStorage(htm);
        document.querySelector('.message-box').innerHTML += htm;

    }
    if (message.type === 'img') {
        const htm =
            `
                <div style="display: flex;">
            <div class="message">
                <div class="username">
                    ${message.username}
                </div>
                <hr>
                <img src="${message.src}" style="width:100%">
            </div>
        </div>

                `
        updateLocalStorage(htm);
        document.querySelector('.message-box').innerHTML += htm;
    }
    document.querySelector('.message-box').scrollTop = document.querySelector('.message-box').scrollHeight;

})


document.getElementById('sendimg').addEventListener('change', (e) => {
    if (e.target.files.length !== 0) {
        var reader = new FileReader();
        reader.onloadend = function () {
            console.log(reader.result)
            const htm =
                `
                <div style="display: flex; justify-content:flex-end">
            <div class="message">
                <div class="username">
                    ${Pusername}
                </div>
                <hr>
                <img src="${reader.result}" style="width:100%">
            </div>
        </div>

                `
            socket.emit('sendImg', { type: "img", username: Pusername, room: Proom, src: reader.result });
            updateLocalStorage(htm);
            document.querySelector('.message-box').innerHTML += htm;
            document.getElementById("sendimg").value = "";

        }
        reader.readAsDataURL(e.target.files[0]);
    }
})
