
const java_trending = document.querySelector(".javascript");
const java_grid = document.querySelector(".containerGrid");
const contBusqueda = document.querySelector(".contenedorBusqueda");
const containerEscritorio=document.querySelector(".containerEscritorioTrendind");


const CONSTANTS = {
    APIKEY: "Ff19ygaLzNZSsZhE8C9ECIN3zhUdqqHP",
    BASE_PATH: 'https://api.giphy.com/v1/gifs',
    TRENDING: '/trending',
    /////////
    SEARCH: '/search',
    /////sugerencias//
    PATH_SUGERENCIAS: 'https://api.giphy.com/v1/tags/related/',
    //////
    BASE_PATH_UPLOAD: 'https://upload.giphy.com/v1/gifs',
}

class GiphyService {

    static get({
        url,
        limit,
        offset,
        cadenaFavoritos,
        buscar,

        username,
        source_image_url,
        tags,
        file,
        source_post_url,


    }, callback) {
    
        let cargar = (username)?"&username=" + username + "&file=" + file + "&source_image_url=" + source_image_url + "&tags=" + tags + "&source_post_url=" + source_post_url:"";

        let buscarpalabra = (buscar)?"&q="+buscar:"";

        let limite = (limit)?"&limit=" + limit:"";

        let Valoroffset = (offset)?"&offset=" + offset : "" ;

        let BuscarFavorito = (cadenaFavoritos)?"&ids=" + cadenaFavoritos: "";

        // console.log(url + '?api_key=' + CONSTANTS.APIKEY + buscarpalabra + BuscarFavorito + "&limit=" + limit + Valoroffset)

        fetch(url + '?api_key=' + CONSTANTS.APIKEY + cargar + buscarpalabra + BuscarFavorito + limite + Valoroffset)
        .then(dataType => dataType.json())
        .then(apiResponse => callback(apiResponse));

    }


    static llamar_localstorage() {
        return JSON.parse(localStorage.getItem("gif"));
    }

    static validar(id_gif, vector) {
        return vector.indexOf(id_gif);
    }

    static agregar_o_quitar_favorito(id_gif) {
        var vec = this.vector_trending();
        var posicionVecTrending = vec.indexOf(id_gif);

        if (posicionVecTrending > -1) {
            var posicionLocal = this.validar(id_gif, this.llamar_localstorage());
            var vector = this.llamar_localstorage();


            if (posicionLocal > -1) {
                vector.splice(posicionLocal, 1);
                document.querySelectorAll('#corazon')[posicionVecTrending].src = "./assets/img/icon-fav-hover.svg";
                document.querySelectorAll('#corazon')[posicionVecTrending].removeAttribute("style");
            } else {
                document.querySelectorAll('#corazon')[posicionVecTrending].src = "./assets/img/icon-fav-active.svg";
                document.querySelectorAll('#corazon')[posicionVecTrending].style.opacity = "1";
                vector.push(id_gif);
            }
            localStorage.setItem("gif", JSON.stringify(vector));
        } else {
            // no lo he utilizado
        }
    }

    static vector_trending() {
        var etiqueta = (document.querySelectorAll('#corazon'))
        var vec = [];
        for (let i = 0; i < etiqueta.length; i++) {
            vec.push(etiqueta[i].attributes.idgif.value);
        }
        return vec;
    }

    static validar_megusta() {

        var vec = this.vector_trending();
        for (let i = 0; i < vec.length; i++) {
            var posicion = this.validar(vec[i], this.llamar_localstorage());
            if (posicion > -1) {
                document.querySelectorAll('#corazon')[i].src = "./assets/img/icon-fav-active.svg";
                document.querySelectorAll('#corazon')[i].style.opacity = "1";
            }
            else {
                document.querySelectorAll('#corazon')[i].src = "./assets/img/icon-fav-hover.svg";
              //  document.querySelectorAll('#corazon')[i].style.opacity = "0.7";
            }
        }
    }

    static validar_megusta_max(id) {

        var vec = this.llamar_localstorage();
        var posicion = this.validar(id, vec);
        return posicion;
    }

    static agregar_o_quitar_favorito_max(id_gif) {
        var vector = this.llamar_localstorage();
        var posicionLocal = this.validar_megusta_max(id_gif);

        if (posicionLocal > -1) {
            console.log(posicionLocal)
            console.log(document.querySelector('#corazonmax'))
            vector.splice(posicionLocal, 1);
            document.querySelector('#corazonmax').src = "./assets/img/icon-fav-hover.svg";
            document.querySelector('#corazonmax').removeAttribute("style");
        } else {
            document.querySelector('#corazonmax').src = "./assets/img/icon-fav-active.svg";
            document.querySelector('#corazonmax').style.opacity = "1";
            vector.push(id_gif);
        }
        localStorage.setItem("gif", JSON.stringify(vector));
    }

    static resolucion() {
        if (screen.width >= 320 && screen.width <= 425) {
            return 2;
        } else {
            if (screen.width >= 426 && screen.width <= 768) {
                return 3;
            } else {
                return 4;
            }
        }
    }

    static traerDataApi(Api) {
        const { data } = Api;
        return data;
    }

    static pagina = 1;
    static maxPorHoja = 5;
    static inicia = 1;
    static diferencia=0;
    static diferenciainicial=0;


    static cargar_favoritos = (apiFavoritos) => {

        const data = this.traerDataApi(apiFavoritos);

        var vectorHojaFavorito = [];
        var dividirHojas = data.length / 12;
        var cantidadHojas = Math.ceil(dividirHojas)
        var paraRestar = ((cantidadHojas * 12) - data.length);
        var gifXhoja = 0;

        for (let i = 1; i <= cantidadHojas; i++) {
            if (i == cantidadHojas) {
                var posicionInicial = [];
                posicionInicial.push(gifXhoja)
                posicionInicial.push((gifXhoja + 11) - paraRestar)
                vectorHojaFavorito.push(posicionInicial)
            } else {
                vectorHojaFavorito.push(gifXhoja)
                gifXhoja = gifXhoja + 12;
            }
        }

        var valorInicial;
        var valorFinal;
        var navegacion;
      

        if (vectorHojaFavorito.length == 1) {
            valorInicial = 0;
            valorFinal = 11;
            navegacion = false;
        //    console.log("primero")
        } else {
            var numero;
            if (((vectorHojaFavorito.length)) == parseInt(this.pagina)) {
                numero = vectorHojaFavorito[parseInt(this.pagina) - 1]
                valorInicial = numero[0];
                valorFinal = numero[1];

            } else {

                valorInicial = vectorHojaFavorito[parseInt(this.pagina) - 1];
                valorFinal = valorInicial + 11;
            }
            navegacion = true;
        }

        this.paginacion(apiFavoritos, valorInicial, valorFinal);
      //  console.log(vectorHojaFavorito)

        if (navegacion) {
            //var this.inicia = 1;
            if (cantidadHojas < this.maxPorHoja) {//=
              //  console.log("primero")
                this.llenarPorHoja(this.inicia, cantidadHojas, cantidadHojas)
               
            } else {

                if (this.pagina <= this.maxPorHoja) {
                 //   console.log("segundo")
                    this.llenarPorHoja(this.inicia, this.maxPorHoja, cantidadHojas)
                 
                } else {
                    //this.inicia = this.pagina ;
                    if ((this.maxPorHoja + 5)<=cantidadHojas) {

                        //this.maxPorHoja=this.maxPorHoja +5
                      //  console.log("tercero")
                        this.llenarPorHoja(this.inicia, this.maxPorHoja, cantidadHojas)
                        
                    } else {
                        this.diferencia= this.maxPorHoja + (cantidadHojas - this.maxPorHoja)
                        //this.maxPorHoja=(this.maxPorHoja + diferencia);
                      this.diferenciainicial=this.inicia+1;
                      //  console.log("cuarto")
                        this.llenarPorHoja(this.diferenciainicial, this.diferencia, cantidadHojas)

                        
                    }
                    
                    
                }
            }
        }
    }

    


    static llenarPorHoja(inicia, cantidadHojas, total = 0) {
     /*   console.log(inicia)
        console.log(cantidadHojas)
        console.log(total)
        console.log("---------")
        console.log(this.pagina)
        console.log(this.maxPorHoja)
*/
        const divcontpagina = document.createElement("div");
        divcontpagina.classList.add("containerPaginacion")
        java_grid.appendChild(divcontpagina);


        const divul = document.createElement("div");
        divcontpagina.appendChild(divul);

        const flechaleft = document.createElement("i");
        flechaleft.classList.add("fa")
        flechaleft.classList.add("fa-chevron-left")
        divul.appendChild(flechaleft);

        if (parseInt(this.pagina) == 1) {

            flechaleft.style.color = 'grey';

        } else {

            flechaleft.addEventListener("click", () => {

               // if (cantidadHojas == total) {
                if (this.inicia == this.pagina) {
                    this.maxPorHoja=(this.maxPorHoja-5)
                    this.inicia=this.inicia-5;
                }
    
                this.eliminarAntesEtiquetas();
                this.pagina = parseInt(this.pagina) - 1;
                this.buscarfavorito();
            })
        }




        for (let i = inicia; i <= cantidadHojas; i++) {
            const label = document.createElement("label");
            label.id = (i);
            divul.appendChild(label);
            const span = document.createElement("span");
            span.textContent = (i)
            label.appendChild(span);
            span.addEventListener("click", () => {
                this.eliminarAntesEtiquetas();
                this.pagina = span.textContent;
                this.buscarfavorito();
            })
        }


        const flecharight = document.createElement("i");
        flecharight.classList.add("fa")
        flecharight.classList.add("fa-chevron-right")
        divul.appendChild(flecharight);

        if (parseInt(this.pagina) == total/*cantidadHojas*/) {

            flecharight.style.color = 'grey';

        } else {
           

            flecharight.addEventListener("click", () => {

                if (cantidadHojas == this.pagina) {
                    this.maxPorHoja=(this.maxPorHoja+5)
                    this.inicia=this.inicia+5;
                }

                this.eliminarAntesEtiquetas();
                this.pagina = parseInt(this.pagina) + 1;
                this.buscarfavorito();
            })
        }

        if (document.getElementById("modo").classList.length == 1) {
            document.getElementById(parseInt(this.pagina)).style.background = '#FFFFFF';
            document.getElementById(parseInt(this.pagina)).style.opacity = "1";
        } else {
            document.getElementById(parseInt(this.pagina)).style.background = '#572EE5';
            document.getElementById(parseInt(this.pagina)).style.opacity = "1";
        }

    }




    static paginacion(apiFavoritos, inicio, final) {

        const data = this.traerDataApi(apiFavoritos);
        var columnas = this.resolucion()
        var dividir = (final - inicio) / columnas;//final / columnas;
        var filas = Math.ceil(dividir)

        if (final == inicio) {
            filas = 1;
        }

        for (let i = 1; i <= filas; i++) {

            const divRow = document.createElement("div");
            divRow.classList.add("row")


            for (let j = 1; j <= columnas; j++) {
                if (final >= inicio) {

                    const divCol = document.createElement("div");
                    divCol.classList.add("col-6")

                    divRow.appendChild(divCol);

                    const divContainer = document.createElement("div");
                    divContainer.classList.add("container")

                  
                    const {
                        id,
                        title,
                        username,
                        images
                    } = data[inicio]

                    const imagedOriginal = images.original.url


                    if (GiphyService.resolucion() == 4) {
                        divContainer.innerHTML = "<img class = img-gif src = " + imagedOriginal + " /> ";
                        divCol.appendChild(divContainer);
    
    
                        var label = document.createElement('label');
                        divContainer.appendChild(label);
    
                        var div = document.createElement('div');
                        div.classList.add("botones");
    
                        ///corazon
                        divContainer.appendChild(div);
    
                        var corazon = document.createElement('img');
                        corazon.id = "corazon";
    
                        corazon.setAttribute("idgif", id)
    
                        corazon.src = "./assets/img/icon-fav-active.svg";
                        corazon.style.opacity = "1";
    
                        corazon.alt = "No activado el Megusta";
                        corazon.addEventListener("click", () => {
                            this.agregar_o_quitar_favorito(id);
                        })
                        div.appendChild(corazon);
    
                        ///descargar
                        var descargar = document.createElement('img');
                        descargar.id = "descargar";
                        descargar.src = "./assets/img/icon-download.svg";
                        descargar.alt = "descargar";
    
                        descargar.addEventListener("click", () => {
                         //   console.log(title)
                        })
                        div.appendChild(descargar);
    
                        ///ampliar
                        var ampliar = document.createElement('img');
                        ampliar.id = "ampliar";
                        ampliar.src = "./assets/img/icon-max.svg";
                        ampliar.alt = "ampliar";
    
                        ampliar.addEventListener("click", () => {
                            this.MaxImg(imagedOriginal, username, title, id);
                           // console.log(username)
                        })
    
                        div.appendChild(ampliar);
    
                        /////////////
                        var titulo = document.createElement('div');
                        titulo.classList.add("informacion-gifo");
                        titulo.innerHTML = "<span class=user>" + username + "</span><span class=titulo>" + title + "</span>";
                        div.appendChild(titulo);
    
                        inicio++;
    
                        divCol.appendChild(divContainer);
                    }else{



                        var imggif = document.createElement("img");
                        imggif.classList.add("img-gif")
                        imggif.src = imagedOriginal;
                        imggif.addEventListener("click", () => {
                            GiphyService.MaxImg(imagedOriginal, username, title, id);
                        })

                        divContainer.appendChild(imggif);


 inicio++;
    
                        divCol.appendChild(divContainer);
                    }


                }
            }
            java_grid.appendChild(divRow);
        }
    }

    static eliminarAntesEtiquetas() {
        var listRow = document.querySelector(".containerGrid");

        while (listRow.firstChild) {
            listRow.removeChild(listRow.firstChild);
        };
    }


    static trendingHandler = (apiReturn) => {
        const data = this.traerDataApi(apiReturn);

        data.forEach((gitItem) => {
            const {
                title,
                images,
                username,
                id
            } = gitItem;

            const imagedOriginal = images.original.url

                const LisTrending = document.createElement("li");
                var imggif = document.createElement("img");
                imggif.classList.add("img-gif")
                imggif.src = imagedOriginal;
                imggif.addEventListener("click", () => {
                    GiphyService.MaxImg(imagedOriginal, username, title, id);
                })

                LisTrending.appendChild(imggif);
                java_trending.appendChild(LisTrending);
            this.validar_megusta();
        });
    }

    static trading ;

    static trending() {

        if (GiphyService.resolucion() == 4){
            containerEscritorio.innerHTML="";
            this.get({
                url: CONSTANTS.BASE_PATH + CONSTANTS.TRENDING,
                limit: 3,
                offset: this.trading,
            }, this.trendingHandlerEscritorio);

        }else{

            this.get({
                url: CONSTANTS.BASE_PATH + CONSTANTS.TRENDING,
                limit: 5,
            }, this.trendingHandler);

        }

    }

    
    static flechastrendingizquierda(){
        const cuadroizquierda=document.createElement("div");
        const flechaleft = document.createElement("i");
        if (document.querySelector("body").classList.length==0) {
            cuadroizquierda.style.backgroundColor="  #572EE5";
            flechaleft.style.color="#F3F5F8"
        } else {
            cuadroizquierda.style.backgroundColor="#F3F5F8";
            flechaleft.style.color="#572EE5"
        }
    }

    static flechastrendingderecha(){
        const cuadroderecha=document.createElement("div");
        const flecharight = document.createElement("i");
        if (document.querySelector("body").classList.length==0) {
            cuadroderecha.style.backgroundColor="  #572EE5";
            flecharight.style.color="#F3F5F8"
        } else {
            cuadroderecha.style.backgroundColor="#F3F5F8";
            flecharight.style.color="#572EE5"
        }
    }


    static trendingHandlerEscritorio = (apiReturn) => {

        const data = this.traerDataApi(apiReturn);

        const divizquierda = document.createElement("div");
        divizquierda.classList.add("containerizquierda");




        if (this.trading == 0) {
            GiphyService.flechastrendingizquierda();
        } else {

            const cuadroizquierda = document.createElement("div");
            cuadroizquierda.classList.add("cuadroizquierda");


            const flechaleft = document.createElement("i");
            flechaleft.classList.add("fa")
            flechaleft.classList.add("fa-chevron-left")
            cuadroizquierda.appendChild(flechaleft);


            cuadroizquierda.addEventListener("click", () => {
                this.trading = (this.trading - 3);
                this.trending();

            })
            divizquierda.appendChild(cuadroizquierda);
        }



        containerEscritorio.appendChild(divizquierda);

        const ultrading = document.createElement("ul");
        ultrading.classList.add("javascript");
        containerEscritorio.appendChild(ultrading);

        data.forEach((gitItem) => {
            const {
                title,
                images,
                username,
                id
            } = gitItem;
            const imagedOriginal = images.original.url
            const imagedescarga= images.downsized.url
            console.log(data)

            const LisTrending = document.createElement("li");
            LisTrending.innerHTML = "<img class = img-gif src = " + imagedOriginal + " /> ";

            var label = document.createElement('label');
            LisTrending.appendChild(label);

            var div = document.createElement('div');
            div.classList.add("botones");

            ///corazon
            LisTrending.appendChild(div);

            var corazon = document.createElement('img');
            corazon.id = "corazon";
            corazon.setAttribute("idgif", id)

            corazon.src = "./assets/img/icon-fav-hover.svg";


            corazon.alt = "No activado el Megusta";
            corazon.addEventListener("click", () => {
           //     console.log(id)
                this.agregar_o_quitar_favorito(id);
            })
            div.appendChild(corazon);



            ///descargar

 
            var descargar = document.createElement('img');
            descargar.id = "descargar";
            descargar.src = "./assets/img/icon-download.svg";
            descargar.alt = "descargar";

            descargar.addEventListener("click", () => {

        
             console.log(title)
            })
            div.appendChild(descargar);

            ///ampliar
            var ampliar = document.createElement('img');
            ampliar.id = "ampliar";
            ampliar.src = "./assets/img/icon-max.svg";
            ampliar.alt = "ampliar";

            ampliar.addEventListener("click", () => {
             //   console.log(username)
                this.MaxImg(imagedOriginal, username, title, id);
            })

            div.appendChild(ampliar);

            /////////////
            var titulo = document.createElement('div');
            titulo.classList.add("informacion-gifo");

            titulo.innerHTML = "<span class=user>" + username + "</span><span class=titulo>" + title + "</span>";
            div.appendChild(titulo);

            ultrading.appendChild(LisTrending);

            this.validar_megusta();


        });

        const divderecha=document.createElement("div");
        divderecha.classList.add("containerderecha");

    
        /******************* */
            if (data.length != 3 ) { 
                    GiphyService.flechastrendingderecha();

                } else {

                    const cuadroderecha=document.createElement("div");
                    cuadroderecha.classList.add("cuadroderecha");

                        cuadroderecha.addEventListener("click", () => {
                            this.trading= (this.trading + 3);
                            this.trending() ;
                        })
                
                        divderecha.appendChild(cuadroderecha);

                        const flecharight = document.createElement("i");
                        flecharight.classList.add("fa")
                        flecharight.classList.add("fa-chevron-right")
                        cuadroderecha.appendChild(flecharight);
                        
                    }
                
        /********************* */




        containerEscritorio.appendChild(divderecha);


    
    }


    static buscarfavorito() {
        var vec = JSON.parse(localStorage.getItem("gif"));
        if (vec.length == 0) {
            const vacio = document.createElement("div");
            vacio.classList.add("contenedorVacio");
            vacio.innerHTML = "<img class = img_vacio src = ./assets/img/icon-fav-sin-contenido.svg  />         <h2>¡Guarda tu primer GIFO en Favoritos</h2><h2>para que se muestre aquí! </h2>";
            java_grid.appendChild(vacio);
        } else {
            let query = "";
            vec.forEach((id, index) => {
                if (index > 0) {
                    query += "," + id;
                } else {
                    query += id;
                }
            })
            //   var query =vec.replace('[', '').replace(/['"]+/g, '').replace(']', '');
            this.get({
                url: CONSTANTS.BASE_PATH,
                cadenaFavoritos: query,

            }, this.cargar_favoritos);
        }
    }

    static MaxImg(urlimg, usuario, titulo, id) {

        const PBody = document.querySelector("body");

        const section = document.createElement("div");
        section.classList.add("maximg")

        //section.innerHTML = "<i class='fa fa-times'></i>";
        PBody.appendChild(section);



        const containerMaxImg = document.createElement("div")
        containerMaxImg.classList.add("containerMaxImg")
        containerMaxImg.innerHTML = "<i class='fa fa-times'></i> <img class = img-gif src = " + urlimg + " /> ";
        section.appendChild(containerMaxImg);

        const cierre = document.querySelector(".fa-times");
        cierre.addEventListener("click", () => {
            PBody.removeChild(section);
            this.validar_megusta();

        })

        const divRowMaxImg = document.createElement("div")
        divRowMaxImg.classList.add("row")
        containerMaxImg.appendChild(divRowMaxImg);

        const divcolum = document.createElement("div")
        divcolum.classList.add("col-6")
        divRowMaxImg.appendChild(divcolum);

        divcolum.innerHTML = "<span class=user>" + usuario + "</span><span class=titulo>" + titulo + "</span>";
        divRowMaxImg.appendChild(divcolum);

        const divcolumb = document.createElement("div")
        divcolumb.classList.add("col-6")
        divRowMaxImg.appendChild(divcolumb);



        ///corazon

        var corazon = document.createElement('img');
        corazon.id = "corazonmax";



        if (this.validar_megusta_max(id) > -1) {
            corazon.src = "./assets/img/icon-fav-active.svg";
        } else {
            corazon.src = "./assets/img/icon-fav-hover.svg";
        }


        //corazon.style.opacity = "1";

        corazon.alt = "No activado el Megusta";
        corazon.addEventListener("click", () => {
            this.agregar_o_quitar_favorito_max(id)
        })
        divcolumb.appendChild(corazon);



        ///descargar
        var descargar = document.createElement('img');
        descargar.id = "descargar";
        descargar.src = "./assets/img/icon-download.svg";
        descargar.alt = "descargar";

        descargar.addEventListener("click", () => {
            //console.log(title)
        })
        divcolumb.appendChild(descargar);









    }


    /*********************** */
    static offsetnuevo = 0;

    static searchGif (palabra,offset=0)  {
        this.get({
            url:CONSTANTS.BASE_PATH + CONSTANTS.SEARCH,
            buscar:palabra,
            limit:12,
            offset:offset,
        }, this.searchHandler);
    }

    //////////
    static searchHandler(apiReturn) {
        var cont = 0;
        const data = GiphyService.traerDataApi(apiReturn);
     //   console.log(data)

        if (GiphyService.offsetnuevo == 0) {

            const tituloBusqueda = document.createElement("h1");
            tituloBusqueda.classList.add("tituloBusqueda")
            tituloBusqueda.textContent = document.getElementById("txt").value;
            document.getElementById("txt").value = "";
            contBusqueda.appendChild(tituloBusqueda);

            document.querySelector(".titulo-principal").classList.remove("ocultar");
            document.querySelector(".ilustra-header").classList.remove("ocultar");
            document.getElementById("buscar").classList.remove("fa-times");
            document.getElementById("buscar").classList.add("fa-search");

            document.getElementById("txt").attributes[1].textContent = "Busca GIFOS y más";


            document.getElementById("buscaractivo").style.display = "none"
            document.getElementById("txt").style.marginLeft = "55px"
        }

        var filas = Math.ceil(data.length / GiphyService.resolucion())
        if (data.length < 11) {
            var final = false;
        } else {
            var final = true;
        }


        for (let i = 1; i <= filas; i++) {

            const divRow = document.createElement("div");
            divRow.classList.add("row")

            for (let j = 1; j <= GiphyService.resolucion(); j++) {

                if (data[cont] != undefined) {
                    const divCol = document.createElement("div");
                    divCol.classList.add("col-6")

                    divRow.appendChild(divCol);

                    const divContainer = document.createElement("div");
                    divContainer.classList.add("container")

                    const {
                        id,
                        title,
                        username,
                        images
                    } = data[cont]

                    const imagedOriginal = images.original.url
                 


                    if (GiphyService.resolucion() == 4) {

                        divContainer.innerHTML = "<img class = img-gif src = " + imagedOriginal + " /> ";
                        divCol.appendChild(divContainer);


                        var label = document.createElement('label');


                        divContainer.appendChild(label);

                        var div = document.createElement('div');
                        div.classList.add("botones");

                        ///corazon
                        divContainer.appendChild(div);

                        var corazon = document.createElement('img');
                        corazon.id = "corazon";

                        corazon.setAttribute("idgif", id)

                        corazon.src = "./assets/img/icon-fav-hover.svg";
                        //corazon.style.opacity = "1";

                        corazon.alt = "No activado el Megusta";
                        corazon.addEventListener("click", () => {
                            GiphyService.agregar_o_quitar_favorito(id);
                        })
                        div.appendChild(corazon);

                        ///descargar
                        var descargar = document.createElement('img');
                        descargar.id = "descargar";
                        descargar.src = "./assets/img/icon-download.svg";
                        descargar.alt = "descargar";

                        descargar.addEventListener("click", () => {
                            console.log(title)
                           
                        })
                        div.appendChild(descargar);

                        ///ampliar
                        var ampliar = document.createElement('img');
                        ampliar.id = "ampliar";
                        ampliar.src = "./assets/img/icon-max.svg";
                        ampliar.alt = "ampliar";

                        ampliar.addEventListener("click", () => {
                            GiphyService.MaxImg(imagedOriginal, username, title, id);
                            console.log(username)
                        })

                        div.appendChild(ampliar);

                        /////////////
                        var titulo = document.createElement('div');
                        titulo.classList.add("informacion-gifo");
                        titulo.innerHTML = "<span class=user>" + username + "</span><span class=titulo>" + title + "</span>";
                        div.appendChild(titulo);

                        cont++;

                        divCol.appendChild(divContainer);

                    } else {

                        var imggif = document.createElement("img");
                        imggif.classList.add("img-gif")
                        imggif.src = imagedOriginal;
                        imggif.addEventListener("click", () => {
                            GiphyService.MaxImg(imagedOriginal, username, title, id);
                        })

                        divContainer.appendChild(imggif);
                        cont++;
                        divCol.appendChild(divContainer);
                    }
                }
            }

            contBusqueda.appendChild(divRow);
        }

        GiphyService.validar_megusta();

        if (final) {

            var vermas = document.createElement('div');
            vermas.classList.add("containerVermas");

            var boton = document.createElement('div');
            boton.classList.add("boton");
            boton.innerHTML = "<span class= vermas >VER MÁS</span>";

            boton.addEventListener("click", () => {
                var palabraBusqueda = document.querySelector(".tituloBusqueda").textContent;
                GiphyService.offsetnuevo = GiphyService.offsetnuevo + 12;
                GiphyService.searchGif(palabraBusqueda, GiphyService.offsetnuevo);
                contBusqueda.removeChild(vermas)

            })
            vermas.appendChild(boton);
            contBusqueda.appendChild(vermas);
        }
    }


    static sugerencias = (ingresado) => {
        this.get({
            url: CONSTANTS.PATH_SUGERENCIAS + '{' + ingresado + '}',
            limit: 4
        }, this.resulSugerencias);
    }

    static resulSugerencias(apisugerencias) {
        const { data } = apisugerencias;
        var barra = document.getElementById("barraBuscar");
        var completado = document.querySelector(".autocompletado");
        var txt = document.getElementById("txt");

        completado.innerHTML = "";
     

        if (data.length != 0) {
            document.querySelector(".contenedorBusqueda").innerHTML="";
            barra.style.height = "200px"
            data.forEach((item) => {
                const {
                    name
                } = item;


                document.querySelector(".contenedorBusqueda").style.display="initial"

                var lupa = document.createElement("i")
                lupa.classList=("fa-search")
                lupa.setAttribute("opcion", name)
                completado.appendChild(lupa)

                lupa.addEventListener("click",()=>{
                    document.querySelector(".autocompletado").innerHTML="";
                    barra.style.height = "50px";


                    txt.value=lupa.getAttribute("opcion")
                 //   console.log(txt.value)
                    GiphyService.offsetnuevo=0;
                    GiphyService.searchGif (txt.value);
                  
                   
                })

                var span = document.createElement("span")
                span.textContent = name;
                lupa.appendChild(span)
            })
        } else {
            document.querySelector(".contenedorBusqueda").style.display="none"
            barra.style.height = "50px"
        }
    }

////////////////////subir gif

static subirgif (urlfuente,etiquetas,urlvideo,archivovideo)  {
    this.get({
        url:CONSTANTS.BASE_PATH_UPLOAD,
        username:"juanestebanosoriolopera",
        source_image_url:urlvideo,
        tags:etiquetas,
        file:archivovideo,
        source_post_url:urlfuente,
    }, this.searchHandler);
}


}
export default GiphyService;



