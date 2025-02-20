const fileInput = document.getElementById("fileInput")
const outputText = document.getElementById("outputText")
const encryptedText = document.getElementById("encryptedText")
const decryptedText = document.getElementById("decryptedText")
const secretKeyEncrypt = document.getElementById("secretKeyEncrypt")
const secretKeyDecrypt = document.getElementById("secretKeyDecrypt")

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        outputText.textContent = e.target.result;
    };
    reader.readAsText(file);
});

const codeToBytes = (text) => new TextEncoder().encode(text)

// Bu 32 bitlik kod hosil qiladi
function hashSecretKey(key) {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
        hash ^= key.charCodeAt(i)
        hash = (hash << 5) - hash
    }
    return (hash >>> 0).toString(16)
}

// Arifmetik amallar orqali shifrlash
const encryptText = (text, key) => {
    let encoder = new TextEncoder()
    let encodedText = encoder.encode(text)

    let encryptedText = encodedText.map((charCode, i) => (charCode + key[i % key.length]) % 256)

    return btoa(String.fromCharCode(...encryptedText))
}

const decryptText = (text, key) => {
    let encryptedText = atob(text).split('').map(char => char.charCodeAt(0))

    let decryptedText = encryptedText.map((charCode, i) => (charCode - key[i % key.length] + 256) % 256)

    let decoder = new TextDecoder()
    return decoder.decode(Uint8Array.from(decryptedText))
}

const encryptAction = () => {
    if (!secretKeyEncrypt.value) {
        alert("Maxfiy kalitni kiriting")
        return
    }
    if (!outputText.textContent) {
        alert("Matn topilmadi!")
        return
    }

    let secretKeyHex = hashSecretKey(secretKeyEncrypt.value)
    encryptedText.textContent = encryptText(outputText.textContent, codeToBytes(secretKeyHex))
}
const decryptAction = () => {
    if (!secretKeyDecrypt.value) {
        alert("Maxfiy kalitni kiriting")
        return
    }
    if (!encryptedText.textContent) {
        alert("Shifr topilmadi!")
        return
    }

    let secretKeyHex = hashSecretKey(secretKeyDecrypt.value)
    decryptedText.textContent = decryptText(encryptedText.textContent, codeToBytes(secretKeyHex))
}
