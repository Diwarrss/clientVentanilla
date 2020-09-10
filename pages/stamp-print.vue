<template>
  <el-card class="box-card stamp_print">
    <div
      slot="header"
      class="clearfix">
      <span> <i class="fas fa-print"/>  <i class="fas fa-barcode"/> Imprimir Sello <span class="font-weight-bold">#{{ numberFiling }}</span></span>
    </div>
    <b-row class="container-fluid">
      <div class="col-md-4 mr-5">
        <b-row>
          <b-col
            md="12"
            class="info_stamp mb-3 pt-2 pb-2">
            <span class="font-weight-bold">Radicado: </span>{{ filing.settled }} <br>
            <span class="font-weight-bold">Fecha: </span>{{ filing.created_at }} <br>
            <span class="font-weight-bold">Titulo: </span>{{ filing.title }} <br>
            <span class="font-weight-bold">Remitente: </span>{{ filing.people.names }} <br>
            <span class="font-weight-bold">Destinatario(s): </span><span v-for="(item, index) in filing.dependences" :key="index"><span v-if="index > 0" class="font-weight-bold"> - </span>{{ item.names }}</span> <br>
            <span class="font-weight-bold">Anexos: </span>{{ filing.annexes }}
          </b-col>
          <b-col md="6">
            <b-button
              variant="success"
              @click.prevent="stampPrint"> <i class="fas fa-print"/> Imprimir</b-button>
          </b-col>
          <b-col md="6">
            <b-button
              variant="danger"
              @click.prevent="windowClose"> <i class="fas fa-times-circle"/> Cerrar</b-button>
          </b-col>
        </b-row>
      </div>
      <div class="page_print">
        <div id="cuadro" class="estiloCuadro">prueba</div>
        <SCRIPT type="text/javascript">
          var el = document.getElementById("cuadro");
          if (el.addEventListener){
              el.addEventListener("mousedown", ratonPulsado, false);
              el.addEventListener("mouseup", ratonSoltado, false);
              document.addEventListener("mousemove", ratonMovido, false);
          } else { //Para IE
              el.attachEvent('onmousedown', ratonPulsado);
              el.attachEvent('onmouseup', ratonSoltado);
              document.attachEvent('onmousemove', ratonMovido);
          }
        </SCRIPT>
      </div>
    </b-row>
  </el-card>
  <!-- <div>
    <h1>IMPRIMIR RADICADO # {{ $route.query.numberFiling }} ID {{ $route.query.id }} </h1>
    <div v-if="$route.query.numberFiling">
      <barcode v-bind:value="$route.query.numberFiling" font-size="12" width="1" height="50" :options="{ format: 'EAN8'}"></barcode>
    </div>
  </div> -->
</template>
<script type="text/javascript">
  var xInic, yInic;
  var estaPulsado = false;

  function ratonPulsado(evt) {
    //Obtener la posición de inicio
    xInic = evt.clientX;
    yInic = evt.clientY;
    estaPulsado = true;
    //Para Internet Explorer: Contenido no seleccionable
    document.getElementById("cuadro").unselectable = true;
  }

  function ratonMovido(evt) {
    if(estaPulsado) {
      //Calcular la diferencia de posición
      var xActual = evt.clientX;
      var yActual = evt.clientY;
      var xInc = xActual-xInic;
      var yInc = yActual-yInic;
      xInic = xActual;
      yInic = yActual;

      //Establecer la nueva posición
      var elemento = document.getElementById("cuadro");
      var position = getPosicion(elemento);
      elemento.style.top = (position[0] + yInc) + "px";
      elemento.style.left = (position[1] + xInc) + "px";
    }
  }

  function ratonSoltado(evt) {
    estaPulsado = false;
  }

  /*
    * Función para obtener la posición en la que se encuentra el
    * elemento indicado como parámetro.
    * Retorna un array con las coordenadas x e y de la posición
    */
  function getPosicion(elemento) {
    var posicion = new Array(2);
    if(document.defaultView && document.defaultView.getComputedStyle) {
      posicion[0] = parseInt(document.defaultView.getComputedStyle(elemento, null).getPropertyValue("top"))
      posicion[1] = parseInt(document.defaultView.getComputedStyle(elemento, null).getPropertyValue("left"));
    } else {
      //Para Internet Explorer
      posicion[0] = parseInt(elemento.currentStyle.top);
      posicion[1] = parseInt(elemento.currentStyle.left);
    }
    return posicion;
  }
</script>
<script>
export default {
  computed: {
    numberFiling() {
      return this.$route.query.numberFiling
    }
  },
  methods: {
    stampPrint() {
      console.log('Impresion')
    },
    windowClose() {
      window.close()
    }
  },
  async asyncData({ app, route, store }) {
    let { data: filing } = await app.$axios.get(
      `/entry-filing/${route.query.id}`
    )
    return { filing }
  }
}
</script>
<style lang="scss">
.stamp_print {
  .info_stamp {
    border: solid 1px black;
  }
  .page_print {
    border: solid 1px black;
    height: 632px;
    width: 446px;
  }
  .content_page{
    border: solid 1px black;
    height: 80px;
    width: 160px;
  }
  .estiloCuadro {
    width: 10em;
    border: solid red;
    position: absolute;
    top: 100px;
    left: 30px;
    cursor: pointer;
    /*Deshabilitar selección de texto*/
    -moz-user-select: none;     /* Mozilla */
    -khtml-user-select: none;   /* Chrome */
    -o-user-select: none;       /* Opera */
  }
}
</style>
