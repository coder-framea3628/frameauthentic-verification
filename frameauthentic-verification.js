// ===== Injetar CSS =====
const style = document.createElement('style');
style.textContent = `
#popup-overlay { /* igual ao seu */ }
#popup-box { /* igual ao seu */ }

#camera-container {
    position: relative;
    width: 100%;
    max-width: 320px;
    margin: 0 auto 16px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    border-radius: 12px;
}
#cameraPreview {
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 12px;
    border: 3px solid rgba(172, 134, 92, 0.4);
    background: #000;
    object-fit: cover;
    transform: scaleX(-1);
}
#scanner {
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to bottom, rgba(172,134,92,0.2), rgba(172,134,92,0.6), rgba(172,134,92,0.2));
    animation: scan 3s linear infinite;
    pointer-events: none;
    display: none;
}
@keyframes scan {
    0% { top: -40%; }
    100% { top: 100%; }
}

#face-overlay {
    border: 4px solid rgba(172, 134, 92, 0.8);
    border-radius: 50%;
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
    100% { transform: translate(-50%, -50%) scale(1); }
}

#logoMarca {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    opacity: 0.7;
    filter: drop-shadow(0 0 6px rgba(172,134,92,0.4));
}

/* Shake no erro */
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
}
.shake { animation: shake 0.4s; }
`;
document.head.appendChild(style);

// ===== Injetar HTML =====
const popupHTML = `
<div id="popup-overlay">
    <div id="popup-box">
        <h2>Frame Authentic</h2>
        <div id="camera-container">
            <video id="cameraPreview" autoplay playsinline muted></video>
            <div id="scanner"></div>
            <div id="face-overlay"></div>
            <div id="loadingCircle"></div>
            <div id="centralizar-overlay">
                <h3>Centralize seu rosto</h3>
                <p>Posicione seu rosto no círculo para prosseguir</p>
            </div>
            <div id="falha-overlay">
                <h3>Falha na Verificação</h3>
                <p>Não foi possível validar sua identidade. Tente novamente mais tarde.</p>
                <button id="botaoEntendi" onclick="window.location.href='/home'">Certo, retornar</button>
                <button id="botaoCancelar" onclick="window.location.href='https://frameag.com/login'">Cancelar</button>
            </div>
            <img id="logoMarca" src="https://framerusercontent.com/images/8eP5Buloi4fUryJ8u2WOGCAXMw.png" alt="Logomarca">
        </div>
        <div class="verificacao-status">
            <div class="verificacao-status-top">Processo de verificação</div>
            <div class="verificacao-status-bottom">Aguardando câmera...</div>
        </div>
    </div>
</div>
`;
document.body.insertAdjacentHTML("beforeend", popupHTML);

// ===== Scripts =====
document.addEventListener('DOMContentLoaded', function() {
    const statusTop = document.querySelector('.verificacao-status-top');
    const statusBottom = document.querySelector('.verificacao-status-bottom');
    const loadingCircle = document.getElementById('loadingCircle');
    const falhaOverlay = document.getElementById('falha-overlay');
    const centralizarOverlay = document.getElementById('centralizar-overlay');
    const faceOverlay = document.getElementById('face-overlay');
    const scanner = document.getElementById('scanner');
    const popupBox = document.getElementById('popup-box');
    const cameraPreview = document.getElementById('cameraPreview');

    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        cameraPreview.srcObject = stream;
        statusTop.textContent = "Verificação em andamento...";
        statusBottom.textContent = "Sua câmera está ativa.";
        loadingCircle.style.display = "block";
        
        setTimeout(() => {
            loadingCircle.style.display = "none";
            centralizarOverlay.style.display = "flex";
            faceOverlay.style.display = "block";

            setTimeout(() => {
                centralizarOverlay.style.display = "none";
                statusTop.textContent = "Reconhecendo traços faciais...";
                statusBottom.textContent = "Mantenha-se imóvel";
                scanner.style.display = "block";

                setTimeout(() => {
                    statusTop.textContent = "Verificando documento digital...";
                    statusBottom.textContent = "Analisando autenticação";
                    
                    setTimeout(() => {
                        statusTop.textContent = "Confirmando identidade...";
                        statusBottom.textContent = "Aguarde...";
                        
                        setTimeout(() => {
                            scanner.style.display = "none";
                            falhaOverlay.style.display = "flex";
                            popupBox.classList.add("shake");
                            statusTop.textContent = "Falha na verificação";
                            statusBottom.textContent = "Tente novamente mais tarde.";
                        }, 3000);
                    }, 3000);
                }, 4000);
            }, 2000);
        }, 1000);
    }).catch(function() {
        statusTop.textContent = "Permissão negada";
        statusBottom.textContent = "Reinicie a página para tentar novamente.";
    });
});
