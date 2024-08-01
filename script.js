// Variabel untuk melacak halaman saat ini
let currentPage = 1;
// Jumlah item (Pokémon) yang ditampilkan per halaman
const itemsPerPage = 12;
// Array untuk menyimpan data Pokémon yang diambil dari API
let currentPokemonList = [];

/**
 * Fungsi untuk mencari Pokémon berdasarkan tipe yang dimasukkan oleh pengguna.
 */
async function searchPokemonByType() {
    // Ambil nilai input dari elemen dengan id 'searchInput' dan ubah menjadi huruf kecil
    const input = document.getElementById('searchInput').value.toLowerCase();
    // Ambil elemen dengan id 'results' untuk menampilkan hasil pencarian
    const resultsDiv = document.getElementById('results');
    // Kosongkan isi div hasil pencarian sebelumnya
    resultsDiv.innerHTML = '';
    // Kosongkan div paginasi sebelumnya
    document.getElementById('pagination').innerHTML = '';

    try {
        // Ambil data dari API Pokémon berdasarkan tipe yang dimasukkan
        const response = await fetch(`https://pokeapi.co/api/v2/type/${input}`);
        // Jika respons tidak OK, lempar error
        if (!response.ok) {
            throw new Error('Type not found');
        }
        // Ubah respons menjadi JSON
        const typeData = await response.json();
        // Ambil data detail untuk setiap Pokémon yang termasuk dalam tipe tersebut
        const pokemonPromises = typeData.pokemon.map(async (poke) => {
            const pokeResponse = await fetch(poke.pokemon.url);
            return pokeResponse.json();
        });
        // Tunggu semua permintaan selesai dan simpan hasilnya dalam currentPokemonList
        currentPokemonList = await Promise.all(pokemonPromises);
        // Tampilkan Pokémon untuk halaman saat ini
        displayPokemons(currentPokemonList, currentPage);
        // Buat navigasi paginasi berdasarkan jumlah total Pokémon dan jumlah item per halaman
        createPagination(currentPokemonList.length, itemsPerPage);
    } catch (error) {
        // Jika terjadi error, tampilkan pesan error
        resultsDiv.innerHTML = `<p>${error.message}</p>`;
    }
}

/**
 * Fungsi untuk menampilkan Pokémon berdasarkan halaman saat ini.
 * @param {Array} pokemons - Array yang berisi data Pokémon
 * @param {number} page - Halaman saat ini
 */

function displayPokemons(pokemons, page) {
    // Ambil elemen dengan id 'results' untuk menampilkan hasil pencarian
    const resultsDiv = document.getElementById('results');
    // Kosongkan isi div hasil pencarian sebelumnya
    resultsDiv.innerHTML = '';
    // Hitung indeks awal dan akhir Pokémon yang akan ditampilkan berdasarkan halaman saat ini
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    // Ambil subset Pokémon untuk halaman saat ini
    const paginatedPokemons = pokemons.slice(start, end);

    // Tampilkan setiap Pokémon dalam bentuk kartu
    paginatedPokemons.forEach((pokemon) => {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';
        pokemonCard.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p>ID: ${pokemon.id}</p>
            <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        `;
        resultsDiv.appendChild(pokemonCard);
    });
}

/**
 * Fungsi untuk membuat navigasi paginasi.
 * @param {number} totalItems - Jumlah total Pokémon yang diambil
 * @param {number} itemsPerPage - Jumlah item (Pokémon) yang ditampilkan per halaman
 */
function createPagination(totalItems, itemsPerPage) {
    // Ambil elemen dengan id 'pagination' untuk menampilkan tombol navigasi
    const paginationDiv = document.getElementById('pagination');
    // Hitung jumlah total halaman berdasarkan jumlah total Pokémon dan jumlah item per halaman
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Buat tombol untuk setiap halaman
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        // Ketika tombol diklik, set halaman saat ini dan tampilkan Pokémon untuk halaman tersebut
        button.onclick = () => {
            currentPage = i;
            displayPokemons(currentPokemonList, currentPage);
        };
        // Tambahkan tombol ke div paginasi
        paginationDiv.appendChild(button);
    }
}
