(function () {
  if (window.self !== window.top) return;
  if (window.__chatWidgetLoaded) return;
  window.__chatWidgetLoaded = true;

  function createWidget() {
    const clientId = document.currentScript?.getAttribute("data-client-id") || "default";
    const chatURL = `${window.location.origin}/chat?client_id=${clientId}`;

    const style = document.createElement("style");
    style.textContent = `
      .ai-chat-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 64px;
        height: 64px;
        border: none;
        border-radius: 50%;
        background: url("/mira.png") center center / cover no-repeat, #2563eb;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        z-index: 9999;
        transition: transform 0.2s ease, box-shadow 0.3s ease;
      }

      .ai-chat-button:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
      }

      .ai-chat-button::after {
        content: "";
        position: absolute;
        top: 6px;
        right: 6px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border: 2px solid white;
        border-radius: 50%;
      }

      .ai-chat-label {
        position: fixed;
        bottom: 92px;
        right: 24px;
        background: #1e40af;
        color: white;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 14px;
        font-family: sans-serif;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 9999;
        pointer-events: none;
      }

      .ai-chat-iframe {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 360px;
        height: 500px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        display: none;
        z-index: 9998;
      }

.ai-chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 72px;
  height: 72px;
  border: none;
  border-radius: 50%;
  background: url("/mira.png") center center / cover no-repeat, #2563eb;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  z-index: 9999;
  animation: pulse 2.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.6);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
  }
}

.ai-chat-button::after {
  content: "";
  position: absolute;
  top: 6px;
  right: 6px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.ai-chat-label {
  position: fixed;
  bottom: 100px;
  right: 100px;
  background: #1d4ed8;
  color: white;
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 16px;
  font-family: 'Segoe UI', sans-serif;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  z-index: 9999;
  transform: translateX(50%);
}

.ai-chat-label::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 20px;
  margin-left: -6px;
  border-width: 6px;
  border-style: solid;
  border-color: #1d4ed8 transparent transparent transparent;
}
.ai-chat-label {
  position: fixed;
  bottom: 100px;
  right: 90px;
  background: #2563eb;
  color: white;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Segoe UI', sans-serif;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  z-index: 9999;
  animation: fadein 0.6s ease;
}

.ai-chat-label::after {
  content: "";
  position: absolute;
  bottom: -6px;
  right: 12px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-top-color: #2563eb;
  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2));
}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


    `;
    document.head.appendChild(style);

    const iframe = document.createElement("iframe");
    iframe.src = chatURL;
    iframe.className = "ai-chat-iframe";
    document.body.appendChild(iframe);

    const button = document.createElement("button");
    button.className = "ai-chat-button";
    button.onclick = () => {
      const isOpen = iframe.style.display === "block";
      iframe.style.display = isOpen ? "none" : "block";
      label.style.display = isOpen ? "block" : "none";
    };
    document.body.appendChild(button);

    const label = document.createElement("div");
    label.className = "ai-chat-label";
    label.innerText = "Need Help ? Ask Mira";
    document.body.appendChild(label);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
