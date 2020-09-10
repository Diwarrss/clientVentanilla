<template>
  <div class="row">
    <div class="col-sm-3 col-md-2 col-lg-2">
      <div class="form-group">
        <div class="input-group">
          <select
            v-model="per_page_table"
            class="form-control"
            @change="getData()"
          >
            <option
              value="5"
              selected>5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-5 col-lg-5">
      <div class="form-group">
        <div class="input-group">
          <select
            v-model="filter"
            class="form-control">
            <option
              value="email"
              selected>E-Mail</option>
            <option value="nombres">Nombre</option>
            <option value="celular">Celular</option>
          </select>
          <!-- keydown para ejecutar cuando vayan escribiendo -->
          <input
            v-model="value"
            type="text"
            placeholder="Escriba aquí"
            class="form-control"
          >
          <span class="input-group-append">
            <button
              type="button"
              class="btn btn-primary"
            >
              <i
                class="fa fa-search"
                aria-hidden="true"/> Buscar
            </button>
          </span>
        </div>
      </div>
    </div>
    <div class="col-md-5 mt-1">
      <strong>Cant. Registros:</strong> {{ allData.total }}
    </div>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr v-if="columns">
            <th
              v-for="(item, index) in tableFields"
              :id="item.name"
              :key="index"
              scope="col">
              {{ item.title }}
            </th>
          </tr>
        </thead>
        <tbody v-if="paginate">
          <tr v-if="!allData.total">
            <td
              :colspan="countVisibleFields"
              class="alert alert-info text-center"
            >Sin Datos!</td>
          </tr>
          <tr
            v-for="(data, keyIndex) in allData.data"
            v-else
            :key="keyIndex"
            :item-index="keyIndex"
          >
            <template>
              <td
                v-for="(field, fieldIndex) in tableFields"
                v-if="field.visible"
                :key="fieldIndex"
                :class="bodyClass('vuetable-td-'+field.name, field)"
                :style="{width: field.width}"
                v-html="renderNormalField(field, data)"
              />
            </template>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-if="!allData.length">
            <td
              :colspan="countVisibleFields"
              class="alert alert-info text-center"
            >Sin Datos!</td>
          </tr>
          <tr
            v-for="(data, keyIndex) in allData"
            :key="keyIndex"
            :item-index="keyIndex"
          >
            <template>
              <td
                v-for="(field, fieldIndex) in tableFields"
                v-if="field.visible"
                :key="fieldIndex"
                :class="bodyClass('vuetable-td-'+field.name, field)"
                :style="{width: field.width}"
                v-html="renderNormalField(field, data)"
              />
            </template>
          </tr>
        </tbody>
      </table>
      <!-- Implementa el vue pagination para poder cambiar pagina -->
      <pagination
        v-if="paginate"
        :data="allData"
        :limit="1"
        align="center"
        @pagination-change-page="getData"
      />
    </div>
  </div>

</template>
<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    api_url: String, //url de la api method get server
    columns: { type: [Object, Array], required: true }, //El header de la tabla
    data_local: { type: [Object, Array], default: Object }, //json con la informacion local
    actions: { type: Object, default: Object },
    per_page: { type: Number, default: 5 }, //datos por pagina
    paginate: { type: Boolean, default: true } //para paginar
  },
  data() {
    return {
      allData: {},
      tableFields: [],
      per_page_table: this.per_page,
      filter: [],
      value: ''
    }
  },
  computed: {
    //validar si no hay datos
    countVisibleFields() {
      return this.tableFields.length
    }
  },
  created() {
    //verificamos si viene url si no igualamos la variable allData = data
    if (this.api_url) {
      this.getData()
    } else {
      this.allData = this.data_local
    }
    this.normalizeFields()
  },
  methods: {
    getData(page = 1) {
      let me = this
      //si recibimos una pagina
      if (me.paginate) {
        me.$axios
          .get(me.api_url + '?page=' + page, {
            params: {
              per_page: me.per_page_table,
              paginate: me.paginate,
              page: page
            }
          })
          .then(res => {
            me.allData = res.data
            //console.log(res);
          })
      } else {
        me.$axios
          .get(me.api_url, {
            params: {
              per_page: me.per_page_table,
              paginate: me.paginate
            }
          })
          .then(res => {
            me.allData = res.data
            //console.log(res);
          })
      }
    },
    warn(msg) {
      if (!this.silent) {
        console.warn(msg)
      }
    },
    normalizeFields() {
      if (typeof this.columns === 'undefined') {
        this.warn('You need to provide "fields" prop.')
        return
      }

      this.tableFields = []

      this.columns.forEach((field, i) => {
        this.tableFields.push(this.newField(field, i))
      })
      //console.log(this.tableFields)
    },
    newField(field, index) {
      let defaultField = {
        name: '',
        // title:
        // this allow the code to detect undefined title
        // and replace it with capitalized name instead
        titleClass: '',
        dataClass: '',
        sortField: null,
        formatter: null,
        visible: true,
        width: null,
        $_index: index
      }

      if (typeof field === 'string') {
        return Object.assign({}, defaultField, {
          name: this.normalizeFieldName(field),
          title: this.makeTitle(field)
        })
      }

      let obj = Object.assign({}, defaultField, field)
      obj.name = this.normalizeFieldName(obj.name)
      if (obj.title === undefined) {
        obj.title = this.makeTitle(obj.name)
      }
      if (obj.formatter !== null && typeof obj.formatter !== 'function') {
        console.error(obj.name + ' field formatter must be a function')
        obj.formatter = null
      }
      return obj
    },
    normalizeFieldName(fieldName) {
      if (fieldName instanceof Object) return fieldName

      return (
        typeof fieldName === 'string' &&
        fieldName.replace('__', this.fieldPrefix)
      )
    },
    makeTitle(str) {
      if (this.isFieldComponent(str)) {
        return ''
      }

      return this.titleCase(str.replace('.', ' '))
    },
    isFieldComponent(fieldName) {
      if (fieldName instanceof Object) {
        // let's assume it is a Vue component
        return true
      }

      return (
        fieldName.slice(0, this.fieldPrefix.length) === this.fieldPrefix ||
        fieldName.slice(0, 2) === '__'
      )
    },
    titleCase(str) {
      return str.replace(/\w+/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    },
    bodyClass(base, field) {
      return [base, field.dataClass]
    },
    renderNormalField(field, item) {
      return this.hasFormatter(field)
        ? this.callFormatter(field, item)
        : this.getObjectValue(item, field.name, '')
    },
    hasFormatter(item) {
      return typeof item.formatter === 'function'
    },
    callFormatter(field, item) {
      if (!this.hasFormatter(field)) return

      if (typeof field.formatter === 'function') {
        return field.formatter(this.getObjectValue(item, field.name), this)
      }
    },
    //comparamos los valores del data vs fields
    getObjectValue(object, path, defaultValue) {
      defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue

      let obj = object
      if (path.trim() != '') {
        let keys = path.split('.')
        keys.forEach(key => {
          if (
            obj !== null &&
            typeof obj[key] !== 'undefined' &&
            obj[key] !== null
          ) {
            obj = obj[key]
          } else {
            obj = defaultValue
            return
          }
        })
      }
      return obj
    }
  }
}
</script>
