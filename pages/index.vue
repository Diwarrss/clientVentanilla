<template>
  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix">
      <i class="fas fa-mail-bulk"/>
      <span> Dashboard</span>
    </div>
    <CardLine1ChartExample/>
  </el-card>
  <!-- <div class="animated fadeIn">
    <b-row>
      <b-col
        sm="6"
        lg="3">
        <b-card
          no-body
          class="bg-primary">
          <b-card-body class="pb-0">
            <b-dropdown
              class="float-right"
              variant="transparent p-0"
              right>
              <template slot="button-content">
                <i class="icon-settings"/>
              </template>
              <b-dropdown-item>Action</b-dropdown-item>
              <b-dropdown-item>Another action</b-dropdown-item>
              <b-dropdown-item>Something else here...</b-dropdown-item>
              <b-dropdown-item disabled>Disabled action</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">9.823</h4>
            <p>Members online</p>
          </b-card-body>
          <card-line1-chart-example
            class="chart-wrapper px-3"
            style="height:70px;"
            height="70"/>
        </b-card>
      </b-col>
    </b-row>
  </div> -->
</template>
<script>
import CardLine1ChartExample from '~/components/dashboard/CardLine1ChartExample'
export default {
  name: 'Dashboard',
  components: {
    CardLine1ChartExample
  }
}
</script>
