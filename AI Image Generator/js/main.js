const generateForm = document.querySelector('.generate-form');
const imgGallery = document.querySelector('.image-gallery');

const OPENAI_API_KEY = 'api_key'
let isImageGenerated = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imgGallery.querySelectorAll('.img-card')[index];
        const imgElement = imgCard.querySelector('img');
        const downloadBtn = imgCard.querySelector('.download-btn');

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`
        imgElement.src(aiGeneratedImg);
        imgElement.onload = () => {
            imgCard.classList.remove('loading');
            downloadBtn.setAttribute('href', aiGeneratedImg);
            downloadBtn.setAttribute('download', `${new Date().getTime()}.jpg`);
        }
    })
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            prompt: userPrompt,
            n: parseInt(userImgQuantity),
            size: "512x512",
            response_format: "b64_json",
        })
    });

    if (!response.ok) throw new Error("Failed to generate images! please try again.");

    const { data } = await response.json();
    updateImageCard([...data]);
    } catch (error){
        alert(error.message);
    } finally {
        isImageGenerated = false;
    }
}

const handleFormSubmission = (e) => {
    if (isImageGenerated) return;
    isImageGenerated = true;
    e.preventDefault();
    // Get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;
    // Creating HTML Markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
        `<div class="img-card loading">
            <img src="./imgs/loader.svg" alt="image">
            <a href="" class="download-btn">
                <img src="./imgs/download.svg" alt="download icon">
            </a>
        </div>`
        ).join('');

    imgGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}

// generateForm.addEventListener('submit', handleFormSubmission);



