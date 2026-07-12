document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox || galleryItems.length === 0) return;

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const item = galleryItems[currentIndex];
        
        // Get image source and caption from the gallery item
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption');
        
        if (img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || caption || '';
            // If it's a transparent placeholder gif, hide img to show just caption
            if (img.src.includes('data:image/gif;base64') || img.src === '') {
                lightboxImg.style.display = 'none';
            } else {
                lightboxImg.style.display = 'block';
            }
        }
        
        lightboxCaption.textContent = caption || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            lightboxImg.src = ''; 
        }, 300);
    }

    function showPrev() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
        openLightbox(currentIndex);
    }

    function showNext() {
        currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
        openLightbox(currentIndex);
    }

    // Attach click events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Attach events to controls
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent overlay click
            showPrev();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent overlay click
            showNext();
        });
    }

    // Close on overlay background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
});
