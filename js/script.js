var iconos ={"txt":'<i class="fa-solid fa-note-sticky fa-2xl icon"></i>',
        "ERROR":'<i class="fa-solid fa-triangle-exclamation  fa-2xl icon"></i>',
        "folder":'<i class="fa-solid fa-folder fa-2xl icon"></i>',
        "img":'<i class="fa-solid fa-image fa-2xl icon"></i>',
        "mp3":'<i class="fa-solid fa-music fa-2xl icon"></i>'}

class Folder{

    constructor(nombre,ulPadre){
        this.ul = document.createElement("ul")
        this.ul.innerHTML = iconos["folder"]
        this.ul.innerHTML += nombre        
        if(ulPadre){
            ulPadre.append(this.ul)
        }
        this.anhadirBotonDeAnhadir()
        this.anhadirBotonEliminar()
        this.anhadirBotonExpandir()
    }
    anhadirElemento(nombre){
        let existeElemento = false
        Array.from(this.ul.children).forEach(function(hijo){
            if(["UL","LI"].includes(hijo.tagName)){
                if(hijo.childNodes[1].data == nombre){
                    existeElemento = true
                }
            }
        })
        if(existeElemento){
            return
        }

        if(nombre.split(".").length == 2){
            let archivo = document.createElement("li")
            archivo.innerHTML = iconos[nombre.split(".")[1]] || iconos["ERROR"]
            archivo.innerHTML += nombre
            this.ul.appendChild(archivo)
            this.anhadirBotonEliminar(archivo)
        }else if(nombre.split(".").length == 1){
            new Folder(nombre,this.ul)
        }
        buscador()
    }
    anhadirBotonDeAnhadir(){
        let botonAnhadir = document.createElement("button")
        botonAnhadir.innerHTML = "+"
        botonAnhadir.onclick=function(){this.anhadirElemento(document.getElementById("nombre").value )}.bind(this)
        this.ul.append(botonAnhadir)
    }
    anhadirBotonEliminar(elemento = this.ul){
        if(!elemento.parentElement || elemento.parentElement.tagName == "DIV" ){
            return
        }
        let buttonEliminar = document.createElement("button")
        buttonEliminar.innerHTML = "X"
        buttonEliminar.addEventListener("click",function(e){
            if(e.target.parentElement.querySelectorAll("ul, li").length == 0 && e.target.parentElement.parentElement.tagName != "DIV"){
                e.target.parentElement.remove()
            }
        })
        elemento.appendChild(buttonEliminar)
    }

    anhadirBotonExpandir(){
        let botonExpandir = document.createElement("button")
        botonExpandir.innerText = "^"
        botonExpandir.onclick = function(){
            this.ul.classList.toggle("contraer")
            if(botonExpandir.innerText == "v"){
                botonExpandir.innerText = "^"
            }else{
                botonExpandir.innerText = "v"
            }
        }.bind(this)
        
        this.ul.append(botonExpandir)
    }



    //pasado un "ul" como parametro devuelve un diccionario que representa su arbol
    exportar(listaUl){
        let diccionario = {}
        diccionario["nombre"] = listaUl.childNodes[1].data

        diccionario["elementos"] =  []
        Array.from(listaUl.children).forEach(function(elemento){
            if(elemento.tagName == "LI"){
                diccionario["elementos"].push(elemento.innerText.slice(0,-1))
            }else if(elemento.tagName == "UL"){
                diccionario["elementos"].push(this.exportar(elemento))
            }
        },this)
        return diccionario
    }
    //importa el arbol pasado como diccionario al objeto folder
    importar(diccionario){
        this.ul.innerHTML = iconos["folder"] 
        this.ul.innerHTML += diccionario["nombre"]
        this.anhadirBotonDeAnhadir()
        this.anhadirBotonEliminar()
        this.anhadirBotonExpandir()
        for (const archivo of diccionario["elementos"]) {
            if(typeof archivo == "string"){
                this.anhadirElemento(archivo)
            }else{
                new Folder(archivo["nombre"],this.ul).importar(archivo)
            }
        }
    }
}


// boton para generar un directorio de ejemplo
boton = document.createElement("button")
boton.innerText = "crear arbol de ejemplo"
document.getElementById("directorio").append(boton)
boton.onclick = function(){home.importar(dicc)}



home =new Folder("/")
document.getElementById("directorio").append(home.ul)




if(localStorage.arbol){
    home.importar(JSON.parse(localStorage["arbol"]))
}
window.onbeforeunload = function(){
    localStorage["arbol"] = JSON.stringify(home.exportar(home.ul))
}

/**
 * funcpoisdnads
 * @param {String} nombre 
 * @param {HTMLElement} ulEnElQueBuscar 
 * @returns 
 */
function buscar(nombre,ulEnElQueBuscar){
    ulEnElQueBuscar.title
    let resultado = []
    for (elemento of Array.from(ulEnElQueBuscar.children)) {
        if(!["UL","LI"].includes(elemento.tagName)){
            continue
        }
        if(elemento.childNodes[1].data.includes(nombre)){
            resultado.push(elemento)
        }
        if(elemento.tagName == "UL"){
            resultado.push(...buscar(nombre,elemento))
        }
    }
    return resultado
}

var resultadoDeBuscar = []

function buscador(){
    document.getElementById("resultadoBusqueda").innerHTML = ""
    let textoIntroducido =document.getElementById("busqueda").value
    if(textoIntroducido){
        resultadoDeBuscar = buscar(textoIntroducido,home.ul)
    }else{
        resultadoDeBuscar = []
    }
    resultadoDeBuscar.forEach(function(value){
        let nodo = value.cloneNode()
        nodo.appendChild(value.firstChild.cloneNode())
        nodo.innerHTML += value.childNodes[1].data
        console.log(value.childNodes)

        document.getElementById("resultadoBusqueda").appendChild(nodo)
    })
}
document.getElementById("busqueda").addEventListener("input",buscador)
//
//keyboard listener //hacer que al anhadir se actualize la busqueda








/**
 * asdasd
 * @type {String}
 */
let dicc = {
    "nombre": "/",
    "elementos": [
        "error.log",
        "console.log",
        "startup.log",
        {
            "nombre": "imagenes",
            "elementos": [
                "pato.img",
                "perro.img",
                "gato.img",
                "ornitorrinco.img",
                "loro.img"
            ]
        },
        {
            "nombre": "musica",
            "elementos": [
                "wrecking ball.mp3",
                "Ganga style.mp3",
                "darude sandstorm.mp3"
            ]
        },
        {
            "nombre": "notas",
            "elementos": [
                "nota1.txt",
                "nota2.txt",
                "nota3.txt",
                "nota4.txt",
                "nota5.txt",
                {
                    "nombre": "notas importantes",
                    "elementos": [
                        "nota importante 1.txt",
                        "nota importante 2.txt",
                        "nota importante 3.txt",
                        "nota imporante 4.txt",
                        "nota importante 5.txt",
                        {
                            "nombre": "notas super importantes",
                            "elementos": [
                                "receta de la cangreburguer.txt"
                            ]
                        }
                    ]
                }
            ]
        },
        "shutdown.log",
        "stadistics.log"
    ]
}


