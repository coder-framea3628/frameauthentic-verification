// ===== Injetar Meta Viewport para Responsividade em Mobile =====
const metaViewport = document.createElement('meta');
metaViewport.name = 'viewport';
metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.head.appendChild(metaViewport);

// ===== Injetar Link de Fontes =====
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap';
fontLink.rel = 'preload';
fontLink.as = 'style';
fontLink.onload = function() { this.rel = 'stylesheet'; };
document.head.appendChild(fontLink);

// ===== Injetar CSS (estilo baseado na paleta, light theme inspirado nas screenshots, responsivo) =====
const style = document.createElement('style');
style.textContent = `
:root {
  --bg-color: #f8f8f8;
  --text-color: #000;
  --accent-color: #AB865B;
  --accent-light: #D3AD83;
  --secondary-bg: #fff;
  --border-color: rgba(0,0,0,0.1);
  --shadow-color: rgba(0,0,0,0.1);
  --input-bg: #fff;
  --beige-bg: #f5f2ed;
}

body.dark {
  --bg-color: #141414;
  --text-color: #fff;
  --secondary-bg: #1a1a1a;
  --border-color: rgba(255,255,255,0.1);
  --shadow-color: rgba(0,0,0,0.5);
  --input-bg: #2b2b2b;
  --beige-bg: #1a1a1a;
}

body.dark #loadingText {
  color: #aaa;
}

body.dark .label-upload {
  color: #aaa;
}

body.dark #preview {
  background: var(--input-bg) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23aaa' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h16v12H4z'/%3E%3Cpath d='M20 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zm-1 18H5V5h14v15zM7 15l4.5-6 3.5 4.5 2.5-3L19 15' fill='%23aaa'/%3E%3C/svg%3E") center/40% no-repeat;
  border: 1px solid var(--border-color);
}

body.dark input[type=text], body.dark input[type=email], body.dark input[type=tel], body.dark input[type=date], body.dark select {
  background: var(--input-bg);
  color: var(--text-color);
}

body.dark header {
  background: var(--accent-color);
}

body.dark .detail-value {
  color: #aaa;
}

body.dark .request-note {
  background: #2a2a2a;
  color: var(--text-color);
}

body {
  margin: 0;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-color);
  min-height: 100vh;
  overflow: auto;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}

#overlay {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--beige-bg);
  z-index: 9999;
  transition: opacity .6s ease;
  padding: 20px;
}

#overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

#logo {
  width: 150px;
  margin-bottom: 25px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

#loadingText {
  color: #666;
  font-size: .9rem;
  margin-top: 10px;
}

.fade {
  opacity: 0;
  transition: opacity .6s ease;
}

.fade.show {
  opacity: 1;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 33px; /* aumentado para 28px — pode ajustar para 32px se quiser ainda mais */
  margin-top: 25px;
  color: var(--text-color);
  width: 90%;
  max-width: 400px;
}

/* reforço para garantir espaçamento entre elementos do step1 */
#step1 > * {
  margin-bottom: 7px; /* complementa o gap, evita que inputs fiquem grudados visualmente */
}

#progressBar {
  height: 4px;
  background: var(--border-color);
  border-radius: 2px;
  width: 100%;
  margin-bottom: 20px;
}

.progress {
  height: 100%;
  background: var(--accent-color);
  width: 0%;
  transition: width .3s;
  border-radius: 2px;
}

#formTitle {
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
  color: #FFFF;
}

#formExplanation {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-bottom: 10px;
}

input[type=file] {
  display: none;
}

.label-upload {
  font-size: .85rem;
  color: #666;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

#preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--input-bg) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23666' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h16v12H4z'/%3E%3Cpath d='M20 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zm-1 18H5V5h14v15zM7 15l4.5-6 3.5 4.5 2.5-3L19 15' fill='%23666'/%3E%3C/svg%3E") center/40% no-repeat;
  border: 1px solid var(--border-color);
  object-fit: cover;
  cursor: pointer;
  transition: transform .3s ease;
}

#preview:hover {
  transform: scale(1.05);
}

#preview.loading {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23AB865B' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' stroke-dasharray='63' stroke-dashoffset='63'/%3E%3Canimate attributeName='stroke-dashoffset' values='63;0' dur='1s' repeatCount='indefinite'/%3E%3C/svg%3E");
  background-size: 50%;
}

input[type=text], input[type=tel], input[type=date], select {
  padding: 12px 20px;
  border: 1px solid var(--border-color);
  border-radius: 30px;
  width: 100%;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 15px;
  transition: border .2s;
}

input:focus, select:focus {
  outline: none;
  border: 1px solid var(--accent-color);
}

input:disabled, select:disabled {
  background: var(--border-color);
  color: #999;
  cursor: not-allowed;
}

button {
  background: linear-gradient(to right, var(--accent-color), var(--accent-light));
  border: none;
  border-radius: 30px;
  padding: 14px 40px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  transition: background .2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover {
  background: var(--accent-light);
}

header {
  background: var(--accent-light);
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  border-radius: 30px 30px 0 0;
  box-shadow: 0 2px 10px var(--shadow-color);
  margin-bottom: 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-circle {
  width: 30px;
  height: 30px;
}

.header-text {
  font-weight: 500;
  font-size: 16px;
}

.hello-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-profile {
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  margin-left: 10px;
}

.history-icon {
  cursor: pointer;
  width: 20px;
  height: 20px;
  fill: var(--accent-color);
}

.hamburger {
  cursor: pointer;
  width: 24px;
  height: 24px;
  fill: var(--text-color);
  margin-right: 10px;
}

.hello-photo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.card, .screen {
  background: var(--secondary-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--shadow-color);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.screen {
  display: none;
}

.screen-title {
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 20px;
}

.option-card {
  background: var(--input-bg);
  border-radius: 12px;
  padding: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 10px var(--shadow-color);
}

.option-card.main {
  background: linear-gradient(to right, var(--accent-color), var(--accent-light));
  color: #fff;
}

.option-card h4 {
  font-size: 16px;
  margin: 0;
}

.option-card p {
  font-size: 14px;
  margin: 0;
}

.option-card button {
  width: auto;
  padding: 10px 20px;
  align-self: flex-start;
}

.card-title {
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
}

.check-icon {
  width: 60px;
  height: 60px;
}

.details-link {
  color: var(--accent-color);
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.details-link:hover {
  text-decoration: underline;
  color: var(--accent-color);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  border-bottom: 1px solid var(--border-color);
  padding: 8px 0;
}

.detail-label {
  font-weight: 500;
}

.detail-value {
  color: #666;
}

.button-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.action-button {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: background .3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.request-note {
  background: #f0f0f0;
  color: #333;
}

.cancel-renewal {
  background: var(--accent-color);
  color: #fff;
}

.cancel-renewal:hover {
  background: var(--accent-light);
}

footer {
  margin-top: auto;
  padding: 20px;
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.powered-logo {
  width: 100px;
}

.footer-links {
  display: flex;
  gap: 15px;
}

.footer-link {
  color: #666;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
  color: var(--accent-color);
}

.popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 9999;
  display: none;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.95) translateY(20px);
  opacity: 0;
  background: var(--secondary-bg);
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color);
  z-index: 10000;
  display: none;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
  text-align: left;
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
}

.popup.active {
  display: block;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) translateY(0);
}

.popup h3 {
  margin-bottom: 10px;
}

.popup p {
  margin-bottom: 15px;
  font-size: 14px;
  text-align: left;
}

.popup button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup ul {
  list-style: none;
  padding: 0;
  text-align: left;
}

.popup li {
  padding: 5px 0;
  border-bottom: 1px solid var(--border-color);
}

.popup table {
  width: 100%;
  border-collapse: collapse;
}

.popup th, .popup td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.popup th {
  cursor: pointer;
}

#sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 250px;
  background: var(--secondary-bg);
  backdrop-filter: blur(10px);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 9998;
  padding: 20px;
}

#sidebar.active {
  transform: translateX(0);
}

#sidebar ul {
  list-style: none;
  padding: 0;
}

#sidebar li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

#sidebar li:hover {
  background: rgba(171,134,91,0.1);
  box-shadow: 0 0 10px rgba(171,134,91,0.2);
}

#sidebar svg {
  width: 20px;
  height: 20px;
  fill: var(--accent-color);
}

#sidebar .toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

#darkToggle {
  cursor: pointer;
  accent-color: var(--accent-color);
}

#redirectOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  flex-direction: column;
  gap: 10px;
  color: #fff;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

#infoIcon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 20px;
  color: var(--accent-color);
  cursor: pointer;
}

.edit-mode {
  background: var(--secondary-bg);
}

#removePhoto {
  font-size: .85rem;
  color: #f00;
  cursor: pointer;
  margin-top: 5px;
}

.back-button {
  background: none;
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  margin-bottom: 20px;
  width: 100%;
}

.error-msg {
  color: #E05050;
  font-size: 0.8rem;
  margin-top: -10px;
  margin-bottom: 10px;
}

#editBack {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 20px;
  color: var(--accent-color);
  cursor: pointer;
}

#deleteCpfInput {
  padding: 12px 20px;
  border: 1px solid var(--border-color);
  border-radius: 30px;
  width: 100%;
  background: var(--input-bg);
  color: var(--text-color);
  font-size: 15px;
  transition: border .2s;
  margin-bottom: 15px;
}

@media (max-width: 600px) {
  #overlay {
    padding: 30px;
    overflow: hidden;
  }

  form {
    gap: 25px;
  }

  header {
    padding: 8px 16px;
  }

  .card, .screen {
    padding: 16px;
  }

  .popup {
    max-width: 120vw;
  }
}

@media (max-width: 390px) {
  header {
    flex-direction: column;
    gap: 10px;
    border-radius: 20px;
  }

  .button-container {
    flex-direction: column;
    gap: 10px;
  }
}
`;
document.head.appendChild(style);

// ===== Injetar HTML Estrutura =====
document.body.innerHTML = `
<div id="redirectOverlay">
  <div class="spinner"></div>
  <p>Carregando...</p>
</div>

<div id="overlay">
  <img id="logo" src="https://framerusercontent.com/images/Oe8d7JZskbAvjlTrwbIEeozgs.png" alt="Logo do Frame" loading="lazy"> 
  <div class="loading-spinner"></div>
  <p id="loadingText">Preparando...</p>
  <div id="formArea" class="fade">
    <h2 id="formTitle">Área de Cadastro</h2>
    <p id="formExplanation">Para acessar e gerenciar suas faturas.</p>
    <form id="profileForm">
      <div id="progressBar"><div class="progress"></div></div>
      <div id="step1">
        <select id="country" required aria-required="true">
          <option value="">Selecione o país</option>
          <option value="Brasil">Brasil</option>
          <option value="Chile">Chile</option>
          <option value="Colômbia">Colômbia</option>
          <option value="Argentina">Argentina</option>
          <option value="Bolívia">Bolívia</option>
          <option value="Estados Unidos">Estados Unidos</option>
          <!-- Adicione mais países se necessário -->
        </select>
        <input id="name" type="text" placeholder="Nome completo" required aria-required="true">
        <input id="cpf" type="tel" placeholder="Informe seu CPF" required aria-required="true">
        <input id="birthDate" type="text" placeholder="Data de Nascimento (DD/MM/AAAA)" required aria-required="true">
      </div>
      <div id="step2" style="display:none;">
        <label for="photo" class="label-upload">
          <img id="preview" src="" alt="Adicionar foto de perfil" role="button" aria-label="Adicionar foto de perfil">
          Adicionar foto (opcional)
          <span id="removePhoto" style="display:none;">Remover</span>
        </label>
        <input id="photo" type="file" accept="image/*">
        <input id="username" type="text" placeholder="@username" required aria-required="true">
      </div>
      <button type="button" id="nextButton">Avançar</button>
    </form>
  </div>
  <span id="infoIcon" role="button" aria-label="Informações">?</span>
</div>

<header style="display: none;">
  <svg class="hamburger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
  <div class="logo-container">
    <img class="logo-circle" src="https://framerusercontent.com/images/es31MeIE8UuR3D8HQlLfluPLqE.png" alt="Logo circular do Frame" loading="lazy">
    <span class="header-text">Portal do Cliente | Frame</span>
  </div>
  <div class="hello-container" id="hello"></div>
</header>

<div id="sidebar">
  <ul>
    <li id="menuProfile"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> Perfil</li>
    <li id="menuFaturas"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> Faturas</li>
    <li id="menuSuporte"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg> Suporte</li>
    <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Configurações
      <div class="toggle-wrapper">
        <label for="darkToggle">Dark Mode</label>
        <input type="checkbox" id="darkToggle">
      </div>
    </li>
    <li id="menuLogout"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Sair</li>
  </ul>
</div>

<div class="card" style="display: none;">
  <div class="card-title">
    <img class="check-icon" src="https://framerusercontent.com/images/nWejBYDasQmTXWJ27vJEuLDRheE.png" alt="Ícone de verificação para fatura paga" loading="lazy">
    Fatura paga
  </div>
  <a class="details-link" href="#" aria-label="Ver detalhes da fatura">Ver detalhes da fatura ></a>
  <div class="detail-item">
    <span class="detail-label">Número da fatura</span>
    <span class="detail-value">F-97A706DA-12993</span>
  </div>
  <div class="detail-item">
    <span class="detail-label">Data de pagamento</span>
    <span class="detail-value"></span>
  </div>
  <div class="detail-item">
    <span class="detail-label">Forma de pagamento</span>
    <span class="detail-value">Cartão de Crédito</span>
  </div>
  <div class="button-container">
    <div class="action-button request-note" id="requestNote" role="button" tabindex="0" aria-label="Solicitar nota fiscal">Solicitar nota fiscal</div>
    <div class="action-button cancel-renewal" id="cancelRenewal" role="button" tabindex="0" aria-label="Cancelar renovação automática">Cancelar renovação automática</div>
  </div>
</div>

<div id="noteScreen" class="screen">
  <button class="back-button" id="backNote">Voltar</button>
  <div class="screen-title">Solicitação de Nota Fiscal</div>
  <div class="option-card main">
    <h4>Solicitar Nota Fiscal</h4>
    <p>Obtenha sua nota fiscal para a fatura paga.</p>
    <button id="redirectNote">Solicitar</button>
  </div>
  <div class="option-card">
    <h4>Como Funciona</h4>
    <p>Entenda o processo de solicitação.</p>
    <button id="howNote">Ver Mais</button>
  </div>
  <div class="option-card">
    <h4>Perguntas Frequentes</h4>
    <p>Respostas para dúvidas comuns.</p>
    <button id="faqNote">Ver Mais</button>
  </div>
</div>

<div id="cancelScreen" class="screen">
  <button class="back-button" id="backCancel">Voltar</button>
  <div class="screen-title">Cancelar Renovação Automática</div>
  <div class="option-card main">
    <h4>Cancelar Renovação</h4>
    <p>Confirme o cancelamento da renovação automática.</p>
    <button id="redirectCancel">Confirmar</button>
  </div>
  <div class="option-card">
    <h4>Como Funciona</h4>
    <p>Entenda o processo de cancelamento.</p>
    <button id="howCancel">Ver Mais</button>
  </div>
  <div class="option-card">
    <h4>Perguntas Frequentes</h4>
    <p>Respostas para dúvidas comuns.</p>
    <button id="faqCancel">Ver Mais</button>
  </div>
</div>

<footer style="display: none;">
  <img class="powered-logo" src="https://framerusercontent.com/images/Oe8d7JZskbAvjlTrwbIEeozgs.png" alt="Powered by Frame" loading="lazy">
  <div class="footer-links">
    <a class="footer-link" href="https://frameag.com/privacy">Privacidade</a>
    <a class="footer-link" href="https://frameag.com/termos">Política de Reembolso</a>
    <a class="footer-link" href="https://frameag.com/contato">Suporte</a>
  </div>
</footer>

<div class="popup-backdrop" id="howNoteBackdrop"></div>
<div id="howNotePopup" class="popup" role="dialog" aria-modal="true">
  <h3>Como Funciona a Solicitação de Nota Fiscal</h3>
  <p>A solicitação é feita através do link fornecido. Preencha os dados necessários e receba a nota por e-mail.</p>
  <button id="closeHowNote">Fechar</button>
</div>

<div class="popup-backdrop" id="faqNoteBackdrop"></div>
<div id="faqNotePopup" class="popup" role="dialog" aria-modal="true">
  <h3>Perguntas Frequentes sobre Nota Fiscal</h3>
  <p>Q: Quanto tempo demora? A: Até 48 horas.<br>Q: Preciso de documentos? A: Apenas os dados da fatura.</p>
  <button id="closeFaqNote">Fechar</button>
</div>

<div class="popup-backdrop" id="howCancelBackdrop"></div>
<div id="howCancelPopup" class="popup" role="dialog" aria-modal="true">
  <h3>Como Funciona o Cancelamento</h3>
  <p>O cancelamento interrompe renovações futuras da sua assinatura, mas não afeta pagamentos atuais.</p>
  <button id="closeHowCancel">Fechar</button>
</div>

<div class="popup-backdrop" id="faqCancelBackdrop"></div>
<div id="faqCancelPopup" class="popup" role="dialog" aria-modal="true">
  <h3>Perguntas Frequentes sobre Cancelamento</h3>
  <p>Q: Posso reativar? A: Sim, a qualquer momento.<br>Q: Há taxa? A: Não.</p>
  <button id="closeFaqCancel">Fechar</button>
</div>

<div class="popup-backdrop" id="detailsBackdrop"></div>
<div id="detailsPopup" class="popup" role="dialog" aria-modal="true">
  <h3>Detalhes da Fatura</h3>
  <p>Busque em seu e-mail a confirmação da assinatura Premium. Lá você recebeu sua fatura completa em PDF ou envie um email para: contato@frameag.com.</p>
  <button id="closeDetails">Fechar</button>
</div>

<div class="popup-backdrop" id="logBackdrop"></div>
<div id="logPopup" class="popup" role="dialog" aria-modal="true">
  <h3>Histórico</h3>
  <ul id="logList"></ul>
  <button id="closeLog">Fechar</button>
</div>

<div class="popup-backdrop" id="infoBackdrop"></div>
<div id="infoPopup" class="popup" role="dialog" aria-modal="true">
  <h3>Informações</h3>
  <p>Esta é a página de cadastro do Frame Invoices, aqui você pode acessar suas faturas, cancelar a renovação automática e mais. Tudo para garantir máxima transparência nas cobranças e liberdade para cancelar quando quiser.</p>
  <button id="closeInfo">Fechar</button>
</div>

<div class="popup-backdrop" id="deleteBackdrop"></div>
<div id="deletePopup" class="popup" role="dialog" aria-modal="true">
  <h3>Excluir Perfil</h3>
  <p>Você está prestes a excluir seu perfil permanentemente.</p>
  <p>Essa ação é irreversível. Você perderá todos os dados, incluindo acesso às faturas e configurações salvas. Se desejar prosseguir, confirme seu CPF abaixo.</p>
  <input id="deleteCpfInput" type="tel" placeholder="Informe seu CPF">
  <button id="proceedDelete">Prosseguir com exclusão</button>
</div>
`;

// ===== Lógica JavaScript =====
const strings = {
  namePlaceholder: 'Nome completo',
  cpfPlaceholder: 'Informe seu CPF',
  birthDatePlaceholder: 'Data de Nascimento',
  usernamePlaceholder: '@username',
  nextButton: 'Avançar',
  submitButton: 'Concluir',
  editSubmitButton: 'Aplicar mudanças',
  editButton: 'Editar',
  hello: 'Olá, ',
  alertInvalidName: 'Por favor, inclua seu nome e sobrenome.',
  alertInvalidCPF: 'CPF inválido, insira e tente novamente.',
  alertInvalidBirthDate: 'Data de nascimento inválida, tente novamente.',
  alertFileSize: 'Sua foto deve ter no máximo 3MB.',
  alertImageDim: 'Sua foto deve ter no mínimo 100x100 e no máximo 2000x2000 px.',
  alertStorageError: 'Erro ao salvar seus dados. Reinicie a página.',
  alertInvalidUsername: 'Seu username deve começar com @ e possuir ao menos 3 caracteres.',
  alertInvalidCountry: 'Selecione um país válido.'
};

const overlay = document.getElementById('overlay');
const formArea = document.getElementById('formArea');
const photoInput = document.getElementById('photo');
const preview = document.getElementById('preview');
const profileForm = document.getElementById('profileForm');
const loadingText = document.getElementById('loadingText');
const hello = document.getElementById('hello');
const header = document.querySelector('header');
const card = document.querySelector('.card');
const footer = document.querySelector('footer');
const sidebar = document.getElementById('sidebar');
const hamburger = document.querySelector('.hamburger');
const darkToggle = document.getElementById('darkToggle');
const redirectOverlay = document.getElementById('redirectOverlay');
const nextButton = document.getElementById('nextButton');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const progress = document.querySelector('.progress');
const removePhoto = document.getElementById('removePhoto');
const noteScreen = document.getElementById('noteScreen');
const cancelScreen = document.getElementById('cancelScreen');

let currentStep = 0;
let isEditing = false;

document.getElementById('country').placeholder = 'País';
document.getElementById('name').placeholder = strings.namePlaceholder;
document.getElementById('cpf').placeholder = strings.cpfPlaceholder;
document.getElementById('birthDate').placeholder = strings.birthDatePlaceholder;
document.getElementById('username').placeholder = strings.usernamePlaceholder;
nextButton.textContent = strings.nextButton;

const texts = ['Preparando...', 'Carregando painel...', 'Iniciando...'];

function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

function showContent() {
  return new Promise(resolve => {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => {
      header.style.display = 'flex';
      card.style.display = 'flex';
      footer.style.display = 'flex';
      let paymentDateLabel = Array.from(document.querySelectorAll('.detail-label')).find(label => label.textContent.includes('Data de pagamento'));
      let paymentDateSpan = paymentDateLabel ? paymentDateLabel.nextElementSibling : document.querySelector('.detail-item:nth-child(2) .detail-value');
      const currentDate = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      paymentDateSpan.textContent = currentDate.toLocaleDateString('pt-BR', options);
      if (localStorage.profileData) {
        const data = JSON.parse(localStorage.profileData);
        let invoiceLabel = Array.from(document.querySelectorAll('.detail-label')).find(label => label.textContent.includes('Número da fatura'));
        let invoiceSpan = invoiceLabel ? invoiceLabel.nextElementSibling : document.querySelector('.detail-value');
        invoiceSpan.textContent = data.invoiceNumber;
      }
      resolve();
    }, 600);
  });
}

function loadProfile(data) {
  const firstName = sanitizeInput(data.name.split(' ')[0]);
  const helloText = document.createElement('span');
  helloText.textContent = `${strings.hello}${firstName}`;
  hello.appendChild(helloText);

  if (data.photo) {
    const img = document.createElement('img');
    img.classList.add('hello-photo');
    img.src = data.photo;
    img.alt = 'Foto de perfil';
    img.loading = 'lazy';
    hello.appendChild(img);
  }

  const editBtn = document.createElement('span');
  editBtn.classList.add('edit-profile');
  editBtn.textContent = strings.editButton;
  editBtn.role = 'button';
  editBtn.tabIndex = 0;
  editBtn.ariaLabel = 'Editar perfil';
  editBtn.addEventListener('click', () => editProfile(data));
  editBtn.addEventListener('keydown', e => { if (e.key === 'Enter') editProfile(data); });
  hello.appendChild(editBtn);

  const historyIcon = document.createElement('svg');
  historyIcon.classList.add('history-icon');
  historyIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  historyIcon.setAttribute('fill', 'none');
  historyIcon.setAttribute('viewBox', '0 0 24 24');
  historyIcon.setAttribute('stroke', 'currentColor');
  historyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />';
  historyIcon.role = 'button';
  historyIcon.tabIndex = 0;
  historyIcon.ariaLabel = 'Ver histórico';
  historyIcon.addEventListener('click', showLog);
  historyIcon.addEventListener('keydown', e => { if (e.key === 'Enter') showLog(); });
  hello.appendChild(historyIcon);
}

function editProfile(data) {
  isEditing = true;
  document.querySelector('.loading-spinner').style.display = 'none';
  loadingText.style.display = 'none';
  formArea.classList.add('show');
  overlay.classList.remove('hidden');
  overlay.classList.add('edit-mode');
  document.body.style.overflow = 'hidden';
  header.style.display = 'none';
  card.style.display = 'none';
  footer.style.display = 'none';
  nextButton.textContent = strings.editSubmitButton;
  document.getElementById('formExplanation').style.display = 'none';
  document.getElementById('progressBar').style.display = 'none';
  step1.style.display = 'none';
  step2.style.display = 'flex';
  document.getElementById('formTitle').textContent = 'Perfil do usuário';
  overlay.style.justifyContent = 'flex-start';
  overlay.style.paddingTop = '50px';

  let editText = document.getElementById('editText');
  if (!editText) {
    editText = document.createElement('p');
    editText.id = 'editText';
    editText.textContent = 'Edite suas informações abaixo';
    editText.style.fontSize = '1rem';
    editText.style.marginBottom = '10px';
    profileForm.prepend(editText);
  }

  document.getElementById('username').value = sanitizeInput(data.username);
  if (data.photo) {
    preview.src = data.photo;
    preview.dataset.img = data.photo;
    preview.style.background = 'none';
    removePhoto.style.display = 'block';
    const label = document.querySelector('.label-upload');
    const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3 && node.textContent.trim() === 'Adicionar foto (opcional)');
    if (textNode) label.removeChild(textNode);
  } else {
    const label = document.querySelector('.label-upload');
    const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3 && node.textContent.trim() === 'Adicionar foto (opcional)');
    if (!textNode) label.insertBefore(document.createTextNode('Adicionar foto (opcional)'), removePhoto);
  }

  let warning = document.getElementById('editWarning');
  if (!warning) {
    warning = document.createElement('div');
    warning.id = 'editWarning';
    warning.style.backgroundColor = '#6B4423';
    warning.style.color = '#fff';
    warning.style.borderRadius = '20px';
    warning.style.padding = '10px';
    warning.style.textAlign = 'center';
    warning.style.fontSize = '0.8rem';
    warning.style.marginBottom = '10px';
    warning.textContent = 'Não é possível editar dados pessoais informados no cadastro. Se você deseja alterar, clique em "Excluir perfil" e siga as etapas.';
    profileForm.insertBefore(warning, step2);
  }

  let deleteProfile = document.getElementById('deleteProfile');
  if (!deleteProfile) {
    deleteProfile = document.createElement('span');
    deleteProfile.id = 'deleteProfile';
    deleteProfile.textContent = 'Excluir perfil';
    deleteProfile.style.color = '#E05050';
    deleteProfile.style.textDecoration = 'underline';
    deleteProfile.style.cursor = 'pointer';
    deleteProfile.style.marginTop = '10px';
    deleteProfile.addEventListener('mouseover', () => { deleteProfile.style.textDecoration = 'underline'; });
    deleteProfile.addEventListener('mouseout', () => { deleteProfile.style.textDecoration = 'underline'; });
    deleteProfile.addEventListener('click', () => {
      document.getElementById('deleteBackdrop').style.display = 'block';
      document.getElementById('deletePopup').classList.add('active');
    });
    profileForm.appendChild(deleteProfile);
  }

  let editBack = document.getElementById('editBack');
  if (!editBack) {
    editBack = document.createElement('span');
    editBack.id = 'editBack';
    editBack.textContent = '←';
    editBack.addEventListener('click', () => {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      header.style.display = 'flex';
      card.style.display = 'flex';
      footer.style.display = 'flex';
      formArea.classList.remove('show');
      overlay.classList.remove('edit-mode');
      isEditing = false;
      const editText = document.getElementById('editText');
      if (editText) editText.remove();
      const warning = document.getElementById('editWarning');
      if (warning) warning.remove();
      const deleteProfile = document.getElementById('deleteProfile');
      if (deleteProfile) deleteProfile.remove();
      const editBack = document.getElementById('editBack');
      if (editBack) editBack.remove();
      step2.style.display = 'none';
      step1.style.display = 'flex';
      document.getElementById('formTitle').textContent = 'Área de Cadastro';
      document.getElementById('formExplanation').style.display = 'block';
      document.getElementById('progressBar').style.display = 'block';
      nextButton.textContent = strings.nextButton;
      overlay.style.justifyContent = 'center';
      overlay.style.paddingTop = '20px';
    });
    overlay.appendChild(editBack);
  }
}

function showLog() {
  let log = JSON.parse(localStorage.log || '[]');
  let ascending = false;
  const logList = document.getElementById('logList');
  function renderLog() {
    log.sort((a, b) => ascending ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
    logList.innerHTML = '<table><thead><tr><th>Ação</th><th>Data <span id="sortIcon">' + (ascending ? '↑' : '↓') + '</span></th></tr></thead><tbody>' + log.map(entry => `<tr><td>${entry.action}</td><td>${entry.date}</td></tr>`).join('') + '</tbody></table><button id="clearLog">Limpar histórico</button>';
    document.getElementById('sortIcon').addEventListener('click', () => {
      ascending = !ascending;
      renderLog();
    });
    document.getElementById('clearLog').addEventListener('click', () => {
      if (confirm('Tem certeza que deseja limpar o histórico?')) {
        localStorage.log = '[]';
        log = [];
        renderLog();
      }
    });
  }
  renderLog();
  document.getElementById('logBackdrop').style.display = 'block';
  document.getElementById('logPopup').classList.add('active');
  document.getElementById('closeLog').focus();
}

let idx = 0;
function updateLoadingText() {
  loadingText.textContent = texts[idx % texts.length];
  idx++;
}
updateLoadingText();
const textInterval = setInterval(updateLoadingText, 1500);

setTimeout(() => {
  clearInterval(textInterval);
  document.querySelector('.loading-spinner').style.display = 'none';
  if (!localStorage.profileData) {
    formArea.classList.add('show');
    loadingText.style.display = 'none';
  } else {
    showContent();
  }
}, 4500);

if (!localStorage.theme) {
  localStorage.theme = 'dark';
}
if (localStorage.theme === 'dark') {
  document.body.classList.add('dark');
  darkToggle.checked = true;
}

if (localStorage.profileData) {
  try {
    const data = JSON.parse(localStorage.profileData);
    loadProfile(data);
    showContent();
  } catch (e) {
    alert(strings.alertStorageError);
    localStorage.removeItem('profileData');
    location.reload();
  }
} else {
  localStorage.log = JSON.stringify([]);
  if (window.innerWidth <= 600) {
    document.body.style.overflow = 'hidden';
  }
}

function maskCPF(input) {
  let v = input.value.replace(/\D/g, '');
  if (v.length > 11) v = v.substring(0, 11);
  v = v.replace(/^(\d{3})(\d)/, '$1.$2');
  v = v.replace(/^(\d{3}\.\d{3})(\d)/, '$1.$2');
  v = v.replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, '$1-$2');
  input.value = v;
}

document.getElementById('cpf').addEventListener('input', e => maskCPF(e.target));

function maskDate(input) {
  let v = input.value.replace(/\D/g, '');
  if (v.length > 8) v = v.substring(0, 8);
  v = v.replace(/^(\d{2})(\d)/, '$1/$2');
  v = v.replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2');
  input.value = v;
}

document.getElementById('birthDate').addEventListener('input', e => maskDate(e.target));

function isValidCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0, rest;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

function isValidDate(date) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(date)) return false;
  const [day, month, year] = date.split('/').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) return false;
  return true;
}

photoInput.onchange = e => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/') || file.size > 3000000) {
    alert(strings.alertFileSize);
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      if (img.width < 100 || img.height < 100 || img.width > 2000 || img.height > 2000) {
        alert(strings.alertImageDim);
        return;
      }
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 128, 128);
      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      preview.src = compressed;
      preview.dataset.img = compressed;
      preview.classList.remove('loading');
      preview.style.background = 'none';
      removePhoto.style.display = 'block';
      const label = document.querySelector('.label-upload');
      const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3);
      if (textNode) label.removeChild(textNode);
      let toast = document.createElement('div');
      toast.textContent = 'Foto adicionada com sucesso.';
      toast.style.position = 'fixed';
      toast.style.top = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'linear-gradient(to right, #AB865B, #D3AD83)';
      toast.style.color = 'white';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '20px';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.zIndex = '10000';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
      }, 10);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    };
  };
  reader.readAsDataURL(file);
  preview.classList.add('loading');
};

removePhoto.addEventListener('click', () => {
  preview.src = '';
  preview.dataset.img = '';
  preview.style.background = '';
  removePhoto.style.display = 'none';
  photoInput.value = '';
  const label = document.querySelector('.label-upload');
  const textNode = document.createTextNode('Adicionar foto (opcional)');
  label.insertBefore(textNode, removePhoto);
  let toast = document.createElement('div');
  toast.textContent = 'Foto removida com sucesso.';
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'linear-gradient(to right, #AB865B, #D3AD83)';
  toast.style.color = 'white';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '20px';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s, transform 0.3s';
  toast.style.zIndex = '10000';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
});

function showError(id, msg) {
  let err = document.getElementById(id + 'Error');
  if (!err) {
    err = document.createElement('span');
    err.id = id + 'Error';
    err.className = 'error-msg';
    document.getElementById(id).after(err);
  }
  err.textContent = msg;
}

function clearError(id) {
  const err = document.getElementById(id + 'Error');
  if (err) err.textContent = '';
}

['country', 'name', 'cpf', 'birthDate', 'username'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => clearError(id));
});

nextButton.addEventListener('click', () => {
  if (isEditing) {
    submitForm();
    return;
  }
  if (currentStep === 0) {
    const country = document.getElementById('country').value.trim();
    const name = document.getElementById('name').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const birthDate = document.getElementById('birthDate').value.trim();
    let valid = true;
    if (!country) {
      showError('country', strings.alertInvalidCountry);
      valid = false;
    }
    if (name.length < 3 || name.split(' ').length < 2) {
      showError('name', strings.alertInvalidName);
      valid = false;
    }
    if (!isValidCPF(cpf)) {
      showError('cpf', strings.alertInvalidCPF);
      valid = false;
    }
    if (!isValidDate(birthDate)) {
      showError('birthDate', strings.alertInvalidBirthDate);
      valid = false;
    }
    if (valid) {
      const [day, month, year] = birthDate.split('/').map(Number);
      const birth = new Date(year, month - 1, day);
      const age = Math.floor((new Date() - birth) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        showError('birthDate', 'Você deve ter 18 anos para acessar o Frame Invoices.');
        valid = false;
      }
    }
    if (!valid) return;
    currentStep = 1;
    step1.style.display = 'none';
    step2.style.display = 'flex';
    progress.style.width = '100%';
    nextButton.textContent = strings.submitButton;
  } else {
    submitForm();
  }
});

function submitForm() {
  const country = document.getElementById('country').value.trim();
  const name = document.getElementById('name').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const birthDate = document.getElementById('birthDate').value.trim();
  const username = document.getElementById('username').value.trim();
  let valid = true;
  if (currentStep === 1 || isEditing) {
    if (!username.startsWith('@') || username.length < 4) {
      showError('username', strings.alertInvalidUsername);
      valid = false;
    }
    if (username.length > 15) {
      showError('username', 'Seu user deve ter no máximo 15 caracteres.');
      valid = false;
    }
  }
  if (!isEditing) {
    if (!country) {
      showError('country', strings.alertInvalidCountry);
      valid = false;
    }
    if (name.length < 3 || name.split(' ').length < 2) {
      showError('name', strings.alertInvalidName);
      valid = false;
    }
    if (!isValidCPF(cpf)) {
      showError('cpf', strings.alertInvalidCPF);
      valid = false;
    }
    if (!isValidDate(birthDate)) {
      showError('birthDate', strings.alertInvalidBirthDate);
      valid = false;
    }
    if (valid) {
      const [day, month, year] = birthDate.split('/').map(Number);
      const birth = new Date(year, month - 1, day);
      const age = Math.floor((new Date() - birth) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        showError('birthDate', 'Você deve ter 18 anos para acessar o Frame Invoices.');
        valid = false;
      }
    }
  }
  if (!valid) return;
  const data = isEditing ? JSON.parse(localStorage.profileData) : {};
  if (!isEditing) {
    data.country = sanitizeInput(country);
    data.name = sanitizeInput(name);
    data.cpf = sanitizeInput(cpf.replace(/\D/g, ''));
    data.birthDate = sanitizeInput(birthDate);
    if (!data.invoiceNumber) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomChars = Math.random().toString(36).substr(2, 5).toUpperCase();
      data.invoiceNumber = `F-${timestamp}-${randomChars}`;
    }
  }
  data.username = sanitizeInput(username);
  data.photo = preview.dataset.img || '';
  try {
    localStorage.profileData = JSON.stringify(data);
    const log = JSON.parse(localStorage.log);
    const action = isEditing ? 'Perfil editado' : 'Perfil criado';
    log.push({action, date: new Date().toLocaleDateString('pt-BR')});
    localStorage.log = JSON.stringify(log);
    hello.innerHTML = '';
    loadProfile(data);
    formArea.classList.remove('show');
    overlay.classList.remove('edit-mode');
    const editText = document.getElementById('editText');
    if (editText) editText.remove();
    document.getElementById('formExplanation').style.display = '';
    document.getElementById('progressBar').style.display = '';
    step1.style.display = '';
    step2.style.display = 'none';
    progress.style.width = '0%';
    currentStep = 0;
    nextButton.textContent = strings.nextButton;
    isEditing = false;
    const warning = document.getElementById('editWarning');
    if (warning) warning.remove();
    const deleteProfile = document.getElementById('deleteProfile');
    if (deleteProfile) deleteProfile.remove();
    const editBack = document.getElementById('editBack');
    if (editBack) editBack.remove();
    overlay.style.justifyContent = 'center';
    overlay.style.paddingTop = '20px';
    if (!isEditing) {
      formArea.style.display = 'none';
      let successDiv = document.createElement('div');
      successDiv.id = 'successPage';
      successDiv.style.display = 'flex';
      successDiv.style.flexDirection = 'column';
      successDiv.style.alignItems = 'center';
      successDiv.style.gap = '10px';
      successDiv.style.marginTop = '20px';
      let photoImg = document.createElement('img');
      photoImg.src = data.photo || 'https://framerusercontent.com/images/es31MeIE8UuR3D8HQlLfluPLqE.png';
      photoImg.style.width = '100px';
      photoImg.style.height = '100px';
      photoImg.style.borderRadius = '50%';
      photoImg.style.objectFit = 'cover';
      successDiv.appendChild(photoImg);
      let title = document.createElement('h2');
      title.textContent = `Tudo certo, ${data.name.split(' ')[0]}.`;
      title.style.textAlign = 'center';
      successDiv.appendChild(title);
      let subtitle = document.createElement('p');
      subtitle.textContent = 'Boas-vindas ao Frame Invoices.';
      subtitle.style.textAlign = 'center';
      successDiv.appendChild(subtitle);
      let accessBtn = document.createElement('button');
      accessBtn.textContent = 'Acessar meu perfil';
      accessBtn.addEventListener('click', () => {
        successDiv.remove();
        showContent();
      });
      successDiv.appendChild(accessBtn);
      overlay.appendChild(successDiv);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        disableForReducedMotion: true
      });
      setTimeout(() => {
        successDiv.remove();
        showContent();
      }, 5000);
    } else {
      showContent();
    }
  } catch (err) {
    alert(strings.alertStorageError + ' ' + err.message);
  }
}

hamburger.addEventListener('click', () => sidebar.classList.toggle('active'));

document.addEventListener('click', e => {
  if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove('active');
  }
});

document.getElementById('menuProfile').addEventListener('click', () => {
  const data = JSON.parse(localStorage.profileData);
  editProfile(data);
  sidebar.classList.remove('active');
});

document.getElementById('menuFaturas').addEventListener('click', () => {
  alert('Seção de faturas em desenvolvimento.');
  sidebar.classList.remove('active');
});

document.getElementById('menuSuporte').addEventListener('click', () => {
  redirectOverlay.querySelector('p').textContent = 'Redirecionando...';
  redirectOverlay.style.display = 'flex';
  setTimeout(() => location.href = 'https://frameag.com/contato', 1000);
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.theme = darkToggle.checked ? 'dark' : 'light';
});

document.getElementById('menuLogout').addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});

document.getElementById('requestNote').addEventListener('click', () => {
  redirectOverlay.style.display = 'flex';
  setTimeout(() => {
    redirectOverlay.style.display = 'none';
    header.style.display = 'none';
    card.style.display = 'none';
    noteScreen.style.display = 'flex';
  }, 500);
});
document.getElementById('requestNote').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('requestNote').click(); });

document.getElementById('cancelRenewal').addEventListener('click', () => {
  redirectOverlay.style.display = 'flex';
  setTimeout(() => {
    redirectOverlay.style.display = 'none';
    header.style.display = 'none';
    card.style.display = 'none';
    cancelScreen.style.display = 'flex';
  }, 500);
});
document.getElementById('cancelRenewal').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('cancelRenewal').click(); });

document.getElementById('backNote').addEventListener('click', () => {
  noteScreen.style.display = 'none';
  header.style.display = 'flex';
  card.style.display = 'flex';
});

document.getElementById('backCancel').addEventListener('click', () => {
  cancelScreen.style.display = 'none';
  header.style.display = 'flex';
  card.style.display = 'flex';
});

document.getElementById('redirectNote').addEventListener('click', () => {
  redirectOverlay.querySelector('p').textContent = 'Redirecionando...';
  redirectOverlay.style.display = 'flex';
  setTimeout(() => {
    location.href = 'https://frameag.com/invoice';
    redirectOverlay.style.display = 'none';
  }, 1000);
});

document.getElementById('redirectCancel').addEventListener('click', () => {
  redirectOverlay.querySelector('p').textContent = 'Redirecionando...';
  redirectOverlay.style.display = 'flex';
  setTimeout(() => {
    location.href = 'https://frameag.com/app/invoice-consumer-cancelrenewal';
    redirectOverlay.style.display = 'none';
  }, 1000);
});

document.getElementById('howNote').addEventListener('click', () => {
  document.getElementById('howNoteBackdrop').style.display = 'block';
  document.getElementById('howNotePopup').classList.add('active');
});

document.getElementById('faqNote').addEventListener('click', () => {
  document.getElementById('faqNoteBackdrop').style.display = 'block';
  document.getElementById('faqNotePopup').classList.add('active');
});

document.getElementById('howCancel').addEventListener('click', () => {
  document.getElementById('howCancelBackdrop').style.display = 'block';
  document.getElementById('howCancelPopup').classList.add('active');
});

document.getElementById('faqCancel').addEventListener('click', () => {
  document.getElementById('faqCancelBackdrop').style.display = 'block';
  document.getElementById('faqCancelPopup').classList.add('active');
});

document.getElementById('closeHowNote').addEventListener('click', () => {
  document.getElementById('howNotePopup').classList.remove('active');
  document.getElementById('howNoteBackdrop').style.display = 'none';
});

document.getElementById('closeFaqNote').addEventListener('click', () => {
  document.getElementById('faqNotePopup').classList.remove('active');
  document.getElementById('faqNoteBackdrop').style.display = 'none';
});

document.getElementById('closeHowCancel').addEventListener('click', () => {
  document.getElementById('howCancelPopup').classList.remove('active');
  document.getElementById('howCancelBackdrop').style.display = 'none';
});

document.getElementById('closeFaqCancel').addEventListener('click', () => {
  document.getElementById('faqCancelPopup').classList.remove('active');
  document.getElementById('faqCancelBackdrop').style.display = 'none';
});

document.querySelector('.details-link').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('detailsBackdrop').style.display = 'block';
  document.getElementById('detailsPopup').classList.add('active');
  document.getElementById('closeDetails').focus();
});

document.getElementById('closeDetails').addEventListener('click', () => {
  document.getElementById('detailsPopup').classList.remove('active');
  document.getElementById('detailsBackdrop').style.display = 'none';
});

document.getElementById('closeLog').addEventListener('click', () => {
  document.getElementById('logPopup').classList.remove('active');
  document.getElementById('logBackdrop').style.display = 'none';
});

document.getElementById('infoIcon').addEventListener('click', () => {
  document.getElementById('infoBackdrop').style.display = 'block';
  document.getElementById('infoPopup').classList.add('active');
});

document.getElementById('closeInfo').addEventListener('click', () => {
  document.getElementById('infoPopup').classList.remove('active');
  document.getElementById('infoBackdrop').style.display = 'none';
});

document.getElementById('proceedDelete').addEventListener('click', () => {
  const cpfInput = document.getElementById('deleteCpfInput').value;
  if (cpfInput) {
    const enteredCpf = cpfInput.replace(/\D/g, '');
    const storedData = JSON.parse(localStorage.profileData);
    if (enteredCpf === storedData.cpf) {
      localStorage.clear();
      location.reload();
    } else {
      alert('CPF incorreto. Exclusão cancelada.');
    }
  }
});
document.getElementById('deleteCpfInput').addEventListener('input', e => maskCPF(e.target));

const backdrops = [
  document.getElementById('howNoteBackdrop'),
  document.getElementById('faqNoteBackdrop'),
  document.getElementById('howCancelBackdrop'),
  document.getElementById('faqCancelBackdrop'),
  document.getElementById('detailsBackdrop'),
  document.getElementById('logBackdrop'),
  document.getElementById('infoBackdrop'),
  document.getElementById('deleteBackdrop')
];
const popups = [
  document.getElementById('howNotePopup'),
  document.getElementById('faqNotePopup'),
  document.getElementById('howCancelPopup'),
  document.getElementById('faqCancelPopup'),
  document.getElementById('detailsPopup'),
  document.getElementById('logPopup'),
  document.getElementById('infoPopup'),
  document.getElementById('deletePopup')
];

backdrops.forEach((bd, i) => {
  bd.addEventListener('click', () => {
    popups[i].classList.remove('active');
    bd.style.display = 'none';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    popups.forEach((p, i) => {
      if (p.classList.contains('active')) {
        p.classList.remove('active');
        backdrops[i].style.display = 'none';
      }
    });
  }
});

window.addEventListener('pageshow', () => {
  redirectOverlay.style.display = 'none';
});
const confettiScript = document.createElement('script');
confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
document.head.appendChild(confettiScript);
document.getElementById('username').addEventListener('input', (e) => {
  let val = e.target.value.replace(/@/g, '');
  if (val) {
    e.target.value = '@' + val;
  } else {
    e.target.value = '';
  }
});