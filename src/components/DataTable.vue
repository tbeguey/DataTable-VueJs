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
        <a class="btn btn-primary btn-lg btn-success" href="#modal_add_row"><i class="icon icon-plus"></i>  AJOUTER UNE LIGNE</a>
      </div>
      <div class="column col-3">
        <button class="btn btn-primary btn-lg btn-error" @click="model.delete_rows()" ><i class="icon icon-minus"></i>  SUPPRIMER LA SELECTION</button>
      </div>
      <div class="column col-4 col-mx-auto">
        <div class="has-icon-left">
          <input type="text" class="form-input" placeholder="Filtrer par mots-clefs" @change="model.filter()" v-model="model.search">
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
                  <input type="checkbox" id="select_all_box" v-model="model.check_all" @change="model.select_all()">
                  <i class="form-icon"></i>
                </label>
              </div>
            </th>
            <th v-for="key in Object.keys(model.data_rows[0])" @click="model.sort(key)">
              {{key}}
            </th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th></th>
            <th v-for="key in Object.keys(model.data_rows[0])">
              <div class="has-icon-left">
                <input type="text" class="form-input filter-column" placeholder="Filtrer" @change="filter_column()" :name="key">
                <i class="form-icon icon icon-search"></i>
              </div>
            </th>
            <th>
              <button class="btn btn-primary btn-action btn-lg btn-error tooltip" data-tooltip="Vider les filtres" @click="clear_filter_columns()">
                <i class="form-icon icon icon-refresh"></i>
              </button>
            </th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="entry in model.rows_display">
            <td>
              <div class="form-group">
                <label class="form-checkbox">
                  <input class="select_checkbox" type="checkbox" v-model="model.checked_rows" :value="model.data_rows.indexOf(entry)">
                  <i class="form-icon"></i>
                </label>
              </div>
            </td>
            <td v-for="key in Object.keys(model.rows_display[0])" @dblclick="model.edit_cell(model.data_rows.indexOf(entry), key)" >
              <span v-if="String(model.data_rows.indexOf(entry)) + String(key) !== model.edited_cell">{{entry[key]}}</span>
              <input type="text" v-model="entry[key]" v-else v-on:keyup.enter="model.edited_cell = ''"/>
            </td>
            <td>
              <button class="btn btn-primary btn-action btn-lg  tooltip" data-tooltip="Editer" @click="">
                <i class="icon icon-edit"></i>
              </button>
            </td>
            <td>
              <button class="btn btn-primary btn-action btn-lg  tooltip" data-tooltip="Supprimer" @click="model.delete_row(model.data_rows.indexOf(entry))">
                <i class="icon icon-delete"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <p id="no-data" v-if="model.rows_display.length === 0"> <b> Aucune donnée disponible. </b> </p>

        <span> <b>{{model.start_index}}</b> à <b>{{model.end_index}}</b> sur <b>{{model.data_rows.length}}</b> éléments.</span>
        <ul class="pagination">
          <li class="page_item">
            <a class="page_btn" @click="model.first_page()"><<</a>
          </li>
          <li class="page_item">
            <a class="page_btn" @click="model.previous_page()"><</a>
          </li>
          <li v-for="n in model.number_pages" class="page-item" v-bind:class="{'active' : model.selected_index === n}" @click="model.select_page(n)" v-if="n <= model.selected_index + 2 && n >= model.selected_index - 2">
            <a href="#">{{n}}</a>
          </li>
          <li class="page_item">
            <a class="page_btn" @click="model.next_page()">></a>
          </li>
          <li class="page_item">
            <a class="page_btn" @click="model.last_page()">>></a>
          </li>
        </ul>
      </div>
    </div>

    <div class="modal" id="modal_add_row">
      <a href="#close" class="modal-overlay" aria-label="Close"></a>
      <div class="modal-container">
        <div class="modal-header">
          <a href="#close" class="btn btn-clear float-right" aria-label="Close"></a>
          <div class="modal-title h5">Ajout d'une ligne</div>
        </div>
        <div class="modal-body">
          <div class="content">
            <div class="form-group">
              <div v-for="key in Object.keys(model.data_rows[0])">
                <input class="form-input" type="text" :placeholder="key">
                <br>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary btn-success">
            <i class="icon icon-check"></i> VALIDER
          </button>
        </div>
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
      filter_column : function() {
        var all_search = [];

        var search_box = document.getElementsByClassName('filter-column');
        for(var i = 0; i < search_box.length; i++){
          var item = search_box[i];
          if(item.value !== "")
            all_search.push({column : item.name, search : item.value});
        }

        model.all_search = all_search;
        model.filter();
      },


      clear_filter_columns : function() {
        var search_box = document.getElementsByClassName('filter-column');
        for(var i = 0; i < search_box.length; i++){
          var item = search_box[i];
          item.value = "";
        }
        model.all_search = [];
        model.filter();
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

  td > span {
    cursor :pointer;
  }

  #no-data {
    text-align: center;
  }

  .page_btn {
    cursor : pointer;
    margin: 10px;
  }
</style>
