function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = imageSrc;
            mainImage.style.opacity = '1';
        }, 150);
    }

    const thumbnails = document.querySelectorAll('.product-detail-gallery .product-image-container');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('border-primary');
        thumb.classList.add('border-transparent', 'hover:border-primary/50');
    });

    event.target.closest('.product-image-container').classList.add('border-primary');
    event.target.closest('.product-image-container').classList.remove('border-transparent', 'hover:border-primary/50');
}

function openSimulator() {
    window.location.href = 'simulator.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.style.transition = 'opacity 0.3s ease';
    }
});
