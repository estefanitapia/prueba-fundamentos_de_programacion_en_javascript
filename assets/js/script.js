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
          let conexiones = check(data.connections["group-affiliation"], "personal");
          let publicado = check(data.biography.publisher, "personal");
          let ocupacion = check(data.work.occupation, "personal");
          let primeraAparicion = check(data.biography["first-appearance"], "personal");
          let altura = check(data.appearance.height.join(", "), "personal");
          let peso = check(data.appearance.weight.join(", "), "personal");
          let alianzas = check(data.biography.aliases.join(", "), "personal");
        // Se crea la card con la información del superhero que se desea mostrar y el gráfico
          $("#superInfo").html(`
                    <div class="row pt-5">
                        <div class="col-md-3 my-auto ">
                            <img class="rounded" src="${check(data.image.url, "img")}" height="390px" alt="${data.name}" />
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
          const estadisticas = [
            { y: check(data.powerstats.intelligence, null), label: "Inteligencia" },
            { y: check(data.powerstats.strength, null), label: "Fuerza" },
            { y: check(data.powerstats.speed, null), label: "Velocidad" },
            { y: check(data.powerstats.durability, null), label: "Resistencia" },
            { y: check(data.powerstats.power, null), label: "Poder" },
            { y: check(data.powerstats.combat, null),  label: "Combate" },
          ];
          // Variable de configuración del gráfico
          const config = {
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

// Función que chequea el tipo de dato y lo cambia en caso de ser null o -
function check (dato,tipo){
  if (tipo === "personal"){
      return dato.startsWith("-") ? "No disponible" : dato ; 
  } else if (tipo === "img"){ return dato === "https://www.superherodb.com/pictures2/portraits/10/100/1010.jpg"  ? "https://i.etsystatic.com/42028018/r/il/8d268a/4813622326/il_300x300.4813622326_fee1.jpg" : dato ;
  }
  else {return dato === "null"  ? Math.ceil(Math.random() * 100) : dato ; }
  };