const maxInputValue = 1000;
const minInputValue = 1;
const maxDigits = 4;

const reader = new FileReader();

const totalValue = document.getElementById('totalValue');
const estimatedLeaders = document.getElementById('estimatedLeaders');
const cost = document.getElementById('cost');
const leadsNeeded = document.getElementById('leadsNeeded');

(function validateInput() {
    const rangeInputs = document.querySelectorAll('.range-input');
    rangeInputs.forEach((rangeInput) => {
        const input = rangeInput.children[0];
        input.addEventListener('input', function(event) {
            let value = event.target.value;

            value = value.replace(/\D/g, '');

            if (value.length > maxDigits) {
                value = value.substring(0, 4);
            }

            if (value > maxInputValue) {
               value = maxInputValue;
            }

            if (value < minInputValue) {
                value = minInputValue;
            }

            event.target.value = value;
        });
    });
})();

(function rangeInput() {
    const rangeInputs = document.querySelectorAll('.range-input');
    rangeInputs.forEach((rangeInput) => {
        const input = rangeInput.children[0];
        const range = rangeInput.children[1];

        input.addEventListener('input', function() {
            range.value = input.value;
            const value = (range.value - range.min)/(range.max - range.min)*100;
            range.style.background = 'linear-gradient(to right, #4E738A ' + value + '%, #F2F2F2 0%)'
        });

        range.addEventListener('input', function() {
            input.value = range.value;
        });
    });
})();

(function rangeBackground() {
    const ranges = document.querySelectorAll('.slider');
    ranges.forEach((range) => {
        range.addEventListener('input', function() {
            const value = (range.value - range.min)/(range.max - range.min)*100;
            range.style.background = 'linear-gradient(to right, #4E738A ' + value + '%, #F2F2F2 0%)'
        })
    })
})();

(function initializeRangeInputs() {
    const rangeInputs = document.querySelectorAll('.range-input');
    rangeInputs.forEach((rangeInput) => {
        const input = rangeInput.children[0];
        const range = rangeInput.children[1];

        input.value = 1;
        range.value = 1;
    });
})();

(function countTotal() {
    const rangeInputs = document.querySelectorAll('.range-input');
    rangeInputs.forEach((rangeInput) => {
        const input = rangeInput.children[0];
        const range = rangeInput.children[1];

        input.addEventListener('input', function() {
            const value = leadsNeeded.value / estimatedLeaders.value * cost.value;
            totalValue.innerHTML = value.toFixed(3);
        });

        range.addEventListener('input', function() {
            const value = leadsNeeded.value / estimatedLeaders.value * cost.value;
            totalValue.innerHTML =  value.toFixed(3);
        });
    })
})();

(function () {
    document.getElementById('imageUpload').addEventListener('click', function() {
        document.getElementById('fileInput').click()
    });
    
    document.getElementById('fileInput').addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
            reader.onload = function(e) {
                const container = document.getElementById('imageUpload');

                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('uploaded-image');

                const cross = document.createElement('div');
                cross.classList.add('remove-cross')
                cross.addEventListener('click', function(event) {
                    container.removeChild(img);
                    container.removeChild(cross);
                    container.children[0].style.display = 'block';
                    event.stopPropagation();
                });
    
                container.children[0].style.display = 'none';

                const prevImage = container.children[1];
                const prevCross = container.children[2];

                if (prevImage && prevCross) {
                    container.removeChild(prevImage);
                    container.removeChild(prevCross);
                }

                container.appendChild(img);
                container.appendChild(cross);
            };
            reader.readAsDataURL(event.target.files[0]);
            event.target.value = '';
        }
    });
})();

(function() {
    document.getElementById('exportPdf').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const image = document.querySelector('.uploaded-image');

        if (image) {
            pdf.addImage(reader.result, 'JPEG', 10, 10, image.scrollWidth, image.scrollHeight);
            pdf.text(`Estimated leads per 1000 messages ${estimatedLeaders.value}`, 10, image.scrollHeight + 20);
            pdf.text(`Cost per 1000 messages ${cost.value}`, 10, image.scrollHeight + 40);
            pdf.text(`Leads needed ${leadsNeeded.value}`, 10, image.scrollHeight + 60);
            pdf.text(`Total ${totalValue.innerHTML}`, 10, image.scrollHeight + 80);
        } else {
            pdf.text(`Estimated leads per 1000 messages ${estimatedLeaders.value}`, 10, 20);
            pdf.text(`Cost per 1000 messages ${cost.value}`, 10, 40);
            pdf.text(`Leads needed ${leadsNeeded.value}`, 10, 60);
            pdf.text(`Total ${totalValue.innerHTML}`, 10, 80);
        }

        pdf.save('result.pdf');
    })
})();