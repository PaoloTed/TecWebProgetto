let button = document.getElementById("new_artwork");
button.addEventListener("click", getArt);


async function getArt() {
    let keywords = getKeywords();

    let query = `https://api.artic.edu/api/v1/artworks/search?limit=100&q=${keywords}`;
    let artworkList = await getArtWorkList(query);

    let randomIndex = Math.floor(Math.random() * artworkList.data.length);
    let artwork = artworkList.data[randomIndex];
    let image = document.getElementById("artwork_image");

    let title = artwork.title;
    let artist_title = "artwork.data.artist_title";
    
    let imageData = await getImage(artwork);
    let imageUrl = URL.createObjectURL(imageData);
    image.src = imageUrl;

    

    function getKeywords() {
        let keywords = document.getElementById("keywords");
        if (keywords.value === "") {
            alert("Please enter a valid keyword.");
            return;
        }
        return keywords.value;
    }

    async function getArtWorkList(query) {
        let response = await fetch(query)
        checkResponse(response, "Error fetching artworks. Please try again.");
        let artworkList = await response.json();
        if (artworkList.data.length === 0) {
            alert("No artworks found. Please try again.");
            keywords.value = "";
            return;
        }
        return artworkList;
    }

    async function getImage(artwork){
        artwork_api_link = artwork.api_link;
        response = await fetch(artwork_api_link);
        checkResponse(response, "Error fetching artwork details. Please try again.");

        let artworkDetails = await response.json();

        console.log(artworkDetails);
        

        document.getElementById("artwork_title").innerText = artworkDetails.data.title;
        document.getElementById("artwork_artist").innerText = artworkDetails.data.artist_title;

        let artworkId = artworkDetails.data.image_id;

        query = `https://www.artic.edu/iiif/2/${artworkId}/full/843,/0/default.jpg`;
        response = await fetch(query)
        checkResponse(response, "Error fetching artwork image. Please try again.");
        return await response.blob();

    }


    function checkResponse(response, error) {
        if (!response.ok) {
            alert(error);
            return;
        }
    }
}