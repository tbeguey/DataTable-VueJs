<template>
  <div class="container">
    <div class="columns">
      <div class="column col-1">
        <div class="form-group">
          <label for="range">Elements par page :</label>
          <select id="range" class="form-select" @change="model.update()" v-model="model.range">
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <div class="column col-3">
        <div class="has-icon-left">
          <input type="text" class="form-input" placeholder="Filtrer par texte" @change="model.filter()" v-model="model.search">
          <i class="form-icon icon icon-search"></i>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column col-10 col-mx-auto">
        <table class="table table-striped table-hover">
          <thead>
          <tr>
            <th>
              <div class="form-group">
                <label class="form-checkbox">
                  <input type="checkbox" id="select_all_box" @change="select_all()">
                  <i class="form-icon"></i>
                </label>
              </div>
            </th>
            <th v-for="key in Object.keys(model.data_rows[0])" @click="model.sort(key)">
              {{key}}
            </th>

          </tr>
          </thead>
          <tbody>
          <tr v-for="entry in model.rows_display">
            <td>
              <div class="form-group">
                <label class="form-checkbox">
                  <input class="select_checkbox" type="checkbox">
                  <i class="form-icon"></i>
                </label>
              </div>
            </td>
            <td v-for="key in Object.keys(model.rows_display[0])">
              {{entry[key]}}
            </td>
            <td>
              <button class="btn btn-primary btn-action btn-lg btn-success">
                <i class="icon icon-edit"></i>
              </button>
            </td>
            <td>
              <button class="btn btn-primary btn-action btn-lg btn-error">
                <i class="icon icon-delete"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <span> <b>{{model.start_index}}</b> à <b>{{model.end_index}}</b> sur <b>{{model.data_rows.length}}</b> éléments.</span>
        <ul class="pagination">
          <li class="page-item active">
            <a href="#">1</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  let Model = require('./Model');
  let model = new Model.Model("https://raw.githubusercontent.com/vega/ipyvega/master/notebooks/cars.json");
  export default {

    name: 'DataTable',
    data () {
      return {
        model : model
      }
    },

    methods : {
      select_all : function() {
        var all_checkbox = document.getElementsByClassName('select_checkbox');
        for(var i = 0; i < all_checkbox.length; i++){
          var item = all_checkbox[i];

          if(document.getElementById('select_all_box').checked == true)
            item.checked = true;
          else
            item.checked = false;
        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pagination {
    float: right;
  }

  th {
    cursor: pointer;
  }
</style>
