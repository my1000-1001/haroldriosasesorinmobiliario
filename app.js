// Datos de las propiedades del asesor Harold Ríos
const propertiesData = {
    "150000_PEN_160_Terreno Residencial 160m²": {
        price: 150000,
        currency: "S/",
        area: 160,
        name: "Terreno Residencial 160m² cerca al Parque Bicentenario"
    },
    "2720511_USD_18136.74_Terreno Industrial 18,136m²": {
        price: 2720511,
        currency: "USD",
        area: 18136.74,
        name: "Terreno Industrial 18,136.74m² (ZRE)"
    }
};

// Referencias del DOM
const themeToggle = document.getElementById("themeToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

const calcPropSelect = document.getElementById("calcPropSelect");
const calcPrice = document.getElementById("calcPrice");
const calcCurrency = document.getElementById("calcCurrency");
const calcArea = document.getElementById("calcArea");
const calcDownPaymentRange = document.getElementById("calcDownPaymentRange");
const calcInterest = document.getElementById("calcInterest");
const calcTerm = document.getElementById("calcTerm");

const pricePrefix = document.getElementById("pricePrefix");
const downPaymentPercentLabel = document.getElementById("downPaymentPercentLabel");
const downPaymentValueLabel = document.getElementById("downPaymentValueLabel");

const resMonthlyPayment = document.getElementById("resMonthlyPayment");
const resCostM2 = document.getElementById("resCostM2");
const resDownPayment = document.getElementById("resDownPayment");
const resLoanAmount = document.getElementById("resLoanAmount");
const resTermMonths = document.getElementById("resTermMonths");
const calcWhatsappLink = document.getElementById("calcWhatsappLink");

const leadForm = document.getElementById("leadForm");

// ----------------------------------------------------
// 1. Alternador de Tema (Claro / Oscuro)
// ----------------------------------------------------
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const icon = themeToggle.querySelector("i");
    if (document.body.classList.contains("dark-theme")) {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
});

// ----------------------------------------------------
// 2. Menú de Navegación Móvil
// ----------------------------------------------------
mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = mobileMenuBtn.querySelector("i");
    if (navMenu.classList.contains("active")) {
        icon.className = "fa-solid fa-xmark";
    } else {
        icon.className = "fa-solid fa-bars";
    }
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        mobileMenuBtn.querySelector("i").className = "fa-solid fa-bars";
    });
});

// ----------------------------------------------------
// 3. Lógica de la Calculadora Financiera
// ----------------------------------------------------

// Formateador de números en moneda peruana/dólares
function formatCurrency(amount, currencySymbol) {
    const formatted = parseFloat(amount).toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `${currencySymbol} ${formatted}`;
}

// Calcular resultados financieros de la calculadora
function updateCalculations() {
    const price = parseFloat(calcPrice.value) || 0;
    const currency = calcCurrency.value === "USD" ? "$" : "S/";
    const area = parseFloat(calcArea.value) || 1;
    const downPaymentPercent = parseInt(calcDownPaymentRange.value) || 20;
    const annualInterestRate = parseFloat(calcInterest.value) || 0;
    const termYears = parseInt(calcTerm.value) || 15;

    // Actualizar etiquetas de cuota inicial
    downPaymentPercentLabel.textContent = downPaymentPercent;
    const downPaymentAmount = price * (downPaymentPercent / 100);
    downPaymentValueLabel.textContent = formatCurrency(downPaymentAmount, currency);

    // Costo por m²
    const costPerM2 = price / area;
    resCostM2.textContent = `${formatCurrency(costPerM2, currency)} / m²`;

    // Monto del préstamo
    const loanAmount = price - downPaymentAmount;
    resDownPayment.textContent = formatCurrency(downPaymentAmount, currency);
    resLoanAmount.textContent = formatCurrency(loanAmount, currency);

    // Meses
    const totalMonths = termYears * 12;
    resTermMonths.textContent = `${totalMonths} meses (${termYears} años)`;

    // Calcular cuota mensual usando fórmula de amortización francesa:
    // M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    let monthlyPayment = 0;
    if (loanAmount > 0) {
        if (annualInterestRate > 0) {
            const monthlyInterestRate = (annualInterestRate / 100) / 12;
            const tempVal = Math.pow(1 + monthlyInterestRate, totalMonths);
            monthlyPayment = loanAmount * (monthlyInterestRate * tempVal) / (tempVal - 1);
        } else {
            monthlyPayment = loanAmount / totalMonths;
        }
    }

    resMonthlyPayment.textContent = formatCurrency(monthlyPayment, currency);

    // Generar enlace dinámico de WhatsApp para la calculadora
    const whatsappNumber = "51956297219";
    const selectedPropOption = calcPropSelect.options[calcPropSelect.selectedIndex];
    const propertyLabel = selectedPropOption.value === "manual" ? "Cálculo Personalizado" : selectedPropOption.text;
    
    const messageText = `Hola Harold, acabo de usar tu calculadora web para el terreno: "${propertyLabel}".\n\n` +
        `*Detalles del Presupuesto:*\n` +
        `- Precio total: ${formatCurrency(price, currency)}\n` +
        `- Área: ${area} m²\n` +
        `- Costo por m²: ${formatCurrency(costPerM2, currency)}/m²\n` +
        `- Cuota inicial (${downPaymentPercent}%): ${formatCurrency(downPaymentAmount, currency)}\n` +
        `- Préstamo solicitado: ${formatCurrency(loanAmount, currency)}\n` +
        `- Plazo: ${termYears} años (${totalMonths} meses)\n` +
        `- *Cuota mensual estimada: ${formatCurrency(monthlyPayment, currency)}*\n\n` +
        `Quisiera que me asesores con las opciones de financiamiento para este terreno.`;

    calcWhatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
}

// Al seleccionar una propiedad de la lista predefinida
calcPropSelect.addEventListener("change", () => {
    const val = calcPropSelect.value;
    if (val !== "manual") {
        const prop = propertiesData[val];
        calcPrice.value = prop.price;
        calcCurrency.value = prop.currency === "USD" ? "USD" : "S/";
        calcArea.value = prop.area;
        pricePrefix.textContent = prop.currency === "USD" ? "$" : "S/";
    }
    updateCalculations();
});

// Eventos de cambios en controles de la calculadora
calcPrice.addEventListener("input", () => {
    calcPropSelect.value = "manual";
    updateCalculations();
});
calcArea.addEventListener("input", () => {
    calcPropSelect.value = "manual";
    updateCalculations();
});
calcCurrency.addEventListener("change", () => {
    pricePrefix.textContent = calcCurrency.value === "USD" ? "$" : "S/";
    calcPropSelect.value = "manual";
    updateCalculations();
});
calcDownPaymentRange.addEventListener("input", updateCalculations);
calcInterest.addEventListener("input", updateCalculations);
calcTerm.addEventListener("change", updateCalculations);

// Función que se llama desde los botones "Calcular Cuotas" en las tarjetas de propiedades
function selectForCalculator(price, currency, area, optionNamePart) {
    // Buscar la opción correcta en el selector de propiedades
    for (let i = 0; i < calcPropSelect.options.length; i++) {
        const optionValue = calcPropSelect.options[i].value;
        if (optionValue.includes(optionNamePart) || optionValue.includes(price.toString())) {
            calcPropSelect.selectedIndex = i;
            break;
        }
    }
    
    // Configurar valores
    calcPrice.value = price;
    calcCurrency.value = currency === "USD" ? "USD" : "S/";
    pricePrefix.textContent = currency === "USD" ? "$" : "S/";
    calcArea.value = area;
    
    // Forzar actualización y hacer scroll a la sección
    updateCalculations();
    document.getElementById("calculadora").scrollIntoView({ behavior: 'smooth' });
}

// ----------------------------------------------------
// 4. Formulario de Captación (Lead)
// ----------------------------------------------------
leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("leadName").value;
    const phone = document.getElementById("leadPhone").value;
    const type = document.getElementById("leadType").value;
    const area = document.getElementById("leadArea").value;
    const location = document.getElementById("leadLocation").value;
    const userMessage = document.getElementById("leadMessage").value || "Sin comentarios adicionales";

    const whatsappNumber = "51956297219";
    const leadMessageText = `Hola Harold Ríos, te escribo desde tu página web para registrar mi terreno para una tasación gratuita.\n\n` +
        `*Mis Datos:*\n` +
        `- *Propietario:* ${name}\n` +
        `- *Celular:* ${phone}\n\n` +
        `*Datos del Terreno:*\n` +
        `- *Tipo:* Terreno ${type}\n` +
        `- *Área:* ${area} m²\n` +
        `- *Ubicación/Zona:* ${location}\n` +
        `- *Comentario/Estado:* ${userMessage}\n\n` +
        `Quedo a la espera de tu respuesta para coordinar una llamada.`;

    // Redirigir a WhatsApp
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(leadMessageText)}`;
    window.open(url, "_blank");
});

// Inicializar la calculadora con el terreno residencial seleccionado por defecto al cargar
window.addEventListener("DOMContentLoaded", () => {
    updateCalculations();
});
