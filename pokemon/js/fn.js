let tiradasA = [];
let tiradasB = [];

function tirarDados(equipo) {
  const dado1 = Math.floor(Math.random() * 6) + 1;
  const dado2 = Math.floor(Math.random() * 6) + 1;
  const suma = dado1 + dado2;

  if (equipo === 'A') {
    if (tiradasA.length >= 3) return;
    tiradasA.push(suma);
    document.getElementById("tiradasA").innerHTML += `<li>Tirada ${tiradasA.length}: ${dado1} + ${dado2} = ${suma}</li>`;
    if (tiradasA.length === 3) {
      document.getElementById("btnDadosA").disabled = true;
    }
  } else if (equipo === 'B') {
    if (tiradasB.length >= 3) return;
    tiradasB.push(suma);
    document.getElementById("tiradasB").innerHTML += `<li>Tirada ${tiradasB.length}: ${dado1} + ${dado2} = ${suma}</li>`;
    if (tiradasB.length === 3) {
      document.getElementById("btnDadosB").disabled = true;
    }
  }

  if (tiradasA.length === 3 && tiradasB.length === 3) {
    document.getElementById("resultado").disabled = false;
  }
}

async function obtenerPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error("ID inválido");
  return await res.json();
}

function obtenerIdsAleatorios(cantidad) {
  const ids = new Set();
  while (ids.size < cantidad) {
    const id = Math.floor(Math.random() * 151) + 1;
    ids.add(id);
  }
  return Array.from(ids);
}

async function compararEquipos() {
  const resultado = document.getElementById("resultado");

  try {
    const idsEquipo1 = obtenerIdsAleatorios(3);
    const idsEquipo2 = obtenerIdsAleatorios(3);

    const [equipo1, equipo2] = await Promise.all([
      Promise.all(idsEquipo1.map(id => obtenerPokemon(id))),
      Promise.all(idsEquipo2.map(id => obtenerPokemon(id)))
    ]);
    

    const ataqueTotal = equipo1.reduce((total, poke) => {
      const ataque = poke.stats.find(stat => stat.stat.name === "attack").base_stat;
      return total + ataque;
    }, 0);

    const defensaTotal = equipo2.reduce((total, poke) => {
      const defensa = poke.stats.find(stat => stat.stat.name === "defense").base_stat;
      return total + defensa;
    }, 0);

    let mensaje;
    if (ataqueTotal > defensaTotal) {
      mensaje = `¡Equipo 1 gana! Ataque total: ${ataqueTotal} vs Defensa total: ${defensaTotal}`;
    } else if (defensaTotal > ataqueTotal) {
      mensaje = `¡Equipo 2 gana! Defensa total: ${defensaTotal} vs Ataque total: ${ataqueTotal}`;
    } else {
      mensaje = `¡Empate! Ambos tienen ${ataqueTotal}`;
    }

    resultado.innerHTML = `
      <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 40px;">
      <div>
      <h3>Equipo 1 (Atacantes)</h3>
      <div style="display: flex; gap: 20px; text-align: center;">
        ${equipo1.map(poke => `
          <div style="text-align:center;">
            <img src="${poke.sprites.front_default}" alt="${poke.name}">
            <p><strong>${poke.name}</strong><br>Ataque: ${poke.stats.find(s => s.stat.name === "attack").base_stat}</p>
          </div>
        `).join("")}
      </div>

      <h3>Equipo 2 (Defensores)</h3>
      <div style="display: flex; gap: 20px; text-align: center;">
        ${equipo2.map(poke => `
          <div style="text-align:center;">
            <img src="${poke.sprites.front_default}" alt="${poke.name}">
            <p><strong>${poke.name}</strong><br>Defensa: ${poke.stats.find(s => s.stat.name === "defense").base_stat}</p>
          </div>
        `).join("")}
      </div>

      <h2>${mensaje}</h2>
    `;
  } catch (err) {
    resultado.innerHTML = `<p style="color:red;">Error al obtener los Pokémon. Intenta de nuevo.</p>`;
  }
  }
