let description = document.getElementsByClassName("description")[0];
        let amount = document.getElementsByClassName("amount")[0];
        let type = document.getElementById("type");
        let table = document.getElementById("table");
        let addbtn = document.getElementById("add");
        let emptyImg = document.getElementById("empty-img"); // Image element
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
                            <td>${entry.type}</td>`;
            
            del.addEventListener("click", () => {
                let index = data.indexOf(entry);
                if (index > -1) {
                    data.splice(index, 1);
                }
                updateBalance();
                table.removeChild(tr);
                localStorage.setItem("transactions", JSON.stringify(data));
            });

            tr.appendChild(del);
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

            data.length > 0 ? emptyImg.style.display="none" : emptyImg.style.display="block";
        }

        document.getElementById("download-pdf").addEventListener("click", () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.text("Personal Expense Tracker", 20, 10);

            doc.autoTable({
                head: [['Description', 'Amount', 'Type']],
                body: data.map(item => [item.description, `₹${item.amount}`, item.type])
            });

            doc.save("expense_tracker.pdf");
        });
