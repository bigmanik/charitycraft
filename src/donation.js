// donation.js
// Handles all interactivity for the Charitycraft donation page:
// - switching between BTC / USDT / Cash App
// - generating the QR code for the active method
// - copy-to-clipboard for the address/handle
// - rendering the numbered instruction steps per method
//
// Replace the placeholder values in DONATION_METHODS with your real
// wallet addresses / cashtag before deploying.
import QRCode from "qrcode";

const DONATION_METHODS = {
  btc: {
    label: "BTC",
    qrValue: "bitcoin:bc1qaje7sgwjwxp4m5rm6qgcchauzz203l7jyufpsk",
    address: "bc1qaje7sgwjwxp4m5rm6qgcchauzz203l7jyufpsk",
    steps: [
      "Network: Bitcoin Mainnet (BTC)",
      "Min. amount: 0.0001 BTC",
      "Wait for 2 confirmations (~20 min)",
    ],
  },
  usdt: {
    label: "USDT",
    qrValue: "THaFizP6UQHK8VcfZcW97aqv2AAsR96fLp",
    address: "THaFizP6UQHK8VcfZcW97aqv2AAsR96fLp",
    steps: [
      "Network: TRC20 (Tron)",
      "Min. amount: 5 USDT",
      "Wait for 1 confirmation (~2 min)",
    ],
  },
  // cashapp: {
  //   label: "Cash App",
  //   qrValue: "https://cash.app/$Charitycraft",
  //   address: "$Charitycraft",
  //   steps: [
  //     "Open Cash App and scan or tap the link",
  //     "Min. amount: $5",
  //     "Funds arrive instantly",
  //   ],
  // },
};

const tabs = document.querySelectorAll(".method-tab");
const addressDisplay = document.getElementById("address-display");
const stepsList = document.getElementById("steps-list");
const copyBtn = document.getElementById("copy-btn");
const copyLabel = document.getElementById("copy-label");
const qrCanvas = document.getElementById("qr-canvas");

let activeMethod = "btc";
let copyResetTimer = null;

function setActiveTabStyles() {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.method === activeMethod;
    tab.setAttribute("aria-selected", String(isActive));
    tab.classList.toggle("bg-white/10", isActive);
    tab.classList.toggle("text-white", isActive);
    tab.classList.toggle("text-gray-500", !isActive);
    tab.classList.toggle("hover:text-gray-300", !isActive);
  });
}

function renderSteps(steps) {
  stepsList.innerHTML = "";
  steps.forEach((text, i) => {
    const li = document.createElement("li");
    li.className = "flex items-start gap-3";
    li.innerHTML = `
      <span class="flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-white/10 text-[11px] font-semibold text-gray-300 mt-0.5">
        ${i + 1}
      </span>
      <span>${text}</span>
    `;
    stepsList.appendChild(li);
  });
}

function renderQr(value) {
  QRCode.toCanvas(
    qrCanvas,
    value,
    {
      width: 220,
      margin: 1,
      color: {
        dark: "#000000ff",
        light: "#ffffffff",
      },
    },
    (error) => {
      if (error) console.error("QR generation failed:", error);
    }
  );
}

function setActiveMethod(method) {
  const data = DONATION_METHODS[method];
  if (!data) return;

  activeMethod = method;
  setActiveTabStyles();
  addressDisplay.textContent = data.address;
  addressDisplay.title = data.address;
  renderSteps(data.steps);
  renderQr(data.qrValue);

  // reset any pending "Copied!" label back to "Copy" on method switch
  copyLabel.textContent = "Copy";
  if (copyResetTimer) clearTimeout(copyResetTimer);
}

async function copyAddress() {
  const { address } = DONATION_METHODS[activeMethod];
  try {
    await navigator.clipboard.writeText(address);
  } catch (err) {
    // fallback for browsers without async clipboard support
    const tempInput = document.createElement("textarea");
    tempInput.value = address;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }

  copyLabel.textContent = "Copied!";
  if (copyResetTimer) clearTimeout(copyResetTimer);
  copyResetTimer = setTimeout(() => {
    copyLabel.textContent = "Copy";
  }, 2000);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveMethod(tab.dataset.method));
});

copyBtn.addEventListener("click", copyAddress);

// initial render
setActiveMethod(activeMethod);

//floating button 
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});