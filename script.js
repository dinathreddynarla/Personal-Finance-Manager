let description = document.getElementsByClassName("description")[0];
let amount = document.getElementsByClassName("amount")[0];
let type = document.getElementById("type");
let table = document.getElementById("table");
let addbtn = document.getElementById("add");
let emptyImg = document.getElementById("empty-img");

let data = JSON.parse(localStorage.getItem("transactions")) || [];

window.onload = function() {
    data.forEach(entry => addTransaction(entry, false));
    updateBalance();
};

addbtn.addEventListener("click", () => {
    if (description.value === "" || amount.value === "") {
        alert("Please fill in both description and amount.");
        return;
    }

    let entry = {
        description: description.value,
        type: type.value,
        amount: Number(amount.value)
    };

    addTransaction(entry, true);
    description.value = "";
    amount.value = "";
});

function addTransaction(entry, saveToStorage = true) {
    let tr = document.createElement("tr");
    let del = document.createElement("button");
    del.innerText = "delete";

    tr.innerHTML = `<td>${entry.description}</td>
                    <td>₹${entry.amount}</td>
                    <td>${entry.type}</td>
                    <td></td>`;

    del.addEventListener("click", () => {
        let index = data.indexOf(entry);
        if (index > -1) {
            data.splice(index, 1);
        }
        updateBalance();
        table.removeChild(tr);
        localStorage.setItem("transactions", JSON.stringify(data));
    });

    let actionCell = tr.lastElementChild;
    actionCell.appendChild(del);
    table.appendChild(tr);

    if (saveToStorage) {
        data.push(entry);
        localStorage.setItem("transactions", JSON.stringify(data));
    }

    updateBalance();
}

function updateBalance() {
    let balance = data.reduce((acc, entry) => {
        return entry.type === "Income" ? acc + entry.amount : acc - entry.amount;
    }, 0);

    document.getElementById("balance").innerText = balance;
    data.length > 0 ? emptyImg.style.display = "none" : emptyImg.style.display = "block";
}

document.getElementById("pdf-btn").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Personal Finance Tracker", 10, 10);
    doc.text(`Balance:`, 10, 20);
    doc.setFont(undefined, 'bold');
    doc.text(`${document.getElementById("balance").innerText}`, 40, 20);
    let rowIndex = 30;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Description", 10, rowIndex);
    doc.text("Amount", 60, rowIndex);
    doc.text("Type", 110, rowIndex);
    rowIndex += 10;

    doc.setFont(undefined, 'normal');

    data.forEach((entry) => {
        doc.text(entry.description, 10, rowIndex);
        doc.text(String(entry.amount), 60, rowIndex);
        doc.text(entry.type, 110, rowIndex);
        rowIndex += 10;
    });

    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const signatureY = pageHeight - margin;

    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.text("Dinath Reddy", 10, signatureY);

    doc.save("PersonalFinanceTracker.pdf");
});
