const searchInput = document.getElementById("searchInput");
const containers = document.querySelectorAll(".product-scroll");

let typingTimer; // ⏱️ timer for delay
const delay = 680; // adjust (300–600ms is good)

containers.forEach(container => {
    let cards = Array.from(container.querySelectorAll(".card"));

    cards.forEach((card, index) => {
        card.dataset.index = index;
    });
});

function similarity(a, b) {
    let longer = a.length > b.length ? a : b;
    let shorter = a.length > b.length ? b : a;

    let matches = 0;

    for (let i = 0; i < shorter.length; i++) {
        if (longer[i] === shorter[i]) matches++;
    }

    return matches / longer.length;
}

function runSearch() {
    let filter = searchInput.value.toLowerCase().trim();

    containers.forEach(container => {
        let cards = Array.from(container.querySelectorAll(".card"));
        let firstMatch = null;

        cards.forEach(card => {
            let id = (card.dataset.id || "").toLowerCase().trim();

            if (filter === "") {
                card.classList.remove("fade");
                card.dataset.match = "0";
            } else {
                let matchScore = similarity(filter, id);
                let isMatch = matchScore > 0.5 || id.includes(filter);

                card.dataset.match = isMatch ? "1" : "0";

                if (isMatch) {
                    card.classList.remove("fade");
                    if (!firstMatch) firstMatch = card;
                } else {
                    card.classList.add("fade");
                }
            }
        });

        // SORT
        if (filter === "") {
            cards.sort((a, b) => a.dataset.index - b.dataset.index);
        } else {
            cards.sort((a, b) => b.dataset.match - a.dataset.match);
        }

        cards.forEach(card => container.appendChild(card));

        // SCROLL (after delay)
        if (filter !== "" && firstMatch) {
            const yOffset = -120;
            const y = firstMatch.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({
                top: y,
                behavior: "smooth"
            });
        }
    });
}

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        clearTimeout(typingTimer);

        typingTimer = setTimeout(() => {
            runSearch();
        }, delay);
    });
}

// ================= CART =================
// CART PAGE ONLY (safe check)
//Account
// ================= LOGIN SYSTEM =================
let currentUserEmail = "";
let isLoggedIn = false;

// SIGNUP
function shopSignup() {

    let name = document.getElementById("shopFullName").value;
    let email = document.getElementById("shopEmail").value;
    let address = document.getElementById("shopAddress").value;
    let contact = document.getElementById("shopContact").value;
    let pass = document.getElementById("shopPassword").value;

    // EMPTY CHECK
    if (!name || !email || !address || !contact || !pass) {
        alert("Fill all fields");
        return;
    }

    // EMAIL VALIDATION
    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email");
        return;
    }

    // CONTACT NUMBER VALIDATION
    if (isNaN(contact)) {
        alert("Contact number must contain numbers only");
        return;
    }

    // CONTACT LENGTH CHECK
    if (contact.length < 11) {
        alert("Contact number must be 11 digits");
        return;
    }

    let user = {
        name,
        email,
        address,
        contact,
        pass
    };

    localStorage.setItem(email, JSON.stringify(user));

    alert("Account created!");
    showShopLogin();
}
// LOGIN
function shopLogin() {

    let email = document.getElementById("shopLoginEmail").value;
    let pass = document.getElementById("shopLoginPassword").value;

    // EMAIL VALIDATION
    if (!email.includes("@") || !email.includes(".")) {
        alert("Invalid email format");
        return;
    }

    let data = localStorage.getItem(email);

    if (!data) {
        alert("No account found");
        return;
    }

    let user = JSON.parse(data);

    if (user.pass === pass) {

        currentUserEmail = email;
        isLoggedIn = true;

        document.querySelector(".shop-auth-wrapper").style.display = "none";
        document.getElementById("shopHome").style.display = "block";

        document.getElementById("shopUserData").innerText =
        `Name: ${user.name}
Email: ${user.email}
Address: ${user.address}
Contact: ${user.contact}`;

    } else {
        alert("Wrong password");
    }
}

// LOGOUT
function shopLogout() {
    isLoggedIn = false;
    currentUserEmail = "";
    location.reload();
}

// SWITCH FORMS
function showShopSignup() {
    document.getElementById("shopLoginCard").style.display = "none";
    document.getElementById("shopSignupCard").style.display = "block";
}

function showShopLogin() {
    document.getElementById("shopSignupCard").style.display = "none";
    document.getElementById("shopLoginCard").style.display = "block";
}

// ================= PROFILE EDIT =================
function openEditProfile() {

    let user = JSON.parse(localStorage.getItem(currentUserEmail));

    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editAddress").value = user.address;
    document.getElementById("editContact").value = user.contact;
    document.getElementById("editPassword").value = user.pass;

    document.getElementById("shopEditBox").style.display = "flex";
}

function closeEditProfile() {
    document.getElementById("shopEditBox").style.display = "none";
}

function saveProfile() {

    let updated = {
        name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        address: document.getElementById("editAddress").value,
        contact: document.getElementById("editContact").value,
        pass: document.getElementById("editPassword").value
    };

    localStorage.removeItem(currentUserEmail);
    localStorage.setItem(updated.email, JSON.stringify(updated));

    currentUserEmail = updated.email;

    document.getElementById("shopUserData").innerText =
        `Name: ${updated.name}\nEmail: ${updated.email}\nAddress: ${updated.address}\nContact: ${updated.contact}`;

    closeEditProfile();

    alert("Profile updated!");
}
// LOGIN PASSWORD
function toggleLoginPassword() {

    let pass = document.getElementById("shopLoginPassword");

    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}

// SIGNUP PASSWORD
function toggleSignupPassword() {

    let pass = document.getElementById("shopPassword");

    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}

// EDIT PASSWORD
function toggleEditPassword() {

    let pass = document.getElementById("editPassword");

    if (pass.type === "password") {
        pass.type = "text";
    } else {
        pass.type = "password";
    }
}
// ================= ADD TO CART =================
function addToCart(name, price, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        name,
        price,
        image,
        quantity: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart!");
    window.location.href = "cart.html";
}

// ================= CART SYSTEM =================
let cartContainer = document.getElementById("cart-items");

if (cartContainer) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        cartContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {

            total += item.price * item.quantity;

            cartContainer.innerHTML += `
            <div class="cart-card">

                <img src="${item.image}" class="cart-img">

                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>₱${item.price}</p>
                </div>

                <div class="cart-actions">

                    <button onclick="decreaseQty(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQty(${index})">+</button>

                    <button onclick="removeItem(${index})">Remove</button>

                </div>

            </div>
            `;
        });

        document.getElementById("total").innerText = "Total: ₱" + total;
    }

    function increaseQty(index) {
        cart[index].quantity++;
        updateCart();
    }

    function decreaseQty(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        }
        updateCart();
    }

    function removeItem(index) {
        cart.splice(index, 1);
        updateCart();
    }

    function updateCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    // ================= PLACE ORDER (LOGIN REQUIRED) =================
    function placeOrder() {

        if (!isLoggedIn) {
            alert("You must be logged in before placing order!");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        alert("Thank you for your order 💐");

        localStorage.removeItem("cart");
        location.reload();
    }

    renderCart();
}