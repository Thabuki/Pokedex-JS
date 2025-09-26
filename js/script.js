const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_image');
const pokemonImageShiny = document.querySelector('.pokemon_image-shiny');
const pokemonCry = document.querySelector('.pokemon_cry');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

let searchPokemon = 25;

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (APIResponse.status == 200) {
        const data = await APIResponse.json();
        return data;
    } 
}

const renderPokemon = async (pokemon) => {

    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';

    const data = await fetchPokemon(pokemon);

    if (data){
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        
        // Guarda ambas URLs das versões normal e shiny do sprite
        const normalSprite = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        const shinySprite = data['sprites']['versions']['generation-v']['black-white']['animated']['front_shiny'];
        
        // Estabelece o sprite normal como padrão
        pokemonImage.src = normalSprite;
        
        // Guarda ambas as URLs em atributos de dados para toggle
        pokemonImage.dataset.normalSprite = normalSprite;
        pokemonImage.dataset.shinySprite = shinySprite;
        pokemonImage.dataset.isShiny = 'false'; // Estado atual do sprite, se shiny ou não

        input.value = '';
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found';
        pokemonNumber.innerHTML = '';
    }
}

const playPokemonCry = async () => {
    // Pega o ID do Pokémon atual a partir do número exibido
    const currentPokemonId = pokemonNumber.innerHTML;
    
    if (currentPokemonId) {
        const data = await fetchPokemon(currentPokemonId);
        const cryUrl = data['cries']['latest'];

        if (cryUrl) {
            const audio = new Audio(cryUrl);
            audio.volume = 0.25; // Coloca o volume em 25%; os cries são MUITO altos
            audio.play().catch(error => {
                console.log('Could not play Pokemon cry:', error);
            });
        }
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

btnPrev.addEventListener('click', () => {
    const currentId = parseInt(pokemonNumber.innerHTML);
    if (currentId > 1) {
        renderPokemon(currentId - 1);
    }
});

btnNext.addEventListener('click', () => {
    const currentId = parseInt(pokemonNumber.innerHTML);
    renderPokemon(currentId + 1);
});

pokemonImage.addEventListener('click', () => {
    // Toggle entre os sprites normal e shiny
    const isCurrentlyShiny = pokemonImage.dataset.isShiny === 'true';
    const normalSprite = pokemonImage.dataset.normalSprite;
    const shinySprite = pokemonImage.dataset.shinySprite;
    
    if (isCurrentlyShiny) {
        // Troca para o sprite normal
        pokemonImage.src = normalSprite;
        pokemonImage.dataset.isShiny = 'false';
    } else {
        // Troca para o sprite shiny
        pokemonImage.src = shinySprite;
        pokemonImage.dataset.isShiny = 'true';
    }

    // Também toca o grito do Pokémon
    playPokemonCry();
});

renderPokemon(searchPokemon);