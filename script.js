document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const tableBody = document.querySelector("tbody");
    const tableWrapper = document.querySelector(".table-wrapper");

    // Input elements (by ID)
    const nameInput = document.getElementById("studentName");
    const idInput = document.getElementById("studentId");
    const emailInput = document.getElementById("email");
    const contactInput = document.getElementById("contact");

    let students = JSON.parse(localStorage.getItem("students")) || [];
    let editIndex = null;

    // Initial render
    renderTable();

    /* ================= LIVE INPUT RESTRICTIONS ================= */

    // Student Name → ONLY alphabets
    nameInput.addEventListener("input", () => {
        nameInput.value = nameInput.value.replace(/[^A-Za-z ]/g, "");
    });

    // Student ID → ONLY numbers
    idInput.addEventListener("input", () => {
        idInput.value = idInput.value.replace(/[^0-9]/g, "");
    });

    // Contact → ONLY numbers, MAX 10 digits
    contactInput.addEventListener("input", () => {
        contactInput.value = contactInput.value
            .replace(/[^0-9]/g, "")
            .slice(0, 10);
    });

    /* ================= FORM SUBMIT ================= */

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const studentId = idInput.value.trim();
        const email = emailInput.value.trim();
        const contact = contactInput.value.trim();

        // ❌ Empty row not allowed
        if (!name || !studentId || !email || !contact) {
            alert("All fields are required.");
            return;
        }

        // ❌ Email validation (STRICT & CORRECT)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email format. Example: name@gmail.com");
            return;
        }

        // ❌ Contact must be EXACTLY 10 digits
        if (contact.length !== 10) {
            alert("Contact number must be exactly 10 digits.");
            return;
        }

        const student = { name, studentId, email, contact };

        // Add or Edit
        if (editIndex === null) {
            students.push(student);
        } else {
            students[editIndex] = student;
            editIndex = null;
        }

        localStorage.setItem("students", JSON.stringify(students));
        form.reset();
        renderTable();
    });

    /* ================= TABLE RENDER ================= */

    function renderTable() {
        tableBody.innerHTML = "";

        students.forEach((s, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${s.name}</td>
                <td>${s.studentId}</td>
                <td>${s.email}</td>
                <td>${s.contact}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            row.querySelector(".edit").onclick = () => editStudent(index);
            row.querySelector(".delete").onclick = () => deleteStudent(index);

            tableBody.appendChild(row);
        });

        // ✅ Dynamic vertical scrollbar using JavaScript
        tableWrapper.style.maxHeight = "250px";
        tableWrapper.style.overflowY = students.length > 3 ? "auto" : "hidden";
    }

    /* ================= EDIT ================= */

    function editStudent(index) {
        const s = students[index];
        nameInput.value = s.name;
        idInput.value = s.studentId;
        emailInput.value = s.email;
        contactInput.value = s.contact;
        editIndex = index;
    }

    /* ================= DELETE ================= */

    function deleteStudent(index) {
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        renderTable();
    }
});
