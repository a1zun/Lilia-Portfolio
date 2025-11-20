// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        // Закрываем мобильное меню после клика
        document.querySelector('.nav-menu').classList.remove('active');
    });
});

// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Изменение навигации при прокрутке
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Модальное окно для изображений галереи
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.close-modal');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const galleryImage = item.querySelector('.gallery-image');
        const imagePlaceholder = item.querySelector('.gallery-image-placeholder');
        const title = item.querySelector('.gallery-info h3').textContent;
        const description = item.querySelector('.gallery-info p').textContent;
        
        // Проверяем, есть ли реальное изображение или placeholder
        if (galleryImage) {
            modalImg.src = galleryImage.src;
            modalImg.alt = galleryImage.alt || title;
            modalImg.style.display = 'block';
        } else if (imagePlaceholder) {
            // Для placeholder используем фоновое изображение или градиент
            modalImg.src = '';
            modalImg.style.display = 'none';
        }
        
        modalCaption.textContent = `${title} - ${description}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Обработка формы контактов
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Здесь можно добавить отправку данных на сервер
    console.log('Форма отправлена:', formData);
    
    // Показываем уведомление
    alert('Спасибо за ваше сообщение! Я свяжусь с вами в ближайшее время.');
    
    // Очищаем форму
    contactForm.reset();
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к элементам галереи
document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Применяем анимацию к секции "Обо мне"
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
    aboutContent.style.opacity = '0';
    aboutContent.style.transform = 'translateY(30px)';
    aboutContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(aboutContent);
}

// Применяем анимацию к форме контактов
const contactContent = document.querySelector('.contact-content');
if (contactContent) {
    contactContent.style.opacity = '0';
    contactContent.style.transform = 'translateY(30px)';
    contactContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(contactContent);
}


