import GiphService from './services/gifos.js';



//GiphService.searchGif('rata');
if (document.title == "Gifos-Favoritos" || document.title == "GIFOS") {
    GiphService.trending();
    GiphService.validar_megusta();
}


if (document.title == "Gifos-Favoritos") {
    GiphService.buscarfavorito();
}

const txtTexto = document.getElementById("txt")

if (document.title == "GIFOS") {
    txtTexto.addEventListener('keyup', (event) => {
        GiphService.sugerencias(event.target.value);
    })



    const consultar = document.getElementById("buscar")
    if (consultar) {
        consultar.onclick = function () {
contraerBuscador();
            if (txtTexto.value != "") {
                document.querySelector(".autocompletado").innerHTML = "";
                txtTexto.value = "";
                document.getElementById("barraBuscar").style.height = "50px";
            } else {

                document.getElementById("barraBuscar").style.height = "50px";
            }
          //  busquedaocultar()
           // cambiarBuscarCerrar()
           // textoBuscar()
        }
    }





    function textoBuscar() {
        const txtTexto = document.getElementById("txt")
        if (txtTexto.attributes[1].textContent == "") {
            txtTexto.attributes[1].textContent = "Busca GIFOS y más";
        } else {
            txtTexto.attributes[1].textContent = "";
        }
    }

    if (txtTexto.attributes[1].textContent == "Busca GIFOS y más") {
        txtTexto.onclick = function () {
            contraerBuscador()
        }
    }

var interruptor=false;

    function contraerBuscador(){

        document.querySelector(".titulo-principal").classList.add("ocultar");
        document.querySelector(".ilustra-header").classList.add("ocultar");
        document.getElementById("buscar").classList.add("fa-times");
        document.getElementById("buscar").classList.remove("fa-search");

        txtTexto.attributes[1].textContent = "";
        interruptor=true;

        document.getElementById("buscaractivo").style.display="initial"
        txtTexto.style.marginLeft="27px"

    }


/*


function busquedaocultar() {
    document.querySelector(".titulo-principal").classList.toggle("ocultar");
    document.querySelector(".ilustra-header").classList.toggle("ocultar");
}

function cambiarBuscarCerrar() {
    document.getElementById("buscar").classList.toggle("fa-times");
    document.getElementById("buscar").classList.toggle("fa-search");
}
*/
/*
document.querySelector("main").onclick = function(){
   if (interruptor) {
    document.querySelector(".titulo-principal").classList.remove("ocultar");
    document.querySelector(".ilustra-header").classList.remove("ocultar");
    document.getElementById("buscar").classList.remove("fa-times");
    document.getElementById("buscar").classList.add("fa-search");

    txtTexto.attributes[1].textContent = "";


    document.getElementById("buscaractivo").style.display="done"
    txtTexto.style.marginLeft="55px"
   }

}
*/

}

/****************menu**** */
function menu() {
    document.getElementById("menu").classList.toggle("ocultar");
    document.getElementById("menu-open").classList.toggle("ocultar");
    document.getElementById("menu-close").classList.toggle("ocultar");

}
document.getElementById("menu-open").onclick = function () {
    menu();
}
document.getElementById("menu-close").onclick = function () {
    menu();
}



/********navegacion respetando el modo nocturno */
window.onload = () => {
    GiphService.trading=0;
    var dato = localStorage.getItem("nocturno");
    if (dato == "1") {
        document.getElementById("modo").classList.remove("black");
        document.getElementById("diurno").classList.add("ocultar");
        document.getElementById("nocturno").classList.remove("ocultar");
    } else {
        document.getElementById("modo").classList.add("black");
        document.getElementById("diurno").classList.remove("ocultar");
        document.getElementById("nocturno").classList.add("ocultar");
    }
    var giffavoritos = localStorage.getItem("gif");
    if (giffavoritos == null) {
        var vector_favorito = [];
        localStorage.setItem("gif", JSON.stringify(vector_favorito));
    } else {
        GiphService.validar_megusta();
    }
}

const click_nocturno = document.querySelector(".activar-nocturno");
click_nocturno.addEventListener('click', () => {
    document.getElementById("modo").classList.add("black");
    localStorage.setItem("nocturno", 2);
    ocultar_diurno_nocturno();
    menu()
});

const click_diurno = document.querySelector(".activar-diurno");
click_diurno.addEventListener('click', () => {
    document.getElementById("modo").classList.remove("black");
    localStorage.setItem("nocturno", 1);
    ocultar_diurno_nocturno();
    menu()
});

function ocultar_diurno_nocturno() {
    document.getElementById("diurno").classList.toggle("ocultar");
    document.getElementById("nocturno").classList.toggle("ocultar");
    GiphService.flechastrendingizquierda();
    GiphService.flechastrendingderecha();
}
/************************* */


if (document.title == "Crear-Gifo") {

    const botoncomenzar = document.querySelector(".btnComenzar");
    const botongrabar = document.querySelector(".btngrabar");
    const botonfinalizar = document.querySelector(".btnFinalizar");
    const subirarchivo = document.querySelector(".botonSubir");

    botoncomenzar.addEventListener('click', () => {
        getStreamAndRecord()
    });


    function getStreamAndRecord() {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: { max: 480 }
            }
        })
            .then(function (stream) {

                var videoMostrar = document.getElementById("vid");
                videoMostrar.srcObject = stream;
                videoMostrar.play();


                const recorder = new RecordRTC(stream, {
                    type: 'gif',
                    frameRate: 1,
                    quality: 10,
                    width: 360,
                    hidden: 240,
                    onGifRecordingStarted: function () {
                        console.log('started')

                    },
                });

                botongrabar.addEventListener('click', () => {
                    recorder.startRecording();
                });

                var archivo;
                botonfinalizar.addEventListener('click', () => {
                    recorder.stopRecording(function () {

                        let form = new FormData();
                        form.append('file', recorder.getBlob(), 'myGif.gif');
                        archivo = form.get('file');
                        console.log(form.get('file'))
                    });
                });

                ////
                subirarchivo.addEventListener('click', () => {
                    GiphService.subirgif(urlfuente, etiquetas, urlvideo, archivo)
                });

            }).catch(e => console.error(e));
    }
}
