$("form").submit(function (event) {
  event.preventDefault();
  // Se valida información que se ingresa en el input
  const valueInput = $("#superInput").val();
  const validacion = (valor) => /^[0-9]+$/gim.test(valor);
  if (!validacion(valueInput) || valueInput == "") {
    alert("Por favor ingresa solo números, de 1 a 732");
  } else {
    $.ajax({
      type: "GET",
      url: `https://superheroapi.com/api.php/3130002393910487/${valueInput}`,
      dataType: "json",
      success: function (data) {
        if (data.error) {
          alert("Superheroe no existe o quizás aun es desconocido");
        // Se valida que los valores ingresados se encuentren disponibles para utilizarlos
        } else {
          let conexiones = data.connections["group-affiliation"];
          let publicado = data.biography.publisher;
          let ocupacion = data.work.occupation || "No disponible";
          let primeraAparicion = data.biography["first-appearance"];
          let altura = data.appearance.height.join(", ");
          let peso = data.appearance.weight.join(", ");
          let alianzas = data.biography.aliases.join(", ");
        // Se crea la card con la información del superhero que se desea mostrar y el gráfico
          $("#superInfo").html(`
                    <div class="row pt-5">
                        <div class="col-md-3 my-auto ">
                            <img class="rounded" src="${data.image.url}" height="390px" alt="${data.name}" />
                        </div>
                        <div class="col-md-4">
                            <div class="card-body">
                                <h5 class="card-text"><b>NOMBRE: ${data.name}</b></h5>
                                <p class="card-text"><b>CONEXIONES:</b> ${conexiones}</p>
                                <p class="card-text"><b>FECHA DE PUBLICACION:</b> ${publicado}</p>
                                <p class="card-text"><b>OCUPACION:</b> ${ocupacion}</p>
                                <p class="card-text"><b>PRIMERA APARICION:</b> ${primeraAparicion}</p>
                                <p class="card-text"><b>ALTURA:</b> ${altura}</p>
                                <p class="card-text"><b>PESO:</b> ${peso}</p>
                                <p class="card-text"><b>ALIAS:</b> ${alianzas}</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div id="heroStats" style="height: 380px; width: 550px"></div>
                        </div>
                    </div>
                `);
          // Son las variables con la información de los superpoderes que se quiere graficar
          let estadisticas = [
            { y: data.powerstats.intelligence, label: "Inteligencia" },
            { y: data.powerstats.strength, label: "Fuerza" },
            { y: data.powerstats.speed, label: "Velocidad" },
            { y: data.powerstats.durability, label: "Resistencia" },
            { y: data.powerstats.power, label: "Poder" },
            { y: data.powerstats.combat, label: "Combate" },
          ];
          // Variable de configuración del gráfico
          let config = {
            theme: "light1",
            animationEnabled: true,
            title: {
              text: "Estadísticas " + data.name,
              fontSize: 22,
              fontFamily: "roboto",
              fontWeight: "bold",
            },
            data: [
              {
                type: "pie",
                showInLegend: true,
                legendText: "{label}",
                toolTipContent:`{label} : {y}`,
                indexLabel: `{label} : {y}`,
                indexLabelMaxWidth: 100,
                indexLabelFontSize: 12,
                dataPoints: estadisticas,
              },
            ],
          };
          // Variable para resetear los valores
          let chart = new CanvasJS.Chart("heroStats", config);
          chart.render();
        }
      },
    });
  }
});
