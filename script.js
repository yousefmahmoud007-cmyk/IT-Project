// Variables
let cart = JSON.parse(localStorage.getItem('my_cart')) || []; 
const inputIds = ['fname', 'lname', 'email', 'phone', 'govs', 'address', 'floorNum', 'apartNum', 'addressLabel', 'deliveryInst']; 

// UI
function updateUI() { 
    const cartItems = document.getElementById('cartItems'); 
    const cartTotal = document.getElementById('cartTotal'); 
    const cartCount = document.getElementById('cartCount'); 
    
    if (!cartItems) return; 
    
    cartItems.innerHTML = ''; 
    let total = 0; 
    let count = 0; 

    cart.forEach(item => { 
        const li = document.createElement('li'); 
        li.innerHTML = ` <span>${item.name} (x${item.quantity}) <span>${item.price * item.quantity} EGP</span></span> <button class="remove-btn" data-id="${item.id}" title="Remove Item">✖</button> `; 
        cartItems.appendChild(li); 
        total += item.price * item.quantity; 
        count += item.quantity; 
    }); 

    if (cartTotal) cartTotal.innerText = total; 
    if (cartCount) cartCount.innerText = count; 
    localStorage.setItem('my_cart', JSON.stringify(cart)); 
} 

// Theme
window.toggleTheme = function () { 
    const isDark = document.body.classList.toggle('dark'); 
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); 
    
    const logo = document.getElementById("logo");
    if(logo) logo.src = isDark ? "images/logo_dark.png" : "images/logo_light.jpeg"; 
    
    const btn = document.querySelector('.theme-btn'); 
    if (btn) { btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>'; } 
}; 

// Delivery errors
function showErrorDelivery(inputElement, message) { 
    clearErrorDelivery(inputElement); 
    inputElement.classList.add('error-border'); 
    const errorDiv = document.createElement('span'); 
    errorDiv.className = 'error-message'; 
    errorDiv.innerText = message; 
    inputElement.parentElement.appendChild(errorDiv); 
} 

function clearErrorDelivery(inputElement) { 
    inputElement.classList.remove('error-border'); 
    const parent = inputElement.parentElement; 
    const existingError = parent.querySelector('.error-message'); 
    if (existingError) { existingError.remove(); } 
}

// Form errors
function showError(input, message) { 
    input.style.borderColor = '#e03e3e'; 
    const err = document.createElement('span'); 
    err.className = 'form-error'; 
    err.textContent = message; 
    input.parentNode.appendChild(err); 
} 

function clearErrors(form) { 
    form.querySelectorAll('.form-error').forEach(el => el.remove()); 
    form.querySelectorAll('input, textarea, select').forEach(el => { el.style.borderColor = ''; }); 
}

// Contact
function showToast(event) { 
    event.preventDefault(); 
    const form = event.target; 
    const nameInput = form.querySelector('input[type="text"]'); 
    const emailInput = form.querySelector('input[type="email"]'); 
    const subjectInput = form.querySelector('input[placeholder="What\'s this about?"]'); 
    const msgInput = form.querySelector('textarea'); 
    
    const name = nameInput.value.trim(); 
    const email = emailInput.value.trim(); 
    const subject = subjectInput ? subjectInput.value.trim() : ''; 
    const msg = msgInput.value.trim(); 
    
    clearErrors(form); 
    let valid = true; 
    
    if (name.length < 2) { showError(nameInput, 'Name must be at least 2 characters.'); valid = false; } 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(emailInput, 'Please enter a valid email address.'); valid = false; } 
    if (subjectInput && subject.length < 3) { showError(subjectInput, 'Subject must be at least 3 characters.'); valid = false; } 
    if (msg.length < 10) { showError(msgInput, 'Message must be at least 10 characters.'); valid = false; } 
    
    if (!valid) return; 
    
    localStorage.setItem('lastContactName', name); 
    sessionStorage.removeItem('contact_subject'); 
    
    const toast = document.getElementById('toastContact'); 
    if (!toast) return; 
    toast.classList.add('show'); 
    setTimeout(() => toast.classList.remove('show'), 3000); 
    form.reset(); 
} 

// Session
function saveToSession() { 
    const form = document.querySelector('.form-container'); 
    if (!form || !form.reportValidity()) { return; } 

    const customErrors = form.querySelectorAll('.error-message'); 
    if (customErrors.length > 0) { 
        customErrors[0].parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
        return; 
    } 

    inputIds.forEach(id => { 
        const inputElement = document.getElementById(id); 
        if (inputElement) { sessionStorage.setItem(id, inputElement.value); } 
    }); 

    const toast = document.getElementById("toastDelivery"); 
    if (toast) {
        toast.classList.add("show"); 
        setTimeout(() => { toast.classList.remove("show"); }, 3000); 
    }
} 

// Load
window.onload = () => { 
    inputIds.forEach(id => { 
        const savedValue = sessionStorage.getItem(id); 
        if (savedValue) { 
            const el = document.getElementById(id);
            if (el) el.value = savedValue; 
        } 
    }); 
}; 

// DOM
document.addEventListener('DOMContentLoaded', () => { 
    
    // Theme
    if (localStorage.getItem('theme') === 'dark') { 
        document.body.classList.add('dark'); 
        const logo = document.getElementById("logo");
        if(logo) logo.src = "images/logo_dark.png"; 
        const btn = document.querySelector('.theme-btn'); 
        if (btn) { btn.innerHTML = '<i class="fa-solid fa-sun"></i>'; } 
    } 

    // UI
    updateUI();

    // Nav
    const navOverlay = document.getElementById('navOverlay'); 
    const closeNavBtn = document.getElementById('closeNavBtn'); 
    
    window.openNavMenu = () => { if (navOverlay) navOverlay.classList.add('active'); }; 
    window.closeNavMenu = () => { if (navOverlay) navOverlay.classList.remove('active'); }; 
    
    if (closeNavBtn) { closeNavBtn.addEventListener('click', window.closeNavMenu); } 
    if (navOverlay) { navOverlay.addEventListener('click', (e) => { if (e.target === navOverlay) window.closeNavMenu(); }); } 
    
    // Cart Panel
    const cartOverlay = document.getElementById('cartOverlay'); 
    const closeCartBtn = document.getElementById('closeCartBtn'); 
    
    window.openCartMenu = () => { if (cartOverlay) cartOverlay.classList.add('active'); }; 
    window.closeCartMenu = () => { if (cartOverlay) cartOverlay.classList.remove('active'); }; 
    
    if (closeCartBtn) { closeCartBtn.addEventListener('click', window.closeCartMenu); } 
    if (cartOverlay) { cartOverlay.addEventListener('click', (e) => { if (e.target === cartOverlay) window.closeCartMenu(); }); } 
    
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') { window.closeNavMenu(); window.closeCartMenu(); } 
    }); 

    // Cart logic
    document.querySelectorAll('.add-to-cart').forEach(button => { 
        button.addEventListener('click', () => { 
            const parent = button.parentElement; 
            const id = parent.getAttribute('data-id'); 
            const name = parent.getAttribute('data-name'); 
            const price = parseInt(parent.getAttribute('data-price')); 
            
            const existingItem = cart.find(item => item.id === id); 
            if (existingItem) { 
                existingItem.quantity++; 
            } else { 
                cart.push({ id, name, price, quantity: 1 }); 
            } 
            updateUI(); 
        }); 
    }); 

    const cartItemsList = document.getElementById('cartItems');
    if (cartItemsList) {
        cartItemsList.addEventListener('click', (event) => { 
            if (event.target.classList.contains('remove-btn')) { 
                const idToRemove = event.target.getAttribute('data-id'); 
                cart = cart.filter(item => item.id !== idToRemove); 
                updateUI(); 
            } 
        }); 
    }

    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.onclick = () => { 
            cart = []; 
            updateUI(); 
        }; 
    }

    // Orders
    const allOrderBtns = document.querySelectorAll('.take-to-menu'); 
    allOrderBtns.forEach((btn) => { 
        btn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            window.location.href = 'menu.html'; 
        }); 
    }); 

    // Search
    const searchInput = document.getElementById('menuSearchInput'); 
    if (searchInput) { 
        searchInput.addEventListener('input', function () { 
            const query = this.value.trim().toLowerCase(); 
            const allSections = document.querySelectorAll('.one, .two'); 
            const tableSection = document.querySelector('.price-table-section'); 
            const rows = document.querySelectorAll('.menu-price-table tbody tr'); 
            const searchTitle = document.getElementById('searchResultsTitle'); 
            
            const resetRows = () => rows.forEach(row => { 
                row.style.display = ''; 
                row.classList.remove('row-highlight'); 
                row.querySelectorAll('td').forEach(td => { 
                    td.innerHTML = td.innerHTML.replace(/<mark class="search-mark">([^<]*)<\/mark>/gi, '$1'); 
                }); 
            }); 
            
            if (!query) { 
                allSections.forEach(s => s.style.display = ''); 
                if (tableSection) tableSection.style.display = ''; 
                resetRows(); 
                if (searchTitle) searchTitle.style.display = 'none'; 
                return; 
            } 
            
            allSections.forEach(s => s.style.display = 'none'); 
            if (tableSection) tableSection.style.display = ''; 
            resetRows(); 
            
            let matchCount = 0; 
            rows.forEach(row => { 
                const cells = row.querySelectorAll('td'); 
                const itemCell = cells.length >= 4 ? cells[1] : cells[0]; 
                if (!itemCell) { row.style.display = 'none'; return; } 
                
                const itemText = itemCell.textContent.toLowerCase(); 
                if (itemText.startsWith(query)) { 
                    row.classList.add('row-highlight'); 
                    matchCount++; 
                    const original = itemCell.textContent; 
                    const idx = original.toLowerCase().indexOf(query); 
                    if (idx !== -1) { 
                        itemCell.innerHTML = original.slice(0, idx) + '<mark class="search-mark">' + original.slice(idx, idx + query.length) + '</mark>' + original.slice(idx + query.length); 
                    } 
                } else { row.style.display = 'none'; } 
            }); 
            
            if (searchTitle) { 
                searchTitle.style.display = ''; 
                searchTitle.innerHTML = matchCount > 0 ? '<i class="fa-solid fa-magnifying-glass"></i> Results for "<strong>' + this.value + '</strong>" — ' + matchCount + ' item' + (matchCount > 1 ? 's' : '') + ' found' : '<i class="fa-solid fa-circle-exclamation"></i> No results for "<strong>' + this.value + '</strong>"'; 
            } 
        }); 
    } 

    // Profile
    const profileAvatar = document.getElementById('profileAvatar'); 
    const profileName = document.getElementById('profileName'); 
    
    if (profileAvatar && profileName) { 
        const stored = sessionStorage.getItem('mb_user'); 
        const user = stored ? JSON.parse(stored) : { name: 'Guest User', email: '', phone: '', avatar: '' }; 
        
        function loadProfile() { 
            profileName.textContent = user.name || 'Good morning!'; 
            const pEmail = document.getElementById('profileEmail'); 
            const pPhone = document.getElementById('profilePhone'); 
            
            if (pEmail) pEmail.innerHTML = '<i class="fa-solid fa-envelope"></i> ' + (user.email || '—'); 
            if (pPhone) pPhone.innerHTML = '<i class="fa-solid fa-phone"></i> ' + (user.phone || '—'); 
            
            if (user.avatar) { 
                profileAvatar.style.cssText = 'background-image:' + user.avatar + ';background-size:cover;background-position:center'; 
                profileAvatar.innerHTML = ''; 
            } 
            
            const editName = document.getElementById('editName'); 
            const editEmail = document.getElementById('editEmail'); 
            const editPhone = document.getElementById('editPhone'); 
            if (editName) editName.value = user.name || ''; 
            if (editEmail) editEmail.value = user.email || ''; 
            if (editPhone) editPhone.value = user.phone || ''; 
        } 
        loadProfile(); 
        
        document.getElementById('profileAvatarInput')?.addEventListener('change', function () { 
            const file = this.files[0]; 
            if (!file) return; 
            const reader = new FileReader(); 
            reader.onload = e => { 
                profileAvatar.style.cssText = 'background-image:url(' + e.target.result + ');background-size:cover;background-position:center'; 
                profileAvatar.innerHTML = ''; 
                user.avatar = 'url(' + e.target.result + ')'; 
                sessionStorage.setItem('mb_user', JSON.stringify(user)); 
            }; 
            reader.readAsDataURL(file); 
        }); 
        
        document.getElementById('toggleEditPass')?.addEventListener('click', function () { 
            const input = document.getElementById('editPass'); 
            if(input){
                input.type = input.type === 'password' ? 'text' : 'password'; 
                this.querySelector('i').classList.toggle('fa-eye'); 
                this.querySelector('i').classList.toggle('fa-eye-slash'); 
            }
        }); 
        
        const profileForm = document.getElementById('profileForm'); 
        if (profileForm) { 
            profileForm.addEventListener('submit', function (e) { 
                e.preventDefault(); 
                document.querySelectorAll('.error, .form-error').forEach(el => el.textContent = ''); 
                let valid = true; 
                
                const name = document.getElementById('editName').value.trim(); 
                const email = document.getElementById('editEmail').value.trim(); 
                const phone = document.getElementById('editPhone').value.trim(); 
                
                if (!name) { document.getElementById('p-err-name').textContent = 'Name is required'; valid = false; } 
                if (!email || !/\S+@\S+\.\S+/.test(email)) { document.getElementById('p-err-email').textContent = 'Valid email required'; valid = false; } 
                if (!valid) return; 
                
                user.name = name; user.email = email; user.phone = phone; 
                sessionStorage.setItem('mb_user', JSON.stringify(user)); 
                loadProfile(); 
                
                const toast = document.getElementById('toastProfile'); 
                if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); } 
            }); 
        } 
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => { 
            sessionStorage.removeItem('mb_user'); window.location.href = 'sign_in.html'; 
        }); 
    } 

    // Reservation
    const reservationForm = document.getElementById('reservationForm'); 
    if (reservationForm) { 
        const savedName = localStorage.getItem('res_name'); 
        const savedEmail = localStorage.getItem('res_email'); 
        const savedPhone = localStorage.getItem('res_phone'); 
        
        if (savedName) reservationForm.querySelector('input[type="text"]').value = savedName; 
        if (savedEmail) reservationForm.querySelector('input[type="email"]').value = savedEmail; 
        if (savedPhone) reservationForm.querySelector('input[type="tel"]').value = savedPhone; 
        
        reservationForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            const nameInput = reservationForm.querySelector('input[type="text"]'); 
            const dateInput = reservationForm.querySelector('input[type="date"]'); 
            const emailInput = reservationForm.querySelector('input[type="email"]'); 
            const timeInput = reservationForm.querySelector('input[type="time"]'); 
            const phoneInput = reservationForm.querySelector('input[type="tel"]'); 
            
            const name = nameInput.value.trim(); 
            const date = dateInput.value.trim(); 
            const email = emailInput.value.trim(); 
            const time = timeInput.value.trim(); 
            const phone = phoneInput.value.trim(); 
            
            clearErrors(reservationForm); 
            let valid = true; 
            
            if (name.length < 3) { showError(nameInput, 'Name must be at least 3 characters.'); valid = false; } 
            else if (/\d/.test(name)) { showError(nameInput, 'Name must not contain numbers.'); valid = false; } 
            if (!date) { showError(dateInput, 'Please select a date.'); valid = false; } 
            else { 
                const selected = new Date(date); const today = new Date(); today.setHours(0,0,0,0); 
                if (selected < today) { showError(dateInput, 'Date must be today or in the future.'); valid = false; } 
            } 
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(emailInput, 'Please enter a valid email address.'); valid = false; } 
            if (!time) { showError(timeInput, 'Please select a time.'); valid = false; } 
            if (!/^[0-9\+\-\s]{7,15}$/.test(phone)) { showError(phoneInput, 'Phone must be 7-15 digits.'); valid = false; } 
            
            if (!valid) return; 
            
            localStorage.setItem('res_name', name); localStorage.setItem('res_email', email); localStorage.setItem('res_phone', phone); 
            const count = parseInt(sessionStorage.getItem('reservationCount') || '0') + 1; 
            sessionStorage.setItem('reservationCount', count); 
            alert('✅ Reservation confirmed! We will contact you soon.\n(Reservations this session: ' + count + ')'); 
            reservationForm.reset(); 
        }); 
    } 

    // Contact
    const contactForm = document.querySelector('.contact-form-side form'); 
    if (contactForm) { 
        const savedSubject = sessionStorage.getItem('contact_subject'); 
        const subjectInput = contactForm.querySelector('input[placeholder="What\'s this about?"]');
        if (savedSubject && subjectInput) { subjectInput.value = savedSubject; } 
        if (subjectInput) { 
            subjectInput.addEventListener('input', () => { sessionStorage.setItem('contact_subject', subjectInput.value); }); 
        } 
    } 

    // Slider
    const galleryImages = [
        "images/cheese (2).jpg", "images/cookies.jpg", 
        "images/dounts.jpg", "images/egg.jpg",
        "images/fruit salad.jpg", "images/Garden Salad.jpg", "images/Hot Chocolate .jpg", 
        "images/ice mocha.jpg", "images/LATTE.jpeg", "images/mini.jpg", 
        "images/offer 1.jpeg", "images/offer 4.jpeg", "images/Orange juice.jpg", 
        "images/pancake.jpg", "images/paste.jpg", "images/pastrami.jpg", 
        "images/plain.jpg", "images/rumi.jpg", "images/salad.jpeg", 
        "images/smoked.jpg", "images/sunrise.jpeg", "images/toast.jpg", 
        "images/Tuna Salad .jpg", "images/tuna.jpg", "images/WAFFLES.jpeg", 
        "images/zaatar.jpg"
    ]; 

    const restaurantImages = [
        "images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/12.jpg"
    ];

    let galleryIndex = 0; let restaurantIndex = 0; 
    const galleryImg = document.querySelector(".gallery img"); 
    const restaurantImg = document.querySelector(".restaurant img"); 
    const nextBtn = document.querySelector(".next"); 
    const prevBtn = document.querySelector(".prev"); 

    function updateGallery() { if(galleryImg) galleryImg.src = galleryImages[galleryIndex]; } 

    if(nextBtn){
        nextBtn.addEventListener("click", () => { galleryIndex = (galleryIndex + 1) % galleryImages.length; updateGallery(); }); 
    }
    
    if(prevBtn){
        prevBtn.addEventListener("click", () => { galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length; updateGallery(); }); 
    }
    
    if(restaurantImg){
        setInterval(() => { restaurantIndex = (restaurantIndex + 1) % restaurantImages.length; restaurantImg.src = restaurantImages[restaurantIndex]; }, 3000); 
    }

    // Delivery
    const fname = document.getElementById('fname'); 
    const lname = document.getElementById('lname'); 
    const phone = document.getElementById('phone'); 
    const address = document.getElementById('address'); 
    const fnum = document.getElementById('floorNum'); 
    const apartNum = document.getElementById('apartNum'); 
    const deliveryInst = document.getElementById('deliveryInst'); 

    const formatNameInput = (e) => { const input = e.target; input.value = input.value.replace(/[^a-zA-Z\s\u0600-\u06FF]/g, ''); }; 
    const validateNameBlur = (e) => { 
        const input = e.target; 
        if (input.value.trim().length > 0) { 
            input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1); 
            if (input.value.trim().length < 3) { showErrorDelivery(input, 'Name must be at least 3 characters.'); } 
            else { clearErrorDelivery(input); } 
        } else { clearErrorDelivery(input); } 
    }; 

    ['fname', 'lname'].forEach(id => { 
        const el = document.getElementById(id); 
        if(el){
            el.addEventListener('input', formatNameInput); 
            el.addEventListener('blur', validateNameBlur); 
        }
    }); 

    if(phone){
        phone.addEventListener('input', (e) => { 
            let val = e.target.value; 
            val = val.replace(/\D/g, ''); 
            if (val.length > 11) { val = val.slice(0, 11); } 
            e.target.value = val; 
            if (val.length > 0) { 
                if (val.length < 11) { showErrorDelivery(phone, 'Phone number must be exactly 11 digits.'); } 
                else if (val.length === 11) { 
                    const regex = /^01[0125][0-9]{8}$/; 
                    if (!regex.test(val)) { showErrorDelivery(phone, 'Invalid format. Must start with 010, 011, 012, or 015.'); } 
                    else { clearErrorDelivery(phone); } 
                } 
            } else { clearErrorDelivery(phone); } 
        }); 
    }

    if(address){
        address.addEventListener('blur', (e) => { 
            const val = e.target.value.trim(); 
            if (val.length > 0 && val.length < 10) { showErrorDelivery(address, 'Please provide a more detailed address (min 10 characters).'); } 
            else { clearErrorDelivery(address); } 
        }); 
    }

    if(fnum){
        fnum.addEventListener('input', (e) => { 
            if (e.target.value && parseInt(e.target.value) > 200) { showErrorDelivery(fnum, 'Floor number seems unusually high.'); } 
            else { clearErrorDelivery(fnum); } 
        }); 
    }

    if(apartNum){
        apartNum.addEventListener('input', (e) => { 
            if (e.target.value && parseInt(e.target.value) > 10000) { showErrorDelivery(apartNum, 'Apartment number seems unusually high.'); } 
            else { clearErrorDelivery(apartNum); } 
        }); 
    }

    if(deliveryInst){
        const maxLength = 200; 
        deliveryInst.setAttribute('maxlength', maxLength); 
        const counterDiv = document.createElement('span'); 
        counterDiv.className = 'char-counter'; 
        counterDiv.innerText = `${maxLength} characters remaining`; 
        deliveryInst.parentElement.appendChild(counterDiv); 
        deliveryInst.addEventListener('input', (e) => { 
            const currentLength = e.target.value.length; 
            const remaining = maxLength - currentLength; 
            counterDiv.innerText = `${remaining} characters remaining`; 
        }); 
    }

    // Sign in
    const loginForm = document.querySelector('.sign-form:not(#signupForm)');
    if (loginForm) { 
        document.getElementById('togglePass')?.addEventListener('click', function () { 
            const input = this.closest('.eye').querySelector('input'); 
            if(input){
                input.type = input.type === 'password' ? 'text' : 'password'; 
                this.querySelector('i').classList.toggle('fa-eye'); 
                this.querySelector('i').classList.toggle('fa-eye-slash'); 
            }
        }); 
        
        loginForm.addEventListener('submit', function (e) { 
            e.preventDefault(); 
            document.querySelectorAll('.error, .form-error').forEach(el => el.textContent = ''); 
            let valid = true; 
            
            const email = this.querySelector('input[type="email"]').value.trim(); 
            const pass = this.querySelector('input[type="password"]').value; 
            
            if (!email || !/\S+@\S+\.\S+/.test(email)) { document.getElementById('err-email').textContent = 'Enter a valid email'; valid = false; } 
            if (pass.length < 5) { document.getElementById('err-pass').textContent = 'Password is too short'; valid = false; } 
            if (valid) window.location.href = 'index.html'; 
        }); 
    } 

    // Sign up
    const imgInput = document.getElementById('imgInput'); 
    const viewEl = document.getElementById('view'); 
    if (imgInput && viewEl) { 
        imgInput.addEventListener('change', function () { 
            const file = this.files[0]; 
            if (!file) return; 
            const reader = new FileReader(); 
            reader.onload = e => { 
                viewEl.style.cssText = 'background-image:url(' + e.target.result + ');background-size:cover;background-position:center'; 
                viewEl.innerHTML = ''; 
            }; 
            reader.readAsDataURL(file); 
        }); 
    } 

    const signupForm = document.getElementById('signupForm'); 
    if (signupForm) { 
        const toggleVis = (btnId, inputId) => { 
            document.getElementById(btnId)?.addEventListener('click', function () { 
                const input = document.getElementById(inputId); 
                if(input){
                    input.type = input.type === 'password' ? 'text' : 'password'; 
                    this.querySelector('i').classList.toggle('fa-eye'); 
                    this.querySelector('i').classList.toggle('fa-eye-slash'); 
                }
            }); 
        }; 
        toggleVis('togglePass', 'password'); 
        toggleVis('toggleConfirm', 'confirmPassword
