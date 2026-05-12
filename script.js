window.onload = function() {
    const inputTitulo = document.getElementById('inputTitulo');
    const inputConteudo = document.getElementById('inputConteudo');
    const displayTitulo = document.getElementById('displayTitulo');
    const displayConteudo = document.getElementById('displayConteudo');
    const selectTema = document.getElementById('selectTema');
    const btnIA = document.getElementById('btnIA');
    const btnFull = document.getElementById('btnFull');

    function atualizar() {
        displayTitulo.innerText = inputTitulo.value || "Título do Estudo";
        displayConteudo.innerHTML = (inputConteudo.value || "Seu conteúdo aparecerá aqui...").replace(/\n/g, '<br>');
    }

    inputTitulo.oninput = atualizar;
    inputConteudo.oninput = atualizar;

    selectTema.onchange = () => document.body.className = selectTema.value;

    btnFull.onclick = () => {
        const area = document.getElementById('areaPreview');
        if (!document.fullscreenElement) area.requestFullscreen();
        else document.exitFullscreen();
    };

    btnIA.onclick = async function() {
        const tema = inputTitulo.value || inputConteudo.value;
        if (!tema) return alert("Digite um título!");

        btnIA.innerText = "🔍 Analisando...";
        btnIA.disabled = true;

        try {
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
            const prompt = `Aja como um professor. Resuma sobre "${tema}". Use tópicos. Sem negritos. No final adicione: IMAGEM: [palavra simples em inglês].`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            let textoIA = data.candidates[0].content.parts[0].text;

            if (textoIA.includes("IMAGEM:")) {
                const partes = textoIA.split("IMAGEM:");
                const textoFinal = partes[0].trim();
                const termoImg = partes[1].trim().split(" ")[0].replace(/[^a-zA-Z]/g, "");

                inputConteudo.value = textoFinal;
                const imgHtml = `<img src="https://loremflickr.com/1200/800/${termoImg}?random=${Math.random()}" alt="img">`;
                displayConteudo.innerHTML = imgHtml + textoFinal.replace(/\n/g, '<br>');
            } else {
                inputConteudo.value = textoIA;
                atualizar();
            }
        } catch (e) {
            alert("Erro: " + e.message);
        } finally {
            btnIA.innerText = "🤖 Otimizar com IA";
            btnIA.disabled = false;
        }
    };
};