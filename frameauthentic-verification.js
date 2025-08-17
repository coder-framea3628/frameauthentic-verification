// ===== Injetar CSS =====
<style>
#popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(6px);
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    animation: fadeIn 0.5s ease forwards;
}
#popup-box {
    background: #fff;
    max-width: 500px;
    width: 95%;
    padding: 24px 20px;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    font-family: 'Montserrat', sans-serif;
    text-align: center;
    z-index: 9999;
}
#popup-box h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 14px;
    background: linear-gradient(90deg, #AC865C, #8b6d4d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
#camera-container {
    position: relative;
    width: 100%;
    max-width: 320px;
    margin: 0 auto 16px;
    display: flex;
    justify-content: center;
}
#cameraPreview {
    width: 100%;
    height: auto;
    aspect-ratio: 3/4;
    border-radius: 12px;
    border: 3px solid rgba(172, 134, 92, 0.4);
    background: #000;
    object-fit: cover;
    display: block;
    transform: scaleX(-1);
}
#face-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    border: 5px solid rgba(172, 134, 92, 0.8);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    display: none;
}
.verificacao-status {
    margin-top: 16px;
}
.verificacao-status-top {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 4px;
    color: #333;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
}
.verificacao-status-bottom {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
}
#loadingCircle {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(172, 134, 92, 0.3);
    border-top: 4px solid #AC865C;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
}
#centralizar-overlay, #falha-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    color: white;
    padding: 20px;
    box-sizing: border-box;
}
#centralizar-overlay h3, #falha-overlay h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
}
#centralizar-overlay p, #falha-overlay p {
    font-size: 14px;
    font-weight: 400;
    margin: 0 0 16px 0;
    text-align: center;
}
#botaoEntendi, #botaoCancelar {
    background: #AC865C;
    color: white;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
}
#logoMarca {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 50px;
    opacity: 0.5;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.98);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>

// ===== Injetar HTML =====
<div id="popup-overlay">
    <div id="popup-box">
        <h2>Frame Authentic</h2>
        <div id="camera-container">
            <video id="cameraPreview" autoplay playsinline muted></video>
            <div id="face-overlay"></div>
            <div id="loadingCircle"></div>
            <div id="centralizar-overlay">
                <h3>Centralize seu rosto</h3>
                <p>Posicione seu rosto no centro da tela</p>
            </div>
            <div id="falha-overlay">
                <h3>Falha na Verificação</h3>
                <p>Nossa tecnologia não conseguiu validar sua identidade. Por favor, verifique sua câmera e tente novamente mais tarde.</p>
                <button id="botaoEntendi" onclick="window.location.href='/home'">Certo, retornar ao login</button>
                <button id="botaoCancelar" onclick="window.location.href='https://frameag.com/login'">Cancelar</button>
            </div>
            <img id="logoMarca" src="https://framerusercontent.com/images/8eP5Buloi4fUryJ8u2WOGCAXMw.png" alt="Logomarca">
        </div>
        <div class="verificacao-status">
            <div class="verificacao-status-top">Processo de verificação</div>
            <div class="verificacao-status-bottom">Aguardando permissão para ativar sua câmera</div>
        </div>
    </div>
</div>

// ===== Scripts =====
<script>
document.addEventListener('DOMContentLoaded', function() {
    const statusTop = document.querySelector('.verificacao-status-top');
    const statusBottom = document.querySelector('.verificacao-status-bottom');
    const loadingCircle = document.getElementById('loadingCircle');
    const falhaOverlay = document.getElementById('falha-overlay');
    const centralizarOverlay = document.getElementById('centralizar-overlay');
    const cameraPreview = document.getElementById('cameraPreview');
    const faceOverlay = document.getElementById('face-overlay');

    navigator.mediaDevices.getUser Media({ video: true }).then(function(stream) {
        cameraPreview.srcObject = stream;
        statusTop.textContent = "Verificação em andamento...";
        statusBottom.textContent = "Sua câmera está ativa. Aguarde as instruções.";
        loadingCircle.style.display = "block";
        
        setTimeout(() => {
            loadingCircle.style.display = "none";
            centralizarOverlay.style.display = "flex";
            faceOverlay.style.display = "block";

            setTimeout(() => {
                centralizarOverlay.style.display = "none";
                faceOverlay.style.display = "none";
                statusTop.textContent = "Processando imagem...";
                statusBottom.textContent = "Aguarde...";
                loadingCircle.style.display = "block";

                setTimeout(() => {
                    loadingCircle.style.display = "none";
                    statusTop.textContent = "Confirmando identidade...";
                    statusBottom.textContent = "Aguarde...";
                    loadingCircle.style.display = "block";

                    setTimeout(() => {
                        loadingCircle.style.display = "none";
                        statusTop.textContent = "Validando segurança...";
                        statusBottom.textContent = "Aguarde...";
                        loadingCircle.style.display = "block";

                        setTimeout(() => {
                            loadingCircle.style.display = "none";
                            falhaOverlay.style.display = "flex";
                            statusTop.textContent = "Houve uma falha na verificação";
                            statusBottom.textContent = "Tente novamente mais tarde.";
                        }, 3000);
                    }, 3000);
                }, 3000);
            }, 1000);
        }, 1000);
    }).catch(function() {
        statusTop.textContent = "Permissão negada";
        statusBottom.textContent = "Reinicie a página para tentar novamente.";
    });
});
</script>
