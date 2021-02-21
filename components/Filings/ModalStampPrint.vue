<template>
  <!-- Modal Imprimir Sello -->
  <section class="modal_print_stamp">
    <b-modal
      id="bv_modal_stamp"
      ref="bv_modal_stamp"
      size="md"
      no-close-on-esc
      no-close-on-backdrop
      hide-footer>
      <template v-slot:modal-title>
        <i class="fas fa-print"/>  <i class="fas fa-barcode"/> Imprimir Sello <span class="font-weight-bold">#{{ form.settled }}</span>
      </template>
      <div
        id="page_print"
        class="page_print mb-2">
        <b-col
          v-drag
          class="move_div_stamp move_stamp m-1 p-1">
          <div class="content_logo">
            <img :src="urlServe+company.logo" class="img_settled mt-1">
            <barcode
              :value="form.settled"
              :options="{ format: 'EAN8'}"
              font-size="8"
              width="1"
              height="30"/>
          </div>
          <!-- <span class="font-weight-bold">Radicado: </span>{{ form.settled }} <br> -->
          <span class="font-weight-bold">Fecha prueba: </span>{{ form.date }} <br>
          <span class="font-weight-bold">Titulo: </span>{{ form.title }} <br>
          <span class="font-weight-bold">Remitente: </span>{{ infoPeople ? infoPeople.names : '' }} <br>
          <span class="font-weight-bold">Destinatario(s): </span>
          <span
            v-for="(item, index) in infoAddressee"
            :key="index">
            <span
              v-if="index > 0"
              class="font-weight-bold"> - </span>{{ item.names }}
          </span> <br>
          <span class="font-weight-bold">Anexos: </span>{{ form.annexes }} <span class="font-weight-bold"> Folios: </span>{{ form.folios }}
        </b-col>
      </div>
      <div class="page_print_plus"/>
      <b-row class="flex justify-content-center mt-3">
        <b-button
          variant="success"
          class="m-2"
          @click.prevent="generatePDF(1)"> <i class="fas fa-print"/> Imprimir Carta</b-button>
        <b-button
          variant="primary"
          class="m-2"
          @click.prevent="generatePDF(2)"> <i class="fas fa-print"/> Imprimir Oficio</b-button>
        <b-button
          variant="danger"
          class="m-2"
          @click.prevent="closeModalStampPrint"> <i class="fas fa-times-circle"/> Cerrar</b-button>
        <b-col md="6"/>
        <b-col md="6"/>
      </b-row>
    </b-modal>
    <vue-html2pdf
      ref="html2Pdf"
      :show-layout="false"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1700"
      :pdf-quality="2"
      :manual-pagination="false"
      :pdf-format="paperSize"
      filename="Sello"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)">
      <section
        slot="pdf-content"
        :style="selectPaper === 1 ? 'height: 1050px;' : 'height: 1340px;'"
        class="info_stamp">
        <b-col
          v-drag
          :style="styleDrag"
          class="move_div_stamp_pdf m-1 p-1">
          <div class="content_logo">
            <img :src="`img/companyLogo/${company.logo_name}`" class="img_settled mt-2">
            <barcode
              :value="form.settled"
              :options="{ format: 'EAN8'}"
              font-size="10"
              width="1"
              height="30"/>
          </div>
          <!-- <span class="font-weight-bold">Radicado: </span>{{ form.settled }} <br> -->
          <span class="font-weight-bold">Fecha: </span>{{ form.date }} <br>
          <span class="font-weight-bold">Titulo: </span>{{ form.title }} <br>
          <span class="font-weight-bold">Remitente: </span>{{ infoPeople ? infoPeople.names : '' }} <br>
          <span class="font-weight-bold">Destinatario(s): </span>
          <span
            v-for="(item, index) in infoAddressee"
            :key="index">
            <span
              v-if="index > 0"
              class="font-weight-bold"> - </span>{{ item.names }}
          </span> <br>
          <span class="font-weight-bold">Anexos: </span>{{ form.annexes }} <span class="font-weight-bold"> Folios: </span>{{ form.folios }}
        </b-col>
      </section>
    </vue-html2pdf>
  </section>
</template>
<script>
import { EventBus } from '~/plugins/event-bus'
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    infoPeople: {
      type: Object,
      default: () => {}
    },
    infoAddressee: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      styleDrag: '',
      selectPaper: 1
    }
  },
  computed: {
    paperSize() {
      return this.selectPaper === 1 ? 'letter' : 'legal'
    },
    company() {
      return this.$store.state.company.company
    },
    urlServe() {
      return process.env.filesBaseUrl
    }
  },
  created() {
    EventBus.$on('showModalPrint', () => {
      setTimeout(() => {
        this.$refs['bv_modal_stamp'].show()
      }, 500)
    })
  },
  methods: {
    closeModalStampPrint() {
      this.styleDrag = '',
      this.$refs['bv_modal_stamp'].hide()
    },
    //generando el pdf para imprimir
    onProgress(event) {
      //console.log(event)
    },
    hasStartedGeneration() {
      //console.log('hasStartedGeneration')
    },
    hasGenerated(event) {
      //console.log(event)
    },
    generatePDF(val) {
      this.selectPaper = val
      //val === 1 ? this.selectPaper = 1 : this.selectPaper = 2
      const element = document.querySelector('.move_stamp')
      const left = element ? element.style.left.slice(0, -2) * 2 + 'px' : 0
      const top = element ? element.style.top.slice(0, -2) * 2 + 'px' : 0

      this.styleDrag = `left: ${left}; top: ${top};`
      //console.log(this.styleDrag)
      setTimeout(() => {
        this.$refs.html2Pdf.generatePdf()
      }, 500)
    }
  }
}
</script>
<style lang="scss">
.page_print {
  border: solid 2px #3a9d5d;
  width: 450px;
  height: 575px; //carta
}
.page_print_plus {
  border: solid 2px #20a8d8;
  width: 450px;
  height: 135px; //restante oficio
}
.info_stamp {
  //border: solid 1px black;
  width: 595px;
}
.move_div_stamp {
  //position: absolute;
  //border: 1px solid #000;
  line-height: 6px;
  font-size: 10px;
  //height: 120px;
  width: 200px;
  cursor: pointer;
  &.move_stamp {
    border: 1px solid #000;
    line-height: 6px;
    font-size: 7px;
    //height: 100px;
    width: 210px;
    &:hover {
      background-color: #c0c4cc;
    }
  }
  .vue-barcode-element {
    width: 165px;
  }
  .content_logo{
    width: 100%;
    display: flex;
    align-items: flex-start;
    .img_settled{
      height: 40px;
      width: 40px;
    }
  }
}
.move_div_stamp_pdf {
  //position: absolute;
  //border: 1px solid #000;
  line-height: 12px;
  font-size: 12px;
  //height: 120px;
  width: 350px;
  cursor: pointer;
  &.move_stamp {
    border: 1px solid #000;
    line-height: 6px;
    font-size: 4px;
    //height: 100px;
    width: 130px;
    &:hover {
      background-color: #c0c4cc;
    }
  }
  .vue-barcode-element {
    height: 100px;
    width: 250px;
  }
  .content_logo{
    width: 100%;
    display: flex;
    align-items: flex-start;
    .img_settled{
      height: 80px;
      width: 60px;
    }
  }
}
</style>
